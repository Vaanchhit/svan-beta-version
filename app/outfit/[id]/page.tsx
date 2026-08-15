import { PageTransition } from "@/components/layout/page-transition";
import { OutfitDetail } from "@/components/shop/outfit-detail";

interface OutfitPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OutfitPage({ params }: OutfitPageProps) {
  const { id } = await params;

  return (
    <PageTransition className="pb-24">
      <OutfitDetail id={id} />
    </PageTransition>
  );
}
