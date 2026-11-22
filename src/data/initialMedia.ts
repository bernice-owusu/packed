import { MediaItem } from '../types';

export const initialMediaItems: MediaItem[] = [
  // 1. Shea Butter & Cosmetics
  {
    id: 'med-shea-1',
    title: 'Whipped Shea Butter with Lavender (Amber Jar)',
    category: 'Shea Butter & Cosmetics',
    url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
    uploadedAt: '2026-11-15',
    isCustom: false
  },
  {
    id: 'med-shea-2',
    title: 'Raw Unrefined Northern Ghana Ivory Shea Tub',
    category: 'Shea Butter & Cosmetics',
    url: 'https://images.unsplash.com/photo-1608248597359-00958145a278?w=800&auto=format&fit=crop&q=80',
    uploadedAt: '2026-11-15',
    isCustom: false
  },
  {
    id: 'med-shea-3',
    title: 'Shea Glow Nourishing Body Oil with Sweet Almond',
    category: 'Shea Butter & Cosmetics',
    url: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=800&auto=format&fit=crop&q=80',
    uploadedAt: '2026-11-16',
    isCustom: false
  },
  {
    id: 'med-shea-4',
    title: 'Traditional African Black Soap Glow Bar with Turmeric',
    category: 'Shea Butter & Cosmetics',
    url: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=800&auto=format&fit=crop&q=80',
    uploadedAt: '2026-11-16',
    isCustom: false
  },
  {
    id: 'med-shea-5',
    title: 'Whipped Shea Hair Pomade & Scalp Conditioner',
    category: 'Shea Butter & Cosmetics',
    url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=80',
    uploadedAt: '2026-11-16',
    isCustom: false
  },

  // 2. Perfumes & Fragrances
  {
    id: 'med-frag-1',
    title: 'Vanilla Oud & Golden Amber Body Mist (250ml)',
    category: 'Perfumes & Fragrances',
    url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
    uploadedAt: '2026-11-15',
    isCustom: false
  },
  {
    id: 'med-frag-2',
    title: 'Arabian Rose & Musk Concentrated Perfume Oil',
    category: 'Perfumes & Fragrances',
    url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80',
    uploadedAt: '2026-11-16',
    isCustom: false
  },
  {
    id: 'med-frag-3',
    title: 'Sweet Coconut & Passion Fruit Shimmer Splash',
    category: 'Perfumes & Fragrances',
    url: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80',
    uploadedAt: '2026-11-16',
    isCustom: false
  },
  {
    id: 'med-frag-4',
    title: 'Executive Oud Noir Eau de Parfum for Men & Women',
    category: 'Perfumes & Fragrances',
    url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80',
    uploadedAt: '2026-11-17',
    isCustom: false
  },

  // 3. Gift Packaging & Hampers
  {
    id: 'med-gift-1',
    title: 'Executive Corporate Wellness Wooden Hamper',
    category: 'Gift Packaging & Hampers',
    url: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&auto=format&fit=crop&q=80',
    uploadedAt: '2026-11-15',
    isCustom: false
  },
  {
    id: 'med-gift-2',
    title: 'Wedding Souvenir Custom Ribbon Gift Box Set',
    category: 'Gift Packaging & Hampers',
    url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80',
    uploadedAt: '2026-11-16',
    isCustom: false
  },
  {
    id: 'med-gift-3',
    title: 'Birthday Glow Pamper Gift Crate',
    category: 'Gift Packaging & Hampers',
    url: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=800&auto=format&fit=crop&q=80',
    uploadedAt: '2026-11-17',
    isCustom: false
  },
  {
    id: 'med-gift-4',
    title: 'Luxury Gold Foil Rigid Keepsake Box with Satin Ribbon',
    category: 'Gift Packaging & Hampers',
    url: 'https://images.unsplash.com/photo-1531303435785-3853fb035e0a?w=800&auto=format&fit=crop&q=80',
    uploadedAt: '2026-11-17',
    isCustom: false
  },

  // 4. Household & Sanitary
  {
    id: 'med-san-1',
    title: 'Hospital-Grade Antibacterial Multi-Surface Cleaner (5L)',
    category: 'Household & Sanitary',
    url: 'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=800&auto=format&fit=crop&q=80',
    uploadedAt: '2026-11-15',
    isCustom: false
  },
  {
    id: 'med-san-2',
    title: 'Citrus Scented Heavy-Duty Bleach Disinfectant',
    category: 'Household & Sanitary',
    url: 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=800&auto=format&fit=crop&q=80',
    uploadedAt: '2026-11-16',
    isCustom: false
  },
  {
    id: 'med-san-3',
    title: 'Moisturizing Aloe Vera Hand Wash Liquid Pump (500ml)',
    category: 'Household & Sanitary',
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
    uploadedAt: '2026-11-16',
    isCustom: false
  },

  // 5. Pharmacy & Drugs
  {
    id: 'med-rx-1',
    title: 'Vitamin C 1000mg + Zinc Effervescent Orange Tablets',
    category: 'Pharmacy & Drugs',
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
    uploadedAt: '2026-11-15',
    isCustom: false
  },
  {
    id: 'med-rx-2',
    title: 'Paracetamol Extra 500mg/65mg Tablets Blister Pack',
    category: 'Pharmacy & Drugs',
    url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=800&auto=format&fit=crop&q=80',
    uploadedAt: '2026-11-16',
    isCustom: false
  },
  {
    id: 'med-rx-3',
    title: 'Multivitamin Daily Immune Complex with Iron & B-12',
    category: 'Pharmacy & Drugs',
    url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&auto=format&fit=crop&q=80',
    uploadedAt: '2026-11-16',
    isCustom: false
  },
  {
    id: 'med-rx-4',
    title: 'Antiseptic Disinfectant Liquid for First Aid & Wound Cleansing',
    category: 'Pharmacy & Drugs',
    url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&auto=format&fit=crop&q=80',
    uploadedAt: '2026-11-17',
    isCustom: false
  },

  // 6. Flash Deals & Specials
  {
    id: 'med-promo-1',
    title: 'Wholesale Carton Master Box (12 Units Wholesale)',
    category: 'Flash Deals & Specials',
    url: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&auto=format&fit=crop&q=80',
    uploadedAt: '2026-11-15',
    isCustom: false
  },
  {
    id: 'med-promo-2',
    title: 'Luxury 3-Piece Fragrance & Shea Butter Gift Bundle',
    category: 'Flash Deals & Specials',
    url: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&auto=format&fit=crop&q=80',
    uploadedAt: '2026-11-16',
    isCustom: false
  }
];
