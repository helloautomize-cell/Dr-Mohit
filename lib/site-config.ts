// Verified hospital facts (resources/docs/facts-and-compliance.md). Nothing here
// may be edited to marketing language; unconfirmed items stay in TODO_CONFIRM.
export const SITE = {
  name: 'Gupta Hospital',
  city: 'Bathinda',
  tagline: 'Bone, eye and mental health care for Bathinda.',
  founded: 1980,
  address: 'Power House Road, Bathinda, Punjab 151001',
  phoneMain: '+91 98787 52241',
  phoneMainHref: 'tel:+919878752241',
  phoneEye: '+91 99886 32241',
  phoneEyeHref: 'tel:+919988632241',
  phoneAlt1: '+91 99887 52241',
  phoneAlt1Href: 'tel:+919988752241',
  phoneAlt2: '+91 84271 22241',
  phoneAlt2Href: 'tel:+918427122241',
  whatsapp: 'https://wa.me/919878752241',
  email: 'guptahospitalbathinda@gmail.com',
  hfrId: 'IN0310002794',
  pmjaySince: 2019,
  award: 'Tribune Health Care Award 2025',
  awardDate: '2025-08-24',
  emergency: { police: '112', telemanas: '14416' },
  social: {
    youtube: 'https://www.youtube.com/channel/UCscbyJ6Em7uBoFuRS8dBn_w',
    instagram: 'https://www.instagram.com/guptahospitalbathinda/',
    facebook: 'https://www.facebook.com/GuptaHospitalBathinda',
  },
  legalLastUpdated: 'November 2025',
  // Hours — confirmed via Google Business Profile: open 24 hours, all days.
  hours: { en: 'Open 24 hours', pa: '24 ਘੰਟੇ ਖੁੱਲ੍ਹ' },
  // Service-area towns (facts: patients travel from surrounding districts).
  serviceTowns: ['Bathinda', 'Mansa', 'Muktsar', 'Faridkot', 'Barnala', 'Rampura Phul'],
  mapsUrl:
    'https://maps.google.com/?q=Gupta+Hospital+Power+House+Road+Bathinda+Punjab+151001',
  // Google Business Profile listing — [CONFIRM: GBP URL] (gbp-url confirm).
  googleBusiness: '[CONFIRM]',
  emergencyLine: 'Medical emergency? Call 108 or 112',
} as const;

// Until launch approval, every host must noindex (phase-02 item 9).
export const SITE_INDEXABLE = false;

// Every unresolved confirmation from facts-and-compliance. Anything rendered
// from this list must show a [CONFIRM] chip and must be resolved before launch.
export const TODO_CONFIRM = [
  'Purpose of phone numbers +91 99887 52241 and +91 84271 22241',
  'Dr. Parul Gupta degree list (MBBS, MS unconfirmed)',
  'Dr. Amit Gupta MD Psychiatry credential',
  'NABH accreditation status (badge must not display until confirmed)',

  'Dr. Mohit Gupta experience phrasing (year count vs "over a decade")',
  'Ortho Robotic Centre banner usage',
  'Google Business Profile listing URL',
] as const;
