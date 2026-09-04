import { PageTransition } from "@/components/layout/page-transition";
import { WardrobeScreen } from "@/components/wardrobe/wardrobe-screen";

export default function SavedPage() {
  return (
    <PageTransition>
      <WardrobeScreen />
    </PageTransition>
  );
}
