import { PageTransition } from "@/components/layout/page-transition";
import { CollectionScreen } from "@/components/profile/collection-screen";

export default function SavedPage() {
  return (
    <PageTransition>
      <CollectionScreen type="saved" />
    </PageTransition>
  );
}
