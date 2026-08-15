import { PageTransition } from "@/components/layout/page-transition";
import { UploadFlow } from "@/components/upload/upload-flow";

export default function UploadPage() {
  return (
    <PageTransition>
      <UploadFlow />
    </PageTransition>
  );
}
