import { LandingHeader } from "@/components/landing/LandingHeader";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { loadDashboard } from "@/db/reads/dashboard";

export default async function Home() {
  const { bar } = await loadDashboard();

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
