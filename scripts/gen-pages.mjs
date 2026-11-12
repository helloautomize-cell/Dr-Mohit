// One-off generator for phase-03 route pages (thin wrappers over PageScaffold).
import fs from 'node:fs';
import path from 'node:path';

const P = 'app/[locale]';
const write = (dir, content) => {
  fs.mkdirSync(path.join(P, dir), { recursive: true });
  fs.writeFileSync(path.join(P, dir, 'page.tsx'), content);
};

const tpl = ({ page, slot, lede, reviewer }) => `import { setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { PageScaffold } from '@/components/PageScaffold';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const l = locale as Locale;
  return (
    <PageScaffold
      page="${page}"
      locale={l}
      ${slot ? `imageSlot="${slot}"` : ''}
      eyebrowKey="Gupta Hospital · Bathinda · Since 1980"
      ledeKey="${lede}"
      ${reviewer ? `reviewer="${reviewer}"` : ''}
    />
  );
}
`;

write('orthopaedics', tpl({ page: 'orthopaedics', slot: 'ortho.hero', lede: 'The department that began', reviewer: 'Dr. Mohit Gupta' }));
write('orthopaedics/robotic-knee-replacement', tpl({ page: 'robotic-knee', slot: 'robotic.hero', lede: 'Gupta Hospital uses the Johnson', reviewer: 'Dr. Mohit Gupta' }));
write('eye-care', tpl({ page: 'eye-care', slot: 'eye.hero', lede: 'Led by Dr. Parul Gupta', reviewer: 'Dr. Parul Gupta' }));
write('mental-health', tpl({ page: 'mental-health', slot: 'mind.hero', lede: 'Since 2000, Dr. Amit Gupta', reviewer: 'Dr. Amit Gupta' }));
write('doctors', tpl({ page: 'doctors', slot: 'home.doctors-banner', lede: 'The clinic Dr. Amrit Gupta opened' }));
write('about', tpl({ page: 'about', slot: 'about.founder', lede: 'Power House Road' }));
write('media', tpl({ page: 'media', lede: 'Coverage from local newspapers' }));
write('contact', tpl({ page: 'contact', lede: 'Fill in the form and send' }));
console.log('done');
