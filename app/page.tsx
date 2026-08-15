import { AppHeader } from "@/components/layout/app-header";
import { PageTransition } from "@/components/layout/page-transition";
import { HomeFeed } from "@/components/feed/home-feed";

export default function HomePage() {
  return (
    <PageTransition>
      <AppHeader />
      <HomeFeed />
    </PageTransition>
  );
}
