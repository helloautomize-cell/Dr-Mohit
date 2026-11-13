'use client';

// Header + mobile menu pair sharing the menu-open state. Kept as a small
// client island so Shell (and the footer below it) can stay server components.
import { useState } from 'react';
import SiteHeader from '@/components/shell/SiteHeader';
import MobileMenu from '@/components/shell/MobileMenu';

export default function HeaderMenu() {
  const [menu, setMenu] = useState(false);
  return (
    <>
      <SiteHeader onMenu={() => setMenu(true)} />
      <MobileMenu open={menu} onClose={() => setMenu(false)} />
    </>
  );
}
