import type {
  AuthResponse,
  AuthUser,
  FeedResponse,
  InteractionResponse,
  OutfitResponse,
  ProductCatalogResponse,
  ProfileResponse,
  SearchResponse
} from "@/types";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? `SVAN API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const svanApi = {
  feed: () => request<FeedResponse>("/api/feed"),
  search: (query: string, genre = "") => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (genre) params.set("genre", genre);
    const search = params.toString();

    return request<SearchResponse>(`/api/search${search ? `?${search}` : ""}`);
  },
  outfit: (id: string) =>
    request<OutfitResponse>(`/api/outfit/${encodeURIComponent(id)}`),
  products: (outfitId: string, segment: string) =>
    request<ProductCatalogResponse>(
      `/api/products?outfitId=${encodeURIComponent(outfitId)}&segment=${encodeURIComponent(segment)}`
    ),
  profile: (username: string) =>
    request<ProfileResponse>(`/api/profile/${encodeURIComponent(username)}`),
  me: () => request<AuthResponse>("/api/auth/me"),
  signup: (input: { email: string; password: string; displayName: string }) =>
    request<{ user: AuthUser }>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(input)
    }),
  login: (input: { email: string; password: string }) =>
    request<{ user: AuthUser }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(input)
    }),
  logout: () =>
    request<AuthResponse>("/api/auth/logout", {
      method: "POST"
    }),
  interaction: (input: { outfitId: string; type: "like" | "save" }) =>
    request<InteractionResponse>("/api/interactions", {
      method: "POST",
      body: JSON.stringify(input)
    })
};
