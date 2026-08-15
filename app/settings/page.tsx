import { PageTransition } from "@/components/layout/page-transition";
import { SettingsScreen } from "@/components/settings/settings-screen";

export default function SettingsPage() {
  return (
    <PageTransition>
      <SettingsScreen />
    </PageTransition>
  );
}
