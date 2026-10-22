import { LandingHeader } from "@/components/landing/LandingHeader";
import { SiteFooter } from "@/components/landing/SiteFooter";

export default function Home() {
  return (
    <>
      <LandingHeader />
      <main className="flex-1">
        <h1>FESTIO</h1>
      </main>
      <SiteFooter />
    </>
  );
}
