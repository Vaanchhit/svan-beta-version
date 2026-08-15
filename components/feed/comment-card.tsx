import { Avatar } from "@/components/ui/avatar";

interface CommentCardProps {
  avatar: string;
  username: string;
  text: string;
}

export function CommentCard({ avatar, username, text }: CommentCardProps) {
  return (
    <article className="flex gap-3 rounded-3xl bg-white/5 p-3">
      <Avatar src={avatar} alt={username} size="sm" />
      <div>
        <p className="text-sm font-semibold text-white">{username}</p>
        <p className="mt-1 text-sm leading-5 text-white/60">{text}</p>
      </div>
    </article>
  );
}
