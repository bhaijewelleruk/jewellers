import type { Metadata } from 'next';
import { getHomeMetadata } from '@/lib/seo';
import dynamic from 'next/dynamic';
import {
  HeroSection,
  TrustFeaturesBar,
  CollectionsBanner,
} from '@/components/shared';
import LiveRateTicker from '@/components/rates/LiveRateTicker';
import HomeBullionShowcase from '@/components/home/HomeBullionShowcase';

// Lazy-load interactive and below-fold components
const TextLoop = dynamic(
  () => import('@/components/shared/TextLoop/TextLoop'),
  { ssr: true }
);
const CuratedCollections = dynamic(
  () => import('@/components/shared/CuratedCollections').then(m => ({ default: m.CuratedCollections })),
  { ssr: true }
);
const FeaturedProducts = dynamic(
  () => import('@/components/shared/FeaturedProducts').then(m => ({ default: m.FeaturedProducts })),
  { ssr: true }
);
const OurStory = dynamic(
  () => import('@/components/shared/OurStory').then(m => ({ default: m.OurStory })),
  { ssr: true }
);
const TestimonialsSection = dynamic(
  () => import('@/components/shared/TestimonialsSection').then(m => ({ default: m.TestimonialsSection }))
);
const CTABanner = dynamic(
  () => import('@/components/shared/CTABanner').then(m => ({ default: m.CTABanner })),
  { ssr: true }
);

export const metadata: Metadata = getHomeMetadata();

export default function HomePage() {
  return (
    <main className="w-full max-w-full overflow-x-hidden overflow-hidden">
      {/* ── Hero Section ── */}
      <HeroSection />

      {/* ── Interactive GSAP Ribbon TextLoop (Responsive Desktop & Mobile) ── */}
      <div className="w-full overflow-hidden bg-[#0c0806] py-0 my-0 relative z-20">
        {/* Desktop & Tablet View (Calm Slow Speed) */}
        <div className="hidden sm:block">
          <TextLoop
            text="BHAI JEWELLER ✦ BRITISH HALLMARKED GOLD ✦ 21CT & 18K FINE JEWELLERY ✦ CRAFTED WITH PASSION"
            separator="✦"
            shape="wave"
            speed={28}
            fontSize={17}
            fontWeight={600}
            letterSpacing={2.2}
            curviness={10}
            ribbon={true}
            ribbonColor="#18110c"
            color="#f3dfc8"
            ribbonWidth={46}
            viewHeight={54}
            viewWidth={1200}
            draggable={true}
            scrollBoost={50}
            pauseOnHover={true}
            className="w-full select-none"
          />
        </div>

        {/* Mobile View: Taller ribbon, 3 clear phrases, larger bold font, and calm slow speed */}
        <div className="block sm:hidden">
          <TextLoop
            text="BHAI JEWELLER ✦ BRITISH HALLMARKED GOLD ✦ 21CT FINE JEWELLERY"
            separator="✦"
            shape="wave"
            speed={24}
            fontSize={38}
            fontWeight={600}
            letterSpacing={3.5}
            curviness={20}
            ribbon={true}
            ribbonColor="#18110c"
            color="#f3dfc8"
            ribbonWidth={115}
            viewHeight={150}
            viewWidth={1200}
            draggable={true}
            scrollBoost={50}
            pauseOnHover={true}
            className="w-full select-none"
          />
        </div>
      </div>

      {/* ── Live Bullion Spot Market Ticker ── */}
      <LiveRateTicker />

      {/* ── Trust Features Bar & Collections ── */}
      <TrustFeaturesBar />
      <CollectionsBanner />
      <CuratedCollections />

      {/* ── LBMA Accredited Investment Gold Bars Carousel Showcase ── */}
      <HomeBullionShowcase />

      <FeaturedProducts />
      <OurStory />
      <div className="hidden md:block">
        <TestimonialsSection />
      </div>
      <CTABanner />
    </main>
  );
}
