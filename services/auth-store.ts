import crypto from "crypto";
import { promises as fs } from "fs";
import path from "path";
import type { AuthUser, InteractionResponse, Outfit, Profile } from "@/types";

const DB_PATH = path.join(process.cwd(), "data", "account-db.json");
const SESSION_COOKIE = "svan_session";
const SESSION_DAYS = 30;

interface StoredUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
  followerCount: number;
  followingCount: number;
  outfitIds: string[];
  likedIds: string[];
  savedIds: string[];
}

interface StoredSession {
  tokenHash: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
}

interface AccountDb {
  users: StoredUser[];
  sessions: StoredSession[];
}

const emptyDb: AccountDb = {
  users: [],
  sessions: []
};

export { SESSION_COOKIE, SESSION_DAYS };

async function readDb(): Promise<AccountDb> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    const parsed = JSON.parse(raw) as AccountDb;
    return {
      users: parsed.users ?? [],
      sessions: parsed.sessions ?? []
    };
  } catch {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await writeDb(emptyDb);
    return { ...emptyDb };
  }
}

async function writeDb(db: AccountDb) {
  await fs.writeFile(DB_PATH, `${JSON.stringify(db, null, 2)}\n`, "utf8");
}

function hashPassword(password: string, salt: string) {
  return crypto.pbkdf2Sync(password, salt, 120_000, 64, "sha512").toString("hex");
}

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function publicUser(user: StoredUser): AuthUser {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    displayName: user.displayName,
    avatar: user.avatar,
    bio: user.bio
  };
}

function toProfile(user: StoredUser): Profile {
  return {
    username: user.username,
    displayName: user.displayName,
    avatar: user.avatar,
    bio: user.bio,
    followerCount: user.followerCount,
    followingCount: user.followingCount,
    outfitIds: user.outfitIds,
    savedIds: user.savedIds,
    likedIds: user.likedIds,
    isViewer: true
  };
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function makeUsername(displayName: string, email: string, users: StoredUser[]) {
  const base =
    displayName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ".")
      .replace(/^\.+|\.+$/g, "") ||
    email.split("@")[0]?.replace(/[^a-z0-9]+/gi, ".").toLowerCase() ||
    "svan.user";

  let username = base;
  let suffix = 2;
  while (users.some((user) => user.username === username)) {
    username = `${base}.${suffix}`;
    suffix += 1;
  }
  return username;
}

