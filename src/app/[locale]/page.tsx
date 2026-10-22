import { LandingHeader } from "@/components/landing/LandingHeader";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { loadHostSummary } from "@/db/reads/dashboard";
import { loadHostId } from "@/db/reads/session";

export default async function Home() {
  /* Signed out, the bar offers sign-in instead of the host's counts. */
  const bar = (await loadHostId()) ? (await loadHostSummary()).bar : null;

  return (
    <>
      <LandingHeader bar={bar} />
      <main className="flex-1">
        <h1>FESTIO</h1>
      </main>
      <SiteFooter />
    </>
  );
}
