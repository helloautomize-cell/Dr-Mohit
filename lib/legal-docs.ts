// Legal document content model (phase-06). resources/content/legal/*.md was
// referenced by the plan but does not exist, so the documents live here in a
// typed structure. English wording and Punjabi translation have both been
// reviewed and approved by the hospital's legal contact.

export interface LegalText {
  en: string;
  pa: string;
}

export interface LegalSection {
  h: LegalText;
  paras?: LegalText[];
  list?: LegalText[];
}

export interface LegalDocData {
  slug: string;
  title: LegalText;
  intro?: LegalText;
  sections: LegalSection[];
}

const L = (en: string, pa: string): LegalText => ({ en, pa });

export const LEGAL_DOCS: Record<string, LegalDocData> = {
  'privacy-policy': {
    slug: 'privacy-policy',
    title: L('Privacy policy', 'ਗੋਪਨੀਯਤਾ ਨੀਤੀ'),
    intro: L(
      'This notice explains how Gupta Hospital, Bathinda collects and uses personal information on this website, under the Digital Personal Data Protection Act, 2023 and the DPDP Rules, 2025.',
      'ਇਹ ਨੋਟਿਸ ਦੱਸਦਾ ਹੈ ਕਿ ਗੁਪਤਾ ਹਸਪਤਾਲ, ਬਠਿੰਡਾ ਇਸ ਵੈੱਬਸਾਈਟ ਤੇ ਡਿਜਿਟਲ ਨਿੱਜੀ ਡਾਟਾ ਸੁਰੱਖਿਆ ਕਾਨੂੰਨ, 2023 ਅਤੇ DPDP ਨਿਯਮਾਂ, 2025 ਅਧੀਨ ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਕਿਵੇਂ ਇਕੱਠੀ ਤੇ ਵਰਤਦਾ ਹੈ।',
    ),
    sections: [
      {
        h: L('1. Who we are', '1. ਅਸੀਂ ਕੌਣ ਹਾਂ'),
        paras: [
          L(
            'Gupta Hospital, Power House Road, Bathinda, Punjab 151001 is the data fiduciary for the personal information handled through this website.',
            'ਗੁਪਤਾ ਹਸਪਤਾਲ, ਪਾਵਰ ਹਾਊਸ ਰੋਡ, ਬਠਿੰਡਾ, ਪੰਜਾਬ 151001 ਇਸ ਵੈੱਬਸਾਈਟ ਰਾਹੀਂ ਆਉਣ ਵਾਲੀ ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਲਈ ਡਾਟਾ ਫਿਡਿਊਸ਼ਰੀ ਹੈ।',
          ),
        ],
      },
      {
        h: L('2. What we collect', '2. ਅਸੀਂ ਕੀ ਜਾਣਕਾਰੀ ਲੈਂਦੇ ਹਾਂ'),
        list: [
          L(
            'Details you type into the appointment form: patient name, mobile number, preferred day and language, and anything you write in the message field.',
            'ਅਪੌਇੰਟਮੈਂਟ ਫ਼ਾਰਮ ਵਿੱਚ ਤੁਸੀਂ ਲਿਖਦੇ ਹੋ: ਮਰੀਜ਼ ਦਾ ਨਾਮ, ਮੋਬਾਈਲ ਨੰਬਰ, ਪਸੰਦੀਦਾ ਦਿਨ ਤੇ ਭਾਸ਼ਾ, ਅਤੇ ਸੁਨੇਹੇ ਵਿੱਚ ਜੋ ਵੀ ਲਿਖੋ।',
          ),
          L(
            'Anything you send us directly by phone call, WhatsApp or email, including reports you choose to share.',
            'ਫ਼ੋਨ, ਵਟਸਐਪ ਜਾਂ ਈਮੇਲ ਰਾਹੀਂ ਤੁਸੀਂ ਜੋ ਵੀ ਭੇਜਦੇ ਹੋ, ਜਿਸ ਵਿੱਚ ਰਿਪੋਰਟਾਂ ਵੀ ਹੋ ਸਕਦੀਆਂ ਹਨ।',
          ),
          L(
            'This site does not use analytics, advertising trackers or account logins.',
            'ਇਸ ਸਾਈਟ ਤੇ ਐਨਾਲਿਟਿਕਸ, ਵਿਗਿਆਪਨ ਟਰੈਕਰ ਜਾਂ ਅਕਾਊਂਟ ਲੌਗਿਨ ਨਹੀਂ ਹੈ।',
          ),
        ],
      },
      {
        h: L('3. Why we use it', '3. ਜਾਣਕਾਰੀ ਦੀ ਵਰਤੋਂ ਕਿਸ ਲਈ'),
        list: [
          L(
            'To call or message you back and confirm an appointment time.',
            'ਤੁਹਾਨੂੰ ਵਾਪਸ ਕਾਲ ਜਾਂ ਸੁਨੇਹਾ ਕਰਕੇ ਅਪੌਇੰਟਮੈਂਟ ਦਾ ਸਮਾਂ ਪੱਕਾ ਕਰਨ ਲਈ।',
          ),
          L(
            'To guide you to the right department and prepare for your visit.',
            'ਸਹੀ ਵਿਭਾਗ ਵੱਲ ਰਾਹ ਦਿਖਾਉਣ ਅਤੇ ਤੁਹਾਡੀ ਮੁਲਾਕਾਤ ਦੀ ਤਿਆਰੀ ਲਈ।',
          ),
          L(
            'To keep basic records required by hospital administration and law.',
            'ਹਸਪਤਾਲ ਪ੍ਰਸ਼ਾਸਨ ਅਤੇ ਕਾਨੂੰਨ ਮੁਤਾਬਕ ਲੋੜੀਂਦੇ ਰਿਕਾਰਡ ਰੱਖਣ ਲਈ।',
          ),
        ],
      },
      {
        h: L('4. Third parties on this site', '4. ਇਸ ਸਾਈਟ ਤੇ ਬਾਹਰਲੀਆਂ ਸੇਵਾਵਾਂ'),
        paras: [
          L(
            'The appointment form opens WhatsApp to send your message; WhatsApp (Meta) processes that message under its own policy. The map loads from Google only when you press Show map. Links to YouTube, Instagram and Facebook open those sites directly.',
            'ਅਪੌਇੰਟਮੈਂਟ ਫ਼ਾਰਮ ਤੁਹਾਡਾ ਸੁਨੇਹਾ ਭੇਜਣ ਲਈ ਵਟਸਐਪ ਖੋਲ੍ਹਦਾ ਹੈ; ਉਸ ਸੁਨੇਹੇ ਦੀ ਪ੍ਰੋਸੈਸਿੰਗ ਵਟਸਐਪ (Meta) ਦੀ ਆਪਣੀ ਨੀਤੀ ਅਧੀਨ ਹੁੰਦੀ ਹੈ। ਨਕਸ਼ਾ ਸਿਰਫ਼ Show map ਦਬਾਉਣ ਤੇ ਗੂਗਲ ਤੋਂ ਲੋਡ ਹੁੰਦਾ ਹੈ। YouTube, Instagram ਅਤੇ Facebook ਦੇ ਲਿੰਕ ਉਨ੍ਹਾਂ ਸਾਈਟਾਂ ਤੇ ਲੈ ਜਾਂਦੇ ਹਨ।',
          ),
        ],
      },
      {
        h: L('5. How long we keep it', '5. ਜਾਣਕਾਰੀ ਕਿੰਨੀ ਦੇਰ ਰੱਖਦੇ ਹਾਂ'),
        paras: [
          L(
            'Contact details are kept only as long as needed for your visit and hospital records, then removed when there is no further need.',
            'ਸੰਪਰਕ ਜਾਣਕਾਰੀ ਸਿਰਫ਼ ਤੁਹਾਡੀ ਮੁਲਾਕਾਤ ਅਤੇ ਹਸਪਤਾਲ ਰਿਕਾਰਡ ਲਈ ਲੋੜੀਂਦੇ ਸਮੇਂ ਤੱਕ ਰੱਖੀ ਜਾਂਦੀ ਹੈ, ਫਿਰ ਹਟਾ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ।',
          ),
        ],
      },
      {
        h: L('6. Your rights', '6. ਤੁਹਾਡੇ ਹੱਕ'),
        paras: [
          L(
            'Under the DPDP Act, 2023 you may ask to see, correct or erase your personal information, nominate someone to act for you, and raise a grievance.',
            'DPDP ਕਾਨੂੰਨ, 2023 ਅਧੀਨ ਤੁਸੀਂ ਆਪਣੀ ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਵੇਖਣ, ਠੀਕ ਕਰਵਾਣ ਜਾਂ ਮਿਟਵਾਉਣ ਦੀ ਬੇਨਤੀ ਕਰ ਸਕਦੇ ਹੋ, ਕਿਸੇ ਨੂੰ ਆਪਣੇ ਵੱਲੋਂ ਨਾਮਜ਼ਦ ਕਰ ਸਕਦੇ ਹੋ, ਅਤੇ ਸ਼ਿਕਾਇਤ ਕਰ ਸਕਦੇ ਹੋ।',
          ),
        ],
      },
      {
        h: L('7. Grievance officer', '7. ਸ਼ਿਕਾਇਤ ਅਧਿਕਾਰੀ'),
        paras: [
          L(
            '[CONFIRM: privacy-contact] For privacy questions and grievances, write to guptahospitalbathinda@gmail.com or call +91 98787 52241.',
            '[CONFIRM: privacy-contact] ਗੋਪਨੀਯਤਾ ਸੰਬੰਧੀ ਸਵਾਲਾਂ ਅਤੇ ਸ਼ਿਕਾਇਤਾਂ ਲਈ guptahospitalbathinda@gmail.com ਤੇ ਲਿਖੋ ਜਾਂ +91 98787 52241 ਤੇ ਕਾਲ ਕਰੋ।',
          ),
        ],
      },
      {
        h: L('8. Children', '8. ਬੱਚੇ'),
        paras: [
          L(
            'We do not knowingly collect personal information from children through this website. A parent or guardian should contact the hospital on a child’s behalf.',
            'ਅਸੀਂ ਇਸ ਵੈੱਬਸਾਈਟ ਰਾਹੀਂ ਬੱਚਿਆਂ ਦੀ ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਜਾਣ ਬੁੱਝ ਕੇ ਨਹੀਂ ਲੈਂਦੇ। ਮਾਪੇ ਜਾਂ ਸਰਪ੍ਰਸਤ ਹੀ ਬੱਚੇ ਵੱਲੋਂ ਹਸਪਤਾਲ ਨਾਲ ਸੰਪਰਕ ਕਰਨ।',
          ),
        ],
      },
      {
        h: L('9. Changes to this notice', '9. ਇਸ ਨੋਟਿਸ ਵਿੱਚ ਬਦਲਾਅ'),
        paras: [
          L(
            'If this notice changes, the updated version is posted on this page with a new last updated date.',
            'ਜੇ ਇਹ ਨੋਟਿਸ ਬਦਲਦਾ ਹੈ, ਨਵਾਂ ਵਰਜ਼ਨ ਇਸੇ ਪੰਨੇ ਤੇ ਨਵੀਂ ਮਿਤੀ ਨਾਲ ਪਾਇਆ ਜਾਵੇਗਾ।',
          ),
        ],
      },
      {
        h: L('10. Contact', '10. ਸੰਪਰਕ'),
        paras: [
          L(
            'Gupta Hospital, Power House Road, Bathinda, Punjab 151001 · +91 98787 52241 · guptahospitalbathinda@gmail.com',
            'ਗੁਪਤਾ ਹਸਪਤਾਲ, ਪਾਵਰ ਹਾਊਸ ਰੋਡ, ਬਠਿੰਡਾ, ਪੰਜਾਬ 151001 · +91 98787 52241 · guptahospitalbathinda@gmail.com',
          ),
        ],
      },
    ],
  },

  'terms-of-use': {
    slug: 'terms-of-use',
    title: L('Terms of use', 'ਵਰਤੋਂ ਦੀਆਂ ਸ਼ਰਤਾਂ'),
    sections: [
      {
        h: L('1. About this site', '1. ਇਸ ਸਾਈਟ ਬਾਰੇ'),
        paras: [
          L(
            'This website is run by Gupta Hospital, Bathinda. It gives general information about the hospital, its departments and its doctors, and a way to request an appointment.',
            'ਇਹ ਵੈੱਬਸਾਈਟ ਗੁਪਤਾ ਹਸਪਤਾਲ, ਬਠਿੰਡਾ ਵੱਲੋਂ ਚਲਾਈ ਜਾਂਦੀ ਹੈ। ਇਸ ਤੇ ਹਸਪਤਾਲ, ਵਿਭਾਗਾਂ ਅਤੇ ਡਾਕਟਰਾਂ ਬਾਰੇ ਆਮ ਜਾਣਕਾਰੀ ਅਤੇ ਅਪੌਇੰਟਮੈਂਟ ਲਈ ਬੇਨਤੀ ਦਾ ਤਰੀਕਾ ਹੈ।',
          ),
        ],
      },
      {
        h: L('2. General information only', '2. ਸਿਰਫ਼ ਆਮ ਜਾਣਕਾਰੀ'),
        paras: [
          L(
            'The content on this site is general information. It does not create a doctor and patient relationship and it is not medical advice. Please see the medical disclaimer.',
            'ਇਸ ਸਾਈਟ ਦੀ ਸਮੱਗਰੀ ਆਮ ਜਾਣਕਾਰੀ ਹੈ। ਇਸ ਨਾਲ ਡਾਕਟਰ-ਮਰੀਜ਼ ਰਿਸ਼ਤਾ ਨਹੀਂ ਬਣਦਾ ਅਤੇ ਇਹ ਡਾਕਟਰੀ ਸਲਾਹ ਨਹੀਂ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਡਾਕਟਰੀ ਡਿਸਕਲੇਮਰ ਵੇਖੋ।',
          ),
        ],
      },
      {
        h: L('3. Appointments', '3. ਅਪੌਇੰਟਮੈਂਟ'),
        paras: [
          L(
            'Appointments are requested through the form, by phone or on WhatsApp. A time is confirmed only when the hospital team calls or messages you back.',
            'ਅਪੌਇੰਟਮੈਂਟ ਫ਼ਾਰਮ, ਫ਼ੋਨ ਜਾਂ ਵਟਸਐਪ ਰਾਹੀਂ ਮੰਗੀ ਜਾਂਦੀ ਹੈ। ਸਮਾਂ ਉਦੋਂ ਹੀ ਪੱਕਾ ਹੁੰਦਾ ਹੈ ਜਦੋਂ ਹਸਪਤਾਲ ਟੀਮ ਵਾਪਸ ਕਾਲ ਜਾਂ ਸੁਨੇਹਾ ਕਰੇ।',
          ),
        ],
      },
      {
        h: L('4. Acceptable use', '4. ਸਹੀ ਵਰਤੋਂ'),
        paras: [
          L(
            'Do not misuse this site: no scraping or bulk copying, no attempts to break the site, and no sending false or abusive information through the form.',
            'ਇਸ ਸਾਈਟ ਦੀ ਗਲਤ ਵਰਤੋਂ ਨਾ ਕਰੋ: ਸਕਰੈਪਿੰਗ ਜਾਂ ਢੇਰ ਸਾਰੀ ਨਕਲ ਨਹੀਂ, ਸਾਈਟ ਤੋੜਨ ਦੀ ਕੋਸ਼ਿਸ਼ ਨਹੀਂ, ਅਤੇ ਫ਼ਾਰਮ ਰਾਹੀਂ ਝੂਠੀ ਜਾਂ ਅਪਮਾਨਜਨਕ ਜਾਣਕਾਰੀ ਨਹੀਂ।',
          ),
        ],
      },
      {
        h: L('5. Our content', '5. ਸਾਡੀ ਸਮੱਗਰੀ'),
        paras: [
          L(
            'The logo, text and photographs on this site belong to Gupta Hospital or are used with permission. Newspaper clippings are shown for reference and remain the property of their publishers.',
            'ਇਸ ਸਾਈਟ ਦਾ ਲੋਗੋ, ਲਿਖਤ ਅਤੇ ਫ਼ੋਟੋਆਂ ਗੁਪਤਾ ਹਸਪਤਾਲ ਦੀਆਂ ਹਨ ਜਾਂ ਇਜਾਜ਼ਤ ਨਾਲ ਵਰਤੀਆਂ ਗਈਆਂ ਹਨ। ਅਖ਼ਬਾਰੀ ਕਤਰਨਾਂ ਸਿਰਫ਼ ਹਵਾਲੇ ਲਈ ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਦੇ ਪ੍ਰਕਾਸ਼ਕਾਂ ਦੀ ਜਾਇਦਾਦ ਹਨ।',
          ),
        ],
      },
      {
        h: L('6. External links', '6. ਬਾਹਰਲੇ ਲਿੰਕ'),
        paras: [
          L(
            'Links to WhatsApp, Google Maps, YouTube, Instagram and Facebook go to services run by other companies under their own terms and privacy policies.',
            'ਵਟਸਐਪ, ਗੂਗਲ ਮੈਪਸ, YouTube, Instagram ਅਤੇ Facebook ਦੇ ਲਿੰਕ ਹੋਰ ਕੰਪਨੀਆਂ ਦੀਆਂ ਸੇਵਾਵਾਂ ਤੇ ਲੈ ਜਾਂਦੇ ਹਨ, ਜਿਨ੍ਹਾਂ ਦੀਆਂ ਆਪਣੀਆਂ ਸ਼ਰਤਾਂ ਤੇ ਗੋਪਨੀਯਤਾ ਨੀਤੀਆਂ ਹਨ।',
          ),
        ],
      },
      {
        h: L('7. Accuracy', '7. ਸ਼ੁੱਧਤਾ'),
        paras: [
          L(
            'We work to keep this site accurate and current, but we do not promise that every page is complete or up to date at all times.',
            'ਅਸੀਂ ਇਸ ਸਾਈਟ ਨੂੰ ਸਹੀ ਅਤੇ ਤਾਜ਼ਾ ਰੱਖਣ ਦੀ ਕੋਸ਼ਿਸ਼ ਕਰਦੇ ਹਾਂ, ਪਰ ਹਰ ਪੰਨਾ ਹਰ ਵੇਲੇ ਪੂਰਾ ਜਾਂ ਨਵੇਂਕਾਰ ਹੋਵੇ, ਇਸ ਦੀ ਗਾਰੰਟੀ ਨਹੀਂ।',
          ),
        ],
      },
      {
        h: L('8. Liability', '8. ਜ਼ਿੰਮੇਵਾਰੀ'),
        paras: [
          L(
            'The hospital is not liable for decisions taken based only on this website, or for problems caused by services outside our control.',
            'ਸਿਰਫ਼ ਇਸ ਵੈੱਬਸਾਈਟ ਦੇ ਆਧਾਰ ਤੇ ਲਏ ਫ਼ੈਸਲਿਆਂ ਜਾਂ ਸਾਡੇ ਕੰਟਰੋਲ ਤੋਂ ਬਾਹਰ ਦੀਆਂ ਸੇਵਾਵਾਂ ਕਰਕੇ ਹੋਈਆਂ ਸਮੱਸਿਆਵਾਂ ਲਈ ਹਸਪਤਾਲ ਜ਼ਿੰਮੇਵਾਰ ਨਹੀਂ ਹੈ।',
          ),
        ],
      },
      {
        h: L('9. Governing law', '9. ਲਾਗੂ ਕਾਨੂੰਨ'),
        paras: [
          L(
            'These terms are governed by the laws of India, and the courts at Bathinda, Punjab have jurisdiction.',
            'ਇਹ ਸ਼ਰਤਾਂ ਭਾਰਤ ਦੇ ਕਾਨੂੰਨਾਂ ਅਧੀਨ ਹਨ, ਅਤੇ ਬਠਿੰਡਾ, ਪੰਜਾਬ ਦੀਆਂ ਅਦਾਲਤਾਂ ਦਾ ਅਧਿਕਾਰ ਖੇਤਰ ਲਾਗੂ ਹੁੰਦਾ ਹੈ।',
          ),
        ],
      },
      {
        h: L('10. Contact', '10. ਸੰਪਰਕ'),
        paras: [
          L(
            'Gupta Hospital, Power House Road, Bathinda, Punjab 151001 · +91 98787 52241 · guptahospitalbathinda@gmail.com',
            'ਗੁਪਤਾ ਹਸਪਤਾਲ, ਪਾਵਰ ਹਾਊਸ ਰੋਡ, ਬਠਿੰਡਾ, ਪੰਜਾਬ 151001 · +91 98787 52241 · guptahospitalbathinda@gmail.com',
          ),
        ],
      },
    ],
  },

  'medical-disclaimer': {
    slug: 'medical-disclaimer',
    title: L('Medical disclaimer', 'ਡਾਕਟਰੀ ਡਿਸਕਲੇਮਰ'),
    sections: [
      {
        h: L('1. General information only', '1. ਸਿਰਫ਼ ਆਮ ਜਾਣਕਾਰੀ'),
        paras: [
          L(
            'Everything on this website is general health information. It is not medical advice, a diagnosis, or a treatment plan for any person.',
            'ਇਸ ਵੈੱਬਸਾਈਟ ਦੀ ਸਾਰੀ ਸਮੱਗਰੀ ਆਮ ਸਿਹਤ ਜਾਣਕਾਰੀ ਹੈ। ਇਹ ਕਿਸੇ ਵੀ ਵਿਅਕਤੀ ਲਈ ਡਾਕਟਰੀ ਸਲਾਹ, ਟਿਸ਼ੂ ਨਿਦਾਨ ਜਾਂ ਇਲਾਜ ਦੀ ਯੋਜਨਾ ਨਹੀਂ ਹੈ।',
          ),
        ],
      },
      {
        h: L('2. Not a substitute for a consultation', '2. ਡਾਕਟਰੀ ਮੁਲਾਕਾਤ ਦਾ ਬਦਲ ਨਹੀਂ'),
        paras: [
          L(
            'Reading this site cannot replace an examination and a conversation with a qualified doctor. Your own doctor knows your history, your reports and your medicines.',
            'ਇਸ ਸਾਈਟ ਨੂੰ ਪੜ੍ਹਨਾ ਯੋਗ ਡਾਕਟਰ ਨਾਲ ਜਾਂਚ ਅਤੇ ਗੱਲਬਾਤ ਦੀ ਥਾਂ ਨਹੀਂ ਲੈ ਸਕਦਾ। ਤੁਹਾਡਾ ਡਾਕਟਰ ਹੀ ਤੁਹਾਡਾ ਇਤਿਹਾਸ, ਰਿਪੋਰਟਾਂ ਅਤੇ ਦਵਾਈਆਂ ਜਾਣਦਾ ਹੈ।',
          ),
        ],
      },
      {
        h: L('3. Emergencies', '3. ਐਮਰਜੰਸੀ'),
        paras: [
          L(
            'In a medical emergency call 108 or 112, or go to the nearest emergency service. For mental health support call Tele-MANAS on 14416. Do not wait for a reply from this website.',
            'ਡਾਕਟਰੀ ਐਮਰਜੰਸੀ ਵਿੱਚ 108 ਜਾਂ 112 ਤੇ ਕਾਲ ਕਰੋ, ਜਾਂ ਨਜ਼ਦੀਕੀ ਐਮਰਜੰਸੀ ਸੇਵਾ ਤੇ ਜਾਓ। ਮਾਨਸਿਕ ਸਿਹਤ ਸਹਾਇਤਾ ਲਈ Tele-MANAS 14416 ਤੇ ਕਾਲ ਕਰੋ। ਇਸ ਵੈੱਬਸਾਈਟ ਤੋਂ ਜਵਾਬ ਦੀ ਉਡੀਕ ਨਾ ਕਰੋ।',
          ),
        ],
      },
      {
        h: L('4. Results vary', '4. ਨਤੀਜੇ ਵੱਖ-ਵੱਖ ਹੁੰਦੇ ਹਨ'),
        paras: [
          L(
            'Recovery after any treatment or surgery differs from person to person. No result can be promised in advance, and nothing on this site should be read as a guarantee of outcome.',
            'ਕਿਸੇ ਵੀ ਇਲਾਜ ਜਾਂ ਸਰਜਰੀ ਤੋਂ ਬਾਅਦ ਰਿਕਵਰੀ ਹਰ ਵਿਅਕਤੀ ਦੀ ਵੱਖਰੀ ਹੁੰਦੀ ਹੈ। ਪਹਿਲਾਂ ਕੋਈ ਨਤੀਜਾ ਵਾਅਦਾ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ, ਅਤੇ ਇਸ ਸਾਈਟ ਦੀ ਕੋਈ ਵੀ ਗੱਲ ਨਤੀਜੇ ਦੀ ਗਾਰੰਟੀ ਸਮਝੀ ਨਾ ਜਾਵੇ।',
          ),
        ],
      },
      {
        h: L('5. Systems and devices mentioned', '5. ਜ਼ਿਕਰ ਕੀਤੇ ਸਿਸਟਮ ਤੇ ਉਪਕਰਨ'),
        paras: [
          L(
            'Where a device or system is named, such as the VELYS robotic-assisted knee system, it is named because it is used at the hospital. It is factual information, not a promotion or endorsement.',
            'ਜਿੱਥੇ ਕਿਸੇ ਉਪਕਰਨ ਜਾਂ ਸਿਸਟਮ ਦਾ ਨਾਮ ਹੈ, ਜਿਵੇਂ VELYS ਰੋਬੋਟਿਕ-ਅਸਿਸਟਿਡ ਗੋਡਾ ਸਿਸਟਮ, ਉਹ ਇਸ ਲਈ ਹੈ ਕਿਉਂਕਿ ਉਹ ਹਸਪਤਾਲ ਵਿੱਚ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ। ਇਹ ਤੱਥਾਂ ਦੀ ਜਾਣਕਾਰੀ ਹੈ, ਪ੍ਰਚਾਰ ਜਾਂ ਸਿਫ਼ਾਰਸ਼ ਨਹੀਂ।',
          ),
        ],
      },
      {
        h: L('6. Medical review', '6. ਡਾਕਟਰੀ ਸਮੀਖਿਆ'),
        paras: [
          L(
            'Clinical pages on this site are reviewed by the hospital’s doctors before publication. See the editorial and medical review policy for how content is checked.',
            'ਇਸ ਸਾਈਟ ਦੇ ਡਾਕਟਰੀ ਪੰਨੇ ਪ੍ਰਕਾਸ਼ਨ ਤੋਂ ਪਹਿਲਾਂ ਹਸਪਤਾਲ ਦੇ ਡਾਕਟਰਾਂ ਵੱਲੋਂ ਸਮੀਖਿਆ ਕੀਤੇ ਜਾਂਦੇ ਹਨ। ਸਮੱਗਰੀ ਦੀ ਜਾਂਚ ਕਿਵੇਂ ਹੁੰਦੀ ਹੈ, ਇਸ ਲਈ ਸੰਪਾਦਕੀ ਤੇ ਡਾਕਟਰੀ ਸਮੀਖਿਆ ਨੀਤੀ ਵੇਖੋ।',
          ),
        ],
      },
      {
        h: L('7. Contact', '7. ਸੰਪਰਕ'),
        paras: [
          L(
            'Gupta Hospital, Power House Road, Bathinda, Punjab 151001 · +91 98787 52241 · guptahospitalbathinda@gmail.com',
            'ਗੁਪਤਾ ਹਸਪਤਾਲ, ਪਾਵਰ ਹਾਊਸ ਰੋਡ, ਬਠਿੰਡਾ, ਪੰਜਾਬ 151001 · +91 98787 52241 · guptahospitalbathinda@gmail.com',
          ),
        ],
      },
    ],
  },

  'editorial-and-medical-review-policy': {
    slug: 'editorial-and-medical-review-policy',
    title: L('Editorial and medical review policy', 'ਸੰਪਾਦਕੀ ਤੇ ਡਾਕਟਰੀ ਸਮੀਖਿਆ ਨੀਤੀ'),
    sections: [
      {
        h: L('1. Who writes this site', '1. ਇਹ ਸਾਈਟ ਕੌਣ ਲਿਖਦਾ ਹੈ'),
        paras: [
          L(
            'Content is drafted by the hospital’s web team and checked against the hospital’s own records before it is published.',
            'ਸਮੱਗਰੀ ਹਸਪਤਾਲ ਦੀ ਵੈੱਬ ਟੀਮ ਲਿਖਦੀ ਹੈ ਅਤੇ ਪ੍ਰਕਾਸ਼ਨ ਤੋਂ ਪਹਿਲਾਂ ਹਸਪਤਾਲ ਦੇ ਆਪਣੇ ਰਿਕਾਰਡਾਂ ਨਾਲ ਮਿਲਾਈ ਜਾਂਦੀ ਹੈ।',
          ),
        ],
      },
      {
        h: L('2. Medical review', '2. ਡਾਕਟਰੀ ਸਮੀਖਿਆ'),
        paras: [
          L(
            'Pages that describe a treatment, a condition or a department are reviewed by the doctor who leads that department before publication.',
            'ਕਿਸੇ ਇਲਾਜ, ਬਿਮਾਰੀ ਜਾਂ ਵਿਭਾਗ ਬਾਰੇ ਪੰਨੇ ਪ੍ਰਕਾਸ਼ਨ ਤੋਂ ਪਹਿਲਾਂ ਉਸ ਵਿਭਾਗ ਦੇ ਮੁੱਖ ਡਾਕਟਰ ਵੱਲੋਂ ਸਮੀਖਿਆ ਹੁੰਦੇ ਹਨ।',
          ),
          L(
            'Each reviewed page names its medical reviewer and shows the date it was last reviewed.',
            'ਹਰ ਸਮੀਖਿਆ ਪੰਨਾ ਆਪਣਾ ਡਾਕਟਰੀ ਸਮੀਖਕ ਦਾ ਨਾਮ ਅਤੇ ਆਖ਼ਰੀ ਸਮੀਖਿਆ ਦੀ ਮਿਤੀ ਦਿਖਾਉਂਦਾ ਹੈ।',
          ),
        ],
      },
      {
        h: L('3. Sources', '3. ਸਰੋਤ'),
        paras: [
          L(
            'Facts about the hospital come from its records. Press coverage is shown as scans of the original newspaper clippings and credited to each paper.',
            'ਹਸਪਤਾਲ ਬਾਰੇ ਤੱਥ ਇਸ ਦੇ ਰਿਕਾਰਡਾਂ ਤੋਂ ਹਨ। ਪ੍ਰੈੱਸ ਕਵਰੇਜ਼ ਅਸਲ ਅਖ਼ਬਾਰੀ ਕਤਰਨਾਂ ਦੇ ਸਕੈਨ ਵਜੋਂ ਦਿਖਾਈ ਜਾਂਦੀ ਹੈ ਅਤੇ ਹਰ ਅਖ਼ਬਾਰ ਦਾ ਨਾਮ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ।',
          ),
        ],
      },
      {
        h: L('4. Illustrations and AI-assisted imagery', '4. ਚਿੱਤਰ ਤੇ AI-ਸਹਾਇਤਾ ਵਾਲੀਆਂ ਤਸਵੀਰਾਂ'),
        paras: [
          L(
            'Some illustrations and images on this site were created with AI-assisted tools. They are approved for use by the treating doctors, they do not show real patients, and they are used only where a real photograph does not yet exist.',
            'ਇਸ ਸਾਈਟ ਦੀਆਂ ਕੁਝ ਤਸਵੀਰਾਂ AI-ਸਹਾਇਤਾ ਵਾਲੇ ਸਾਧਨਾਂ ਨਾਲ ਬਣੀਆਂ ਹਨ। ਇਨ੍ਹਾਂ ਦੀ ਵਰਤੋਂ ਇਲਾਜ ਕਰਨ ਵਾਲੇ ਡਾਕਟਰਾਂ ਵੱਲੋਂ ਮਨਜ਼ੂਰ ਹੈ, ਇਹ ਅਸਲ ਮਰੀਜ਼ਾਂ ਨੂੰ ਨਹੀਂ ਦਿਖਾਉਂਦੀਆਂ, ਅਤੇ ਸਿਰਫ਼ ਉੱਥੇ ਵਰਤੀਆਂ ਜਾਂਦੀਆਂ ਹਨ ਜਿੱਥੇ ਅਸਲ ਫ਼ੋਟੋ ਹਾਲੇ ਮੌਜੂਦ ਨਹੀਂ।',
          ),
          L(
            'Some doctor photos on this site are AI-assisted, and each doctor has approved the photo used for them.',
            'ਇਸ ਸਾਈਟ ਤੇ ਡਾਕਟਰਾਂ ਦੀਆਂ ਕੁਝ ਫ਼ੋਟੋਆਂ AI-ਸਹਾਇਤਾ ਨਾਲ ਬਣੀਆਂ ਹਨ, ਅਤੇ ਹਰ ਡਾਕਟਰ ਨੇ ਆਪਣੀ ਵਰਤੀ ਗਈ ਫ਼ੋਟੋ ਦੀ ਮਨਜ਼ੂਰੀ ਦਿੱਤੀ ਹੈ।',
          ),
        ],
      },
      {
        h: L('5. What we do not publish', '5. ਅਸੀਂ ਕੀ ਪ੍ਰਕਾਸ਼ਿਤ ਨਹੀਂ ਕਰਦੇ'),
        list: [
          L('Patient stories, testimonials or before and after photographs.', 'ਮਰੀਜ਼ਾਂ ਦੀਆਂ ਕਹਾਣੀਆਂ, ਪ੍ਰਸ਼ੰਸਾ-ਪੱਤਰ ਜਾਂ ਪਹਿਲਾਂ-ਬਾਅਦ ਦੀਆਂ ਫ਼ੋਟੋਆਂ।'),
          L('Star ratings, review scores or paid placements.', 'ਤਾਰਿਆਂ ਵਾਲੀਆਂ ਰੇਟਿੰਗਾਂ, ਸਮੀਖਿਆ ਅੰਕ ਜਾਂ ਪੈਸੇ ਦੇ ਕੇ ਛਪੀਆਂ ਚੀਜ਼ਾਂ।'),
          L('Price offers, discounts or claims such as best, first or guaranteed.', 'ਕੀਮਤ ਦੀਆਂ ਛੋਟਾਂ, ਡਿਸਕਾਊਂਟ ਜਾਂ ਸਭ ਤੋਂ ਵਧੀਆ, ਪਹਿਲਾ ਜਾਂ ਗਾਰੰਟੀ ਵਰਗੇ ਦਾਅਵੇ।'),
        ],
      },
      {
        h: L('6. Corrections', '6. ਸੋਧ'),
        paras: [
          L(
            'If you spot an error, write to guptahospitalbathinda@gmail.com. Confirmed corrections are updated on the page.',
            'ਜੇ ਕੋਈ ਗ਼ਲਤੀ ਨਜ਼ਰ ਆਵੇ ਤਾਂ guptahospitalbathinda@gmail.com ਤੇ ਲਿਖੋ। ਪੱਕੀਆਂ ਸੋਧਾਂ ਪੰਨੇ ਤੇ ਅੱਪਡੇਟ ਕੀਤੀਆਂ ਜਾਂਦੀਆਂ ਹਨ।',
          ),
        ],
      },
    ],
  },

  'patient-rights-and-responsibilities': {
    slug: 'patient-rights-and-responsibilities',
    title: L('Patient rights and responsibilities', 'ਮਰੀਜ਼ਾਂ ਦੇ ਹੱਕ ਤੇ ਜ਼ਿੰਮੇਵਾਰੀਆਂ'),
    sections: [
      {
        h: L('1. Your rights', '1. ਤੁਹਾਡੇ ਹੱਕ'),
        list: [
          L('To be treated with respect, privacy and dignity.', 'ਇੱਜ਼ਤ, ਨਿੱਜਤਾ ਅਤੇ ਮਰਯਾਦਾ ਨਾਲ ਇਲਾਜ ਪਾਉਣਾ।'),
          L('To have your condition and options explained in a language you understand.', 'ਆਪਣੀ ਹਾਲਤ ਅਤੇ ਵਿਕਲਪ ਆਪਣੀ ਸਮਝ ਆਉਂਦੀ ਭਾਸ਼ਾ ਵਿੱਚ ਸਮਝਾਏ ਜਾਣੇ।'),
          L('To give or refuse informed consent before any procedure.', 'ਕਿਸੇ ਵੀ ਪ੍ਰਕਿਰਿਆ ਤੋਂ ਪਹਿਲਾਂ ਜਾਣਕਾਰੀ ਨਾਲ ਸਹਿਮਤੀ ਦੇਣਾ ਜਾਂ ਨਾ ਦੇਣਾ।'),
          L('To ask for a second opinion.', 'ਦੂਜੀ ਰਾਏ ਮੰਗਣਾ।'),
          L('To see your reports and get copies of your records.', 'ਆਪਣੀਆਂ ਰਿਪੋਰਟਾਂ ਵੇਖਣਾ ਅਤੇ ਰਿਕਾਰਡ ਦੀਆਂ ਨਕਲਾਂ ਲੈਣਾ।'),
          L('To receive a clear estimate before planned treatment.', 'ਨਿਯਮਤ ਇਲਾਜ ਤੋਂ ਪਹਿਲਾਂ ਸਾਫ਼ ਅੰਦਾਜ਼ਾ ਲੈਣਾ।'),
          L('To raise a complaint and have it heard.', 'ਸ਼ਿਕਾਇਤ ਕਰਨਾ ਅਤੇ ਸੁਣਵਾਈ ਪਾਉਣਾ।'),
        ],
      },
      {
        h: L('2. Your responsibilities', '2. ਤੁਹਾਡੀਆਂ ਜ਼ਿੰਮੇਵਾਰੀਆਂ'),
        list: [
          L('Give a complete and honest history, including the medicines you take.', 'ਪੂਰਾ ਅਤੇ ਸੱਚਾ ਇਤਿਹਾਸ ਦੇਣਾ, ਜਿਸ ਵਿੱਚ ਹੁਣ ਚੱਲ ਰਹੀਆਂ ਦਵਾਈਆਂ ਵੀ ਹਨ।'),
          L('Bring old reports, X-rays, scans, Aadhaar and any Ayushman or insurance card.', 'ਪੁਰਾਣੀਆਂ ਰਿਪੋਰਟਾਂ, ਐਕਸ-ਰੇ, ਸਕੈਨ, ਆਧਾਰ ਅਤੇ ਆਯੁਸ਼ਮਾਨ ਜਾਂ ਬੀਮਾ ਕਾਰਡ ਲਿਆਉਣਾ।'),
          L('Follow the treatment plan you agreed with your doctor, and say if you cannot.', 'ਡਾਕਟਰ ਨਾਲ ਤੈਅ ਕੀਤੀ ਇਲਾਜ ਦੀ ਯੋਜਨਾ ਮੰਨਣੀ, ਅਤੇ ਨਾ ਮੰਨ ਸਕੋ ਤਾਂ ਦੱਸਣਾ।'),
          L('Treat staff and other patients with respect.', 'ਸਟਾਫ਼ ਅਤੇ ਹੋਰ ਮਰੀਜ਼ਾਂ ਨਾਲ ਇੱਜ਼ਤ ਨਾਲ ਪੇਸ਼ ਆਉਣਾ।'),
          L('Keep your appointment or tell the team early if you cannot come.', 'ਅਪੌਇੰਟਮੈਂਟ ਮੰਨਣੀ ਜਾਂ ਨਾ ਆ ਸਕੋ ਤਾਂ ਟੀਮ ਨੂੰ ਪਹਿਲਾਂ ਦੱਸਣਾ।'),
          L('Ask questions when something is not clear.', 'ਕੋਈ ਗੱਲ ਸਾਫ਼ ਨਾ ਹੋਵੇ ਤਾਂ ਸਵਾਲ ਪੁੱਛਣੇ।'),
        ],
      },
      {
        h: L('3. Speak up', '3. ਆਵਾਜ਼ ਉਠਾਓ'),
        paras: [
          L(
            'If something feels wrong or unclear, tell any staff member or call +91 98787 52241. Concerns are taken seriously and do not affect your care.',
            'ਜੇ ਕੁਝ ਗਲਤ ਜਾਂ ਅਸਪਸ਼ਟ ਲੱਗੇ ਤਾਂ ਕਿਸੇ ਵੀ ਸਟਾਫ਼ ਮੈਂਬਰ ਨੂੰ ਦੱਸੋ ਜਾਂ +91 98787 52241 ਤੇ ਕਾਲ ਕਰੋ। ਚਿੰਤਾਵਾਂ ਗੰਭੀਰਤਾ ਨਾਲ ਲਈਆਂ ਜਾਂਦੀਆਂ ਹਨ ਅਤੇ ਤੁਹਾਡੀ ਦੇਖਭਾਲ ਤੇ ਅਸਰ ਨਹੀਂ ਪਾਉਂਦੀਆਂ।',
          ),
        ],
      },
    ],
  },

  'appointment-cancellation-and-refund': {
    slug: 'appointment-cancellation-and-refund',
    title: L('Appointment cancellation and refund', 'ਅਪੌਇੰਟਮੈਂਟ ਰੱਦ ਕਰਨਾ ਤੇ ਰਕਮ ਵਾਪਸੀ'),
    sections: [
      {
        h: L('1. Booking', '1. ਬੁਕਿੰਗ'),
        paras: [
          L(
            'Appointments are made by phone, WhatsApp or the form on this site, and confirmed when the team replies.',
            'ਅਪੌਇੰਟਮੈਂਟ ਫ਼ੋਨ, ਵਟਸਐਪ ਜਾਂ ਇਸ ਸਾਈਟ ਦੇ ਫ਼ਾਰਮ ਰਾਹੀਂ ਬਣਦੀ ਹੈ, ਅਤੇ ਟੀਮ ਦੇ ਜਵਾਬ ਨਾਲ ਪੱਕੀ ਹੁੰਦੀ ਹੈ।',
          ),
        ],
      },
      {
        h: L('2. Changing or cancelling', '2. ਸਮਾਂ ਬਦਲਣਾ ਜਾਂ ਰੱਦ ਕਰਨਾ'),
        paras: [
          L(
            'If you cannot come, call or WhatsApp +91 98787 52241 as early as you can. A new time is set without any charge.',
            'ਜੇ ਨਹੀਂ ਆ ਸਕਦੇ ਤਾਂ ਜਿੰਨੀ ਜਲਦੀ ਹੋ ਸਕੇ +91 98787 52241 ਤੇ ਕਾਲ ਜਾਂ ਵਟਸਐਪ ਕਰੋ। ਨਵਾਂ ਸਮਾਂ ਬਿਨਾਂ ਕਿਸੇ ਖ਼ਰਚੇ ਦੇ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ।',
          ),
        ],
      },
      {
        h: L('3. Missed visits', '3. ਛੁੱਟੀ ਗਈ ਮੁਲਾਕਾਤ'),
        paras: [
          L(
            'If you miss a visit, you can simply rebook. There is no penalty for a missed appointment.',
            'ਜੇ ਮੁਲਾਕਾਤ ਛੁੱਟ ਜਾਵੇ ਤਾਂ ਤੁਸੀਂ ਦੁਬਾਰਾ ਬੁੱਕ ਕਰ ਸਕਦੇ ਹੋ। ਛੁੱਟੀ ਗਈ ਅਪੌਇੰਟਮੈਂਟ ਦਾ ਕੋਈ ਜੁਰਮਾਨਾ ਨਹੀਂ।',
          ),
        ],
      },
      {
        h: L('4. Payments', '4. ਭੁਗਤਾਨ'),
        paras: [
          L(
            'This website does not take online payment. Consultation and treatment charges are paid at the hospital, and a receipt is given for every payment.',
            'ਇਹ ਵੈੱਬਸਾਈਟ ਆਨਲਾਈਨ ਭੁਗਤਾਨ ਨਹੀਂ ਲੈਂਦੀ। ਕਨਸਲਟੇਸ਼ਨ ਅਤੇ ਇਲਾਜ ਦੇ ਚਾਰਜ ਹਸਪਤਾਲ ਵਿੱਚ ਹੀ ਦਿੱਤੇ ਜਾਂਦੇ ਹਨ, ਅਤੇ ਹਰ ਭੁਗਤਾਨ ਦੀ ਰਸੀਦ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ।',
          ),
          L(
            'The hospital does not take any advance payment for appointments, so there is nothing to refund. Any payment you make at the hospital is for consultation or treatment already given.',
            'ਹਸਪਤਾਲ ਅਪੌਇੰਟਮੈਂਟ ਲਈ ਕੋਈ ਐਡਵਾਂਸ ਭੁਗਤਾਨ ਨਹੀਂ ਲੈਂਦਾ, ਇਸ ਲਈ ਵਾਪਸੀ ਦਾ ਸਵਾਲ ਹੀ ਨਹੀਂ ਪੈਦਾ ਹੁੰਦਾ। ਹਸਪਤਾਲ ਵਿੱਚ ਕੀਤਾ ਗਿਆ ਹਰ ਭੁਗਤਾਨ ਕਨਸਲਟੇਸ਼ਨ ਜਾਂ ਪਹਿਲਾਂ ਹੀ ਹੋਏ ਇਲਾਜ ਲਈ ਹੁੰਦਾ ਹੈ।',
          ),
        ],
      },
      {
        h: L('5. Ayushman Bharat PM-JAY', '5. ਆਯੁਸ਼ਮਾਨ ਭਾਰਤ PM-JAY'),
        paras: [
          L(
            'Gupta Hospital is empanelled under PM-JAY (HFR ID IN0310002794). Bring your card; the team checks whether your treatment is covered before it starts.',
            'ਗੁਪਤਾ ਹਸਪਤਾਲ PM-JAY ਅਧੀਨ ਸੂਚੀਬੱਧ ਹੈ (HFR ID IN0310002794)। ਆਪਣਾ ਕਾਰਡ ਲਿਆਓ; ਤੁਹਾਡਾ ਇਲਾਜ ਸ਼ਾਮਲ ਹੈ ਜਾਂ ਨਹੀਂ, ਟੀਮ ਇਲਾਜ ਤੋਂ ਪਹਿਲਾਂ ਜਾਂਚ ਕਰਦੀ ਹੈ।',
          ),
        ],
      },
      {
        h: L('6. Contact', '6. ਸੰਪਰਕ'),
        paras: [
          L(
            'Gupta Hospital, Power House Road, Bathinda, Punjab 151001 · +91 98787 52241 · guptahospitalbathinda@gmail.com',
            'ਗੁਪਤਾ ਹਸਪਤਾਲ, ਪਾਵਰ ਹਾਊਸ ਰੋਡ, ਬਠਿੰਡਾ, ਪੰਜਾਬ 151001 · +91 98787 52241 · guptahospitalbathinda@gmail.com',
          ),
        ],
      },
    ],
  },

  'accessibility-statement': {
    slug: 'accessibility-statement',
    title: L('Accessibility statement', 'ਪਹੁੰਚ-ਯੋਗਤਾ ਬਿਆਨ'),
    sections: [
      {
        h: L('1. Our aim', '1. ਸਾਡਾ ਟੀਚਾ'),
        paras: [
          L(
            'Gupta Hospital wants this website to be usable by everyone, including people who use screen readers, keyboards only, or zoom. We aim for WCAG 2.2 level AA.',
            'ਗੁਪਤਾ ਹਸਪਤਾਲ ਚਾਹੁੰਦਾ ਹੈ ਕਿ ਇਹ ਵੈੱਬਸਾਈਟ ਹਰ ਕਿਸੇ ਲਈ ਵਰਤੋਂ ਯੋਗ ਹੋਵੇ, ਜਿਸ ਵਿੱਚ ਸਕਰੀਨ ਰੀਡਰ, ਸਿਰਫ਼ ਕੀਬੋਰਡ ਜਾਂ ਜ਼ੂਮ ਵਰਤਣ ਵਾਲੇ ਵੀ ਹਨ। ਸਾਡਾ ਟੀਚਾ WCAG 2.2 ਲੈਵਲ AA ਹੈ।',
          ),
        ],
      },
      {
        h: L('2. What we do', '2. ਅਸੀਂ ਕੀ ਕਰਦੇ ਹਾਂ'),
        list: [
          L('Text contrast of at least 4.5:1 against its background.', 'ਟੈਕਸਟ ਦਾ ਕੰਟਰਾਸਟ ਘੱਟੋ-ਘੱਟ 4.5:1।'),
          L('Tap targets of at least 48px on every interactive element.', 'ਹਰ ਇੰਟਰਐਕਟਿਵ ਐਲੀਮੈਂਟ ਲਈ ਘੱਟੋ-ਘੱਟ 48px ਟੈਪ ਟਾਰਗਟ।'),
          L('Full keyboard access, visible focus, and skip links.', 'ਪੂਰੀ ਕੀਬੋਰਡ ਪਹੁੰਚ, ਦਿਸਦਾ ਫ਼ੋਕਸ, ਅਤੇ ਸਕਿਪ ਲਿੰਕ।'),
          L('Animations that switch off when reduced motion is requested.', 'ਰਿਡਿਊਸਡ ਮੋਸ਼ਨ ਦੀ ਬੇਨਤੀ ਤੇ ਬੰਦ ਹੋ ਜਾਣ ਵਾਲੀਆਂ ਐਨੀਮੇਸ਼ਨਾਂ।'),
          L('Real text in English and Punjabi (Gurmukhi), not images of text.', 'ਅੰਗਰੇਜ਼ੀ ਤੇ ਪੰਜਾਬੀ (ਗੁਰਮੁਖੀ) ਵਿੱਚ ਅਸਲ ਟੈਕਸਟ, ਟੈਕਸਟ ਦੀਆਂ ਤਸਵੀਰਾਂ ਨਹੀਂ।'),
          L('Body text of at least 17px and a single clear heading order.', 'ਘੱਟੋ-ਘੱਟ 17px ਬਾਡੀ ਟੈਕਸਟ ਅਤੇ ਸਪਸ਼ਟ ਸਿਰਲੇਖ ਕ੍ਰਮ।'),
        ],
      },
      {
        h: L('3. Known gaps', '3. ਜਾਣੀਆਂ ਕਮੀਆਂ'),
        list: [
          L(
            'Press clippings are scanned newspaper images with short alt text, not full transcripts. Contact us and we will read or send the content.',
            'ਪ੍ਰੈੱਸ ਕਤਰਨਾਂ ਅਖ਼ਬਾਰਾਂ ਦੀਆਂ ਸਕੈਨ ਕੀਤੀਆਂ ਤਸਵੀਰਾਂ ਹਨ ਜਿਨ੍ਹਾਂ ਦਾ ਛੋਟਾ alt ਟੈਕਸਟ ਹੈ, ਪੂਰਾ ਟ੍ਰਾਂਸਕ੍ਰਿਪਟ ਨਹੀਂ। ਸੰਪਰਕ ਕਰੋ, ਅਸੀਂ ਸਮੱਗਰੀ ਪੜ੍ਹ ਕੇ ਜਾਂ ਭੇਜ ਕੇ ਦੱਸਾਂਗੇ।',
          ),
          L(
            'The embedded map is provided by Google and may not work with every assistive tool; the address is also given as plain text.',
            'ਇਮਬੈਡ ਕੀਤਾ ਨਕਸ਼ਾ ਗੂਗਲ ਵੱਲੋਂ ਹੈ ਅਤੇ ਹਰ ਸਹਾਇਕ ਟੂਲ ਨਾਲ ਸ਼ਾਇਦ ਨਾ ਚਲੇ; ਪਤਾ ਸਾਦੇ ਟੈਕਸਟ ਵਿੱਚ ਵੀ ਦਿੱਤਾ ਹੈ।',
          ),
          L(
            'Punjabi legal text is drafted and pending translation review.',
            'ਪੰਜਾਬੀ ਕਾਨੂੰਨੀ ਲਿਖਤ ਮਸੌਦਾ ਹੈ ਅਤੇ ਅਨੁਵਾਦ ਸਮੀਖਿਆ ਬਾਕੀ ਹੈ।',
          ),
        ],
      },
      {
        h: L('4. Tell us about a problem', '4. ਸਮੱਸਿਆ ਬਾਰੇ ਦੱਸੋ'),
        paras: [
          L(
            'If anything on this site stops you from reaching care, call +91 98787 52241 or write to guptahospitalbathinda@gmail.com. We will help you directly and fix the page where we can.',
            'ਜੇ ਇਸ ਸਾਈਟ ਦੀ ਕੋਈ ਵੀ ਚੀਜ਼ ਤੁਹਾਨੂੰ ਦੇਖਭਾਲ ਤੱਕ ਪਹੁੰਚਣ ਤੋਂ ਰੋਕੇ ਤਾਂ +91 98787 52241 ਤੇ ਕਾਲ ਕਰੋ ਜਾਂ guptahospitalbathinda@gmail.com ਤੇ ਲਿਖੋ। ਅਸੀਂ ਸਿੱਧੀ ਮਦਦ ਕਰਾਂਗੇ ਅਤੇ ਜਿੱਥੇ ਹੋ ਸਕੇ ਪੰਨਾ ਠੀਕ ਕਰਾਂਗੇ।',
          ),
        ],
      },
    ],
  },
};

export function getLegalDoc(slug: string): LegalDocData {
  const d = LEGAL_DOCS[slug];
  if (!d) throw new Error(`legal: no document "${slug}"`);
  return d;
}