function avatarFor(displayName: string) {
  const initials = displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "SV";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><rect width="160" height="160" fill="#0F4C3A"/><circle cx="128" cy="24" r="60" fill="#B9864F" opacity=".55"/><text x="80" y="94" text-anchor="middle" font-family="Arial, sans-serif" font-size="54" font-weight="700" fill="#fff">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function parseCookie(header: string | null, name: string) {
  return header
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

export function sessionTokenFromRequest(request: Request) {
  return parseCookie(request.headers.get("cookie"), SESSION_COOKIE);
}

export async function createAccount(input: {
  email: string;
  password: string;
  displayName: string;
}) {
  const email = normalizeEmail(input.email);
  const displayName = input.displayName.trim();
  const password = input.password;

  if (!email.includes("@")) throw new Error("Enter a valid email.");
  if (password.length < 8) throw new Error("Password must be at least 8 characters.");
  if (displayName.length < 2) throw new Error("Enter your name.");

  const db = await readDb();
  if (db.users.some((user) => user.email === email)) {
    throw new Error("An account with this email already exists.");
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const user: StoredUser = {
    id: crypto.randomUUID(),
    email,
    username: makeUsername(displayName, email, db.users),
    displayName,
    avatar: avatarFor(displayName),
    bio: "Building a personal outfit archive on SVAN.",
    passwordHash: hashPassword(password, salt),
    salt,
    createdAt: new Date().toISOString(),
    followerCount: 0,
    followingCount: 0,
    outfitIds: [],
    likedIds: [],
    savedIds: []
  };

  db.users.push(user);
  await writeDb(db);
  return createSessionForUser(user.id);
}

export async function authenticate(emailInput: string, password: string) {
  const db = await readDb();
  const email = normalizeEmail(emailInput);
  const user = db.users.find((item) => item.email === email);
  if (!user) throw new Error("Email or password is incorrect.");

  const incomingHash = hashPassword(password, user.salt);
  const stored = Buffer.from(user.passwordHash, "hex");
  const incoming = Buffer.from(incomingHash, "hex");
  if (stored.length !== incoming.length || !crypto.timingSafeEqual(stored, incoming)) {
    throw new Error("Email or password is incorrect.");
  }

  return createSessionForUser(user.id);
}

export async function createSessionForUser(userId: string) {
  const db = await readDb();
  const user = db.users.find((item) => item.id === userId);
  if (!user) throw new Error("Account not found.");

  const token = crypto.randomBytes(32).toString("base64url");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  db.sessions = db.sessions.filter(
    (session) => new Date(session.expiresAt).getTime() > now.getTime()
  );
  db.sessions.push({
    tokenHash: hashToken(token),
    userId,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString()
  });
  await writeDb(db);

  return { token, user: publicUser(user) };
}

export async function clearSession(token: string | undefined) {
  if (!token) return;
  const db = await readDb();
  db.sessions = db.sessions.filter((session) => session.tokenHash !== hashToken(token));
  await writeDb(db);
}

export async function getUserBySessionToken(token: string | undefined) {
  if (!token) return null;
  const db = await readDb();
  const tokenHash = hashToken(token);
  const now = Date.now();
  const session = db.sessions.find(
    (item) => item.tokenHash === tokenHash && new Date(item.expiresAt).getTime() > now
  );
  if (!session) return null;
  const user = db.users.find((item) => item.id === session.userId);
  return user ?? null;
}

export async function getAuthUserFromRequest(request: Request) {
  const user = await getUserBySessionToken(sessionTokenFromRequest(request));
  return user ? publicUser(user) : null;
}

export async function getStoredUserFromRequest(request: Request) {
  return getUserBySessionToken(sessionTokenFromRequest(request));
}

export async function getProfileForUser(username: string) {
  const db = await readDb();
  const user = db.users.find((item) => item.username === username);
  return user ? { stored: user, profile: toProfile(user) } : null;
}

export async function toggleInteraction(input: {
  userId: string;
  outfitId: string;
  type: "like" | "save";
}) {
  const db = await readDb();
  const user = db.users.find((item) => item.id === input.userId);
  if (!user) throw new Error("Login required.");

  const key = input.type === "like" ? "likedIds" : "savedIds";
  const current = new Set(user[key]);
  const nextValue = !current.has(input.outfitId);
  if (nextValue) current.add(input.outfitId);
  else current.delete(input.outfitId);
  user[key] = Array.from(current);

  await writeDb(db);
  return interactionForOutfit(input.outfitId, user);
}

export async function interactionForOutfit(
  outfitId: string,
  viewer?: StoredUser | null
): Promise<InteractionResponse> {
  const db = await readDb();
  const likeCount = db.users.filter((user) => user.likedIds.includes(outfitId)).length;
  const saveCount = db.users.filter((user) => user.savedIds.includes(outfitId)).length;

  return {
    outfitId,
    liked: viewer?.likedIds.includes(outfitId) ?? false,
    saved: viewer?.savedIds.includes(outfitId) ?? false,
    likeCount,
    saveCount
  };
}

export async function decorateOutfitForViewer(outfit: Outfit, viewer?: StoredUser | null) {
  const interaction = await interactionForOutfit(outfit.id, viewer);
  return {
    ...outfit,
    likeCount: interaction.likeCount,
    saveCount: interaction.saveCount,
    commentCount: 0,
    viewerLiked: interaction.liked,
    viewerSaved: interaction.saved
  };
}

export async function decorateOutfitsForViewer(
  outfits: Outfit[],
  viewer?: StoredUser | null
) {
  return Promise.all(outfits.map((outfit) => decorateOutfitForViewer(outfit, viewer)));
}
