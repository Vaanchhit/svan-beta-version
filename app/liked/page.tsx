import { PageTransition } from "@/components/layout/page-transition";
import { CollectionScreen } from "@/components/profile/collection-screen";

export default function LikedPage() {
  return (
    <PageTransition>
      <CollectionScreen type="liked" />
    </PageTransition>
  );
}
