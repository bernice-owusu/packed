import { SiteContent } from '../types';
import {
  heroSlides as defaultHeroSlides,
  c4Banners as defaultC4Banners,
  c6Banner as defaultC6Banner,
  c8Banners as defaultC8Banners,
} from './mockData';

export const initialSiteContent: SiteContent = {
  heroSlides: defaultHeroSlides.map(slide => ({ ...slide })),
  c4Banners: defaultC4Banners.map(banner => ({ ...banner })),
  c6Banner: { ...defaultC6Banner },
  c8Banners: defaultC8Banners.map(banner => ({ ...banner })),
  about: {
    badge: 'About Packed by Dolyn',
    title: 'Packaging Excellence, Pure Shea Wellness & Event Celebrations in Ghana',
    intro:
      'Packed by Dolyn is a registered Ghanaian company specializing in bespoke gift packaging, event management, premium Grade-A shea butter cosmetics, household sanitary essentials, and verified pharmaceuticals.',
    stats: [
      { value: '100%', label: 'Grade-A Raw Shea' },
      { value: '16', label: 'Regions in Ghana Delivered' },
      { value: 'Corporate', label: '& Bridal Packages' },
      { value: '0244149464', label: 'Direct Owner Hotline' },
    ],
    pillars: [
      {
        title: 'Shea Butter & Cosmetics',
        description:
          "We source unrefined ivory and yellow shea nuts directly from women's farming cooperatives in Northern Ghana. Our whipped butters, glow oils, and black soaps preserve pure botanical nutrients for radiant skin.",
      },
      {
        title: 'Event Packaging & Hampers',
        description:
          'From executive corporate gift hampers to personalized wedding keepsakes and bridal party favors, our packaging brings sophistication with royal purple ribbons, luxury boxes, and bespoke cards.',
      },
      {
        title: 'Pharmacy & Sanitary Essentials',
        description:
          'We provide essential over-the-counter pain relief, immune multivitamins, syrups, and hospital-grade sanitizing detergents, ensuring wholesome family wellness delivered right to your doorstep.',
      },
    ],
    founderLabel: 'Business Owner & Founder',
    founderName: 'Gwendolyn Barnie Boahen',
    founderInitials: 'GB',
    founderQuote:
      'At Packed by Dolyn, our driving mission is delivering extraordinary value for money, convenience, and distinct packaging quality. Whether you need a single bottle of whipped lavender shea butter or 500 customized corporate gift hampers, we handle every detail with personal care.',
  },
  contact: {
    phone: '0244149464',
    whatsapp: '233244149464',
    whatsappDisplay: '+233 24 414 9464',
    email: 'gbbyaa@gmail.com',
    primaryContactName: 'Gwendolyn Barnie Boahen',
    addressLine1: 'Accra, Greater Accra Region, Ghana',
    addressShort: 'Accra, Ghana',
    addressNote: 'Nationwide Courier Shipping',
    hours: 'Mon - Sat: 8:00 AM - 7:00 PM',
  },
};

export const normalizeSiteContent = (raw: unknown): SiteContent => {
  const value = (raw && typeof raw === 'object' ? raw : {}) as Partial<SiteContent>;
  const about = { ...initialSiteContent.about, ...(value.about || {}) };
  const contact = { ...initialSiteContent.contact, ...(value.contact || {}) };

  return {
    heroSlides:
      Array.isArray(value.heroSlides) && value.heroSlides.length > 0
        ? value.heroSlides
        : initialSiteContent.heroSlides,
    c4Banners:
      Array.isArray(value.c4Banners) && value.c4Banners.length > 0
        ? value.c4Banners
        : initialSiteContent.c4Banners,
    c6Banner:
      value.c6Banner && typeof value.c6Banner === 'object'
        ? { ...initialSiteContent.c6Banner, ...value.c6Banner }
        : initialSiteContent.c6Banner,
    c8Banners:
      Array.isArray(value.c8Banners) && value.c8Banners.length > 0
        ? value.c8Banners
        : initialSiteContent.c8Banners,
    about: {
      ...about,
      stats:
        Array.isArray(about.stats) && about.stats.length > 0
          ? about.stats
          : initialSiteContent.about.stats,
      pillars:
        Array.isArray(about.pillars) && about.pillars.length > 0
          ? about.pillars
          : initialSiteContent.about.pillars,
    },
    contact,
  };
};
