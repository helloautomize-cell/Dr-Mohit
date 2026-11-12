'use client';

// Global shell composition: utility bar + sticky header + mobile menu +
// breadcrumbs + children + footer + mobile action bar + cookie banner.
import { useState } from 'react';
import SiteHeader from '@/components/shell/SiteHeader';
import MobileMenu from '@/components/shell/MobileMenu';
import SiteFooter from '@/components/shell/SiteFooter';
import ActionBar from '@/components/shell/ActionBar';
import CookieBanner from '@/components/shell/CookieBanner';
import Breadcrumbs from '@/components/shell/Breadcrumbs';

export default function Shell({ children }: { children: React.ReactNode }) {
  const [menu, setMenu] = useState(false);
  return (
    <>
      <SiteHeader onMenu={() => setMenu(true)} />
      <MobileMenu open={menu} onClose={() => setMenu(false)} />
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
