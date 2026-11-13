'use client';

// Home department panels (v15 upgrade): three expanding panels above the
// treatment grid. One open at a time — click/tap everywhere, hover opens only
// on hover-capable pointers wider than 1000px (ported from home-upgrade.js).
// Below 1000px they stack as an accordion via CSS (max-height transition).
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { slot, type SlotId } from '@/lib/image-slots';
import { TxIcon } from '@/components/shell/OrthoMenuIcons';

function BoneIcon() {
  return (
    <svg className="di" viewBox="0 0 48 48" aria-hidden="true">
      <circle className="b" cx="24" cy="24" r="22" />
      <rect x="14" y="11" width="20" height="27" rx="3" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 11v-2h10v2" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 20v12M28 20v12M20 26h8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg className="di" viewBox="0 0 48 48" aria-hidden="true">
      <circle className="b" cx="24" cy="24" r="22" />
      <ellipse cx="24" cy="24" rx="9" ry="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 24h18M10 17l4 3M38 17l-4 3" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MindIcon() {
  return (
    <svg className="di" viewBox="0 0 48 48" aria-hidden="true">
      <circle className="b" cx="24" cy="24" r="22" />
      <path
        d="M20 12a5 5 0 0 0-8 4 5 5 0 0 0-1 9 5 5 0 0 0 5 8 5 5 0 0 0 8 1V13a4 4 0 0 0-4-1zM28 12a5 5 0 0 1 8 4 5 5 0 0 1 1 9 5 5 0 0 1-5 8 5 5 0 0 1-8 1"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ORTHO_LINKS: { href: string; ic: string }[] = [
  { href: '/orthopaedics/robotic-knee-replacement/', ic: 'Robotic knee replacement' },
  { href: '/orthopaedics/knee-and-hip-replacement/', ic: 'Knee and hip replacement' },
  { href: '/orthopaedics/fractures-and-trauma/', ic: 'Fractures and trauma' },
  { href: '/orthopaedics/back-pain-clinic/', ic: 'Back pain clinic' },
];
const EYE_ICS = ['cataract', 'diabetic', 'glaucoma', 'children'];
const MIND_ICS = ['depression', 'deaddiction', 'sleep', 'family'];

type Panel = {
  cls: string;
  icon: () => React.ReactNode;
  title: string;
  doc: string;
  img: SlotId;
  focal: string;
  links: { t: string; href: string; ic: string }[];
  dept: string;
};

export function DeptPanels() {
  const t = useTranslations('home.dept');
  const [open, setOpen] = useState(0);
  const [hoverable, setHoverable] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover:hover) and (min-width:1001px)');
    const sync = () => setHoverable(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const panels: Panel[] = [
    {
      cls: 'p-or',
      icon: BoneIcon,
      title: t('orT'),
      doc: t('orD'),
      img: 'ortho.kh.hero',
      focal: '62% 35%',
      links: (t.raw('orL') as string[]).map((label, i) => ({
        t: label,
        href: ORTHO_LINKS[i]?.href ?? '/orthopaedics/',
        ic: ORTHO_LINKS[i]?.ic ?? 'x',
      })),
      dept: '/orthopaedics/',
    },
    {
      cls: 'p-ey',
      icon: EyeIcon,
      title: t('eyT'),
      doc: t('eyD'),
      img: 'eye.hero',
      focal: '48% 30%',
      links: (t.raw('eyL') as string[]).map((label, i) => ({
        t: label,
        href: '/eye-care/',
        ic: EYE_ICS[i] ?? 'x',
      })),
      dept: '/eye-care/',
    },
    {
      cls: 'p-mi',
      icon: MindIcon,
      title: t('miT'),
      doc: t('miD'),
      img: 'mind.hero',
      focal: '48% 30%',
      links: (t.raw('miL') as string[]).map((label, i) => ({
        t: label,
        href: '/mental-health/',
        ic: MIND_ICS[i] ?? 'x',
      })),
      dept: '/mental-health/',
    },
  ];

  return (
    <div className="dpanels rv">
      {panels.map((p, i) => {
        const IconC = p.icon;
        const on = open === i;
        return (
          <div
            className={`dp ${p.cls}${on ? ' on' : ''}`}
            key={p.cls}
            onMouseEnter={hoverable ? () => setOpen(i) : undefined}
          >
            <button
              type="button"
              className="dp-h"
              aria-expanded={on}
              onClick={() => setOpen(i)}
            >
              <span className="sic">
                <IconC />
              </span>
              <b>{p.title}</b>
              <small>{p.doc}</small>
              <i className="pl" aria-hidden="true" />
            </button>
            <div className="dp-b">
              <div className="dp-im">
                <Image
                  src={slot(p.img).src!}
                  alt=""
                  fill
                  sizes="(max-width:1000px) 100vw, 30vw"
                  style={{ objectFit: 'cover', objectPosition: p.focal }}
                />
              </div>
              <ul>
                {p.links.map((l) => (
                  <li key={l.t}>
                    <Link href={l.href}>
                      <span className="txi" aria-hidden="true">
                        <TxIcon ic={l.ic} />
                      </span>
                      <span>{l.t}</span>
                      <span className="ar">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link className="lnk" href={p.dept}>
                <span>{t('see')}</span>
                <span className="ar">→</span>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
