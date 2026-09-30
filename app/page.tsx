import HeroSection from "@/components/HeroSection";
import SmoothScroll from "@/components/SmoothScroll";
import ClosingSection from "@/components/ClosingSection";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <main>
        <HeroSection />
        <ClosingSection />
      </main>
    </>
  );
}
