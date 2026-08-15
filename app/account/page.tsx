import { Suspense } from "react";
import { PageTransition } from "@/components/layout/page-transition";
import { AccountScreen } from "@/components/auth/account-screen";

export default function AccountPage() {
  return (
    <PageTransition>
      <Suspense
        fallback={
          <div className="px-4 py-24 text-center text-sm text-white/50">
            Loading account...
          </div>
        }
      >
        <AccountScreen />
      </Suspense>
    </PageTransition>
  );
}
