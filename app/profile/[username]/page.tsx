import { PageTransition } from "@/components/layout/page-transition";
import { ProfileScreen } from "@/components/profile/profile-screen";

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;

  return (
    <PageTransition>
      <ProfileScreen username={username} />
    </PageTransition>
  );
}
