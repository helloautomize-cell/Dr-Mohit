// Global shell composition: utility bar + sticky header + mobile menu +
// breadcrumbs + children + footer + mobile action bar + cookie banner.
// Server component — interactive pieces are client islands (HeaderMenu,
// Breadcrumbs, ActionBar, CookieBanner).
import HeaderMenu from '@/components/shell/HeaderMenu';
import SiteFooter from '@/components/shell/SiteFooter';
import ActionBar from '@/components/shell/ActionBar';
import CookieBanner from '@/components/shell/CookieBanner';
import Breadcrumbs from '@/components/shell/Breadcrumbs';

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeaderMenu />
      <main id="main">
        <Breadcrumbs />
        {children}
      </main>
      <SiteFooter />
      <ActionBar />
      <CookieBanner />
    </>
  );
}
