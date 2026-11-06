import { Product, Category, HeroSlide, PromoBanner, Brand, BlogPost, InfoBox, Order } from '../types';

export const categories: Category[] = [
  {
    id: 'shea-cosmetics',
    title: 'Shea Butter & Cosmetics',
    count: '8 Products',
    icon: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=150&auto=format&fit=crop&q=80',
    description: '100% pure raw unrefined shea butter, whipped body butters & organic skincare.'
  },
  {
    id: 'perfumes-fragrances',
    title: 'Perfumes & Fragrances',
    count: '6 Products',
    icon: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=150&auto=format&fit=crop&q=80',
    description: 'Luxurious body splashes, mists & concentrated oil perfumes in diverse sizes.'
  },
  {
    id: 'gift-packaging',
    title: 'Gift Packaging & Hampers',
    count: '6 Products',
    icon: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=150&auto=format&fit=crop&q=80',
    description: 'Custom curated gift boxes, corporate hampers and event souvenir packaging.'
  },
  {
    id: 'household-sanitary',
    title: 'Household & Sanitary',
    count: '6 Products',
    icon: 'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=150&auto=format&fit=crop&q=80',
    description: 'Antibacterial hand washes, disinfectants, bleaches & sanitizing detergents.'
  },
  {
    id: 'pharmacy-drugs',
    title: 'Pharmacy & Drugs',
    count: '8 Products',
    icon: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=80',
    description: 'Over-the-counter pain relief, immune multivitamins, syrups & first aid.'
  },
  {
    id: 'flash-promos',
    title: 'Flash Deals & Specials',
    count: '4 Products',
    icon: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=150&auto=format&fit=crop&q=80',
    description: 'Limited-time discounts, wholesale packs & holiday gift promotions.'
  }
];

export const products: Product[] = [
  // ==========================================
  // 1. Shea Butter & Natural Cosmetics (8 Products)
  // ==========================================
  {
    id: 1,
    title: 'Whipped Raw Shea Butter with Lavender & Vitamin E',
    category: 'Shea Butter & Cosmetics',
    price: 'GH₵ 45.00',
    numericPrice: 45.0,
    originalPrice: 'GH₵ 55.00',
    rating: 4.9,
    reviewCount: 38,
    badges: ['Bestseller', '100% Organic'],
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    description: 'Handcrafted in Ghana using premium Grade-A unrefined shea butter, cold-pressed coconut oil, calming French lavender extract, and pure Vitamin E. Deeply hydrates dry skin, improves skin elasticity, and softens rough heels.',
    sku: 'DOLYN-SH-01',
    inStock: true,
    stockCount: 45,
    sizes: ['150g', '250g (Standard)', '500g (Family)'],
    varieties: ['Lavender Dream', 'Sweet Vanilla', 'Unscented Natural'],
    wholesaleBoxQuantity: 12,
    wholesaleBoxPrice: 'GH₵ 450.00',
    ingredients: 'Pure Unrefined Butyrospermum Parkii (Shea) Butter, Cocos Nucifera (Coconut) Oil, Tocopherol (Vitamin E), Lavandula Angustifolia Oil.'
  },
  {
    id: 2,
    title: '100% Pure Unrefined Northern Ivory Shea Butter (1kg Bucket)',
    category: 'Shea Butter & Cosmetics',
    price: 'GH₵ 75.00',
    numericPrice: 75.0,
    originalPrice: 'GH₵ 90.00',
    rating: 5.0,
    reviewCount: 52,
    badges: ['Bulk Value', 'Raw & Pure'],
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    description: 'Traditional Ghanaian ivory shea butter sourced directly from women’s cooperatives in Northern Ghana. Unbleached, unrefined, retaining all natural fatty acids, vitamins A, E & F for skin healing and haircare.',
    sku: 'DOLYN-SH-02',
    inStock: true,
    stockCount: 30,
    sizes: ['1kg Bucket', '2.5kg Tub', '5kg Commercial'],
    wholesaleBoxQuantity: 10,
    wholesaleBoxPrice: 'GH₵ 650.00'
  },
  {
    id: 3,
    title: 'Shea Glow Nourishing Body Oil with Sweet Almond',
    category: 'Shea Butter & Cosmetics',
    price: 'GH₵ 55.00',
    numericPrice: 55.0,
    originalPrice: null,
    rating: 4.8,
    reviewCount: 24,
    badges: ['Popular'],
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80',
    description: 'Lightweight, fast-absorbing botanical dry oil that infuses liquid shea olein, sweet almond oil, and golden jojoba. Delivers a radiant satin sheen without greasy residue.',
    sku: 'DOLYN-SH-03',
    inStock: true,
    stockCount: 28,
    sizes: ['100ml', '200ml'],
    varieties: ['Warm Amber Glow', 'Citrus Blossom']
  },
  {
    id: 4,
    title: 'Handcrafted African Black Soap Glow Bar with Turmeric',
    category: 'Shea Butter & Cosmetics',
    price: 'GH₵ 25.00',
    numericPrice: 25.0,
    originalPrice: 'GH₵ 30.00',
    rating: 4.9,
    reviewCount: 41,
    badges: ['Natural'],
    image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&auto=format&fit=crop&q=80',
    description: 'Formulated with roasted plantain skin ash, cocoa pod ashes, unrefined shea butter, turmeric root, and raw honey. Gently exfoliates, cleanses blemish-prone skin, and balances oil production.',
    sku: 'DOLYN-SH-04',
    inStock: true,
    stockCount: 60,
    wholesaleBoxQuantity: 24,
    wholesaleBoxPrice: 'GH₵ 480.00'
  },
  {
    id: 5,
    title: 'Ultra-Nourishing Shea Hair Butter & Scalp Pomade',
    category: 'Shea Butter & Cosmetics',
    price: 'GH₵ 40.00',
    numericPrice: 40.0,
    originalPrice: null,
    rating: 4.7,
    reviewCount: 19,
    badges: ['Hair Care'],
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
    description: 'Enriched with peppermint oil, rosemary extract, chebe powder, and virgin shea butter. Locks in moisture for natural afro and textured hair, minimizes breakage, and soothes dry, itchy scalps.',
    sku: 'DOLYN-SH-05',
    inStock: true,
    stockCount: 22,
    sizes: ['250g', '500g']
  },
  {
    id: 6,
    title: 'Raw Golden Yellow Shea Butter with Borututu Bark (1kg)',
    category: 'Shea Butter & Cosmetics',
    price: 'GH₵ 80.00',
    numericPrice: 80.0,
    originalPrice: 'GH₵ 95.00',
    rating: 4.9,
    reviewCount: 31,
    badges: ['Medicinal', 'Pure Borututu'],
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80',
    description: 'Traditional yellow shea butter infused with therapeutic Borututu tree bark extract. Packed with natural antioxidants, relieves joint aches, heals sunburns, and reduces inflammation.',
    sku: 'DOLYN-SH-06',
    inStock: true,
    stockCount: 25,
    sizes: ['1kg Tub', '2.5kg Tub'],
    wholesaleBoxQuantity: 10,
    wholesaleBoxPrice: 'GH₵ 700.00'
  },
  {
    id: 7,
    title: 'Organic Shea & Cocoa Butter Whipped Soufflé (300ml)',
    category: 'Shea Butter & Cosmetics',
    price: 'GH₵ 50.00',
    numericPrice: 50.0,
    originalPrice: 'GH₵ 60.00',
    rating: 5.0,
    reviewCount: 28,
    badges: ['Decadent Hydration'],
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80',
    description: 'Luxurious fusion of Northern shea butter and Ghanaian unrefined cocoa butter. Smells deliciously like chocolate and vanilla while erasing stretch marks and moisturizing dry elbows and knees.',
    sku: 'DOLYN-SH-07',
    inStock: true,
    stockCount: 32,
    sizes: ['300ml Jar', '500ml Family Jar'],
    varieties: ['Chocolate Vanilla', 'Pure Cocoa']
  },
  {
    id: 8,
    title: 'Gentle Exfoliating Coffee & Shea Body Scrub (250g)',
    category: 'Shea Butter & Cosmetics',
    price: 'GH₵ 45.00',
    numericPrice: 45.0,
    originalPrice: null,
    rating: 4.8,
    reviewCount: 22,
    badges: ['Glow Booster'],
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80',
    description: 'Freshly ground robusta coffee beans, brown sugar crystals, whipped shea butter, and sweet orange essential oil. Buffs away dead skin cells, stimulates blood flow, and reduces cellulite.',
    sku: 'DOLYN-SH-08',
    inStock: true,
    stockCount: 20
  },

  // ==========================================
  // 2. Perfumes & Fragrances (6 Products)
  // ==========================================
  {
    id: 9,
    title: 'Vanilla Oud Luxury Body Splash (250ml)',
    category: 'Perfumes & Fragrances',
    price: 'GH₵ 65.00',
    numericPrice: 65.0,
    originalPrice: 'GH₵ 80.00',
    rating: 4.9,
    reviewCount: 33,
    badges: ['Bestseller', 'Long-Lasting'],
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80',
    description: 'An intoxicating blend of Madagascar bourbon vanilla, warm Arabian agarwood (oud), and subtle golden caramel. Leaves an unforgettable sensual trail that lingers for over 12 hours.',
    sku: 'DOLYN-PF-01',
    inStock: true,
    stockCount: 35,
    sizes: ['100ml Travel', '250ml Full Spray'],
    varieties: ['Original Vanilla Oud', 'Oud Rose Extreme'],
    wholesaleBoxQuantity: 12,
    wholesaleBoxPrice: 'GH₵ 650.00'
  },
  {
    id: 10,
    title: 'Amber Rose Shimmering Fragrance Mist (250ml)',
    category: 'Perfumes & Fragrances',
    price: 'GH₵ 60.00',
    numericPrice: 60.0,
    originalPrice: 'GH₵ 70.00',
    rating: 4.8,
    reviewCount: 27,
    badges: ['New', 'Shimmer'],
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&auto=format&fit=crop&q=80',
    description: 'Romantic Bulgarian rose petals woven with rich amber, peony, and micronized biodegradable gold sparkle for illuminated evening elegance.',
    sku: 'DOLYN-PF-02',
    inStock: true,
    stockCount: 18,
    sizes: ['150ml', '250ml']
  },
  {
    id: 11,
    title: 'Royal Purple Concentrated Perfume Oil (Roll-On 15ml)',
    category: 'Perfumes & Fragrances',
    price: 'GH₵ 45.00',
    numericPrice: 45.0,
    originalPrice: null,
    rating: 5.0,
    reviewCount: 16,
    badges: ['Alcohol-Free'],
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop&q=80',
    description: '100% pure undiluted perfume oil with deep royal purple packaging. Notes of dark plum, velvet violet, amber crystals, and soft cedarwood.',
    sku: 'DOLYN-PF-03',
    inStock: true,
    stockCount: 40,
    wholesaleBoxQuantity: 20,
    wholesaleBoxPrice: 'GH₵ 720.00'
  },
  {
    id: 12,
    title: 'Sweet Citrus Blossom & Jasmine Body Splash (250ml)',
    category: 'Perfumes & Fragrances',
    price: 'GH₵ 60.00',
    numericPrice: 60.0,
    originalPrice: 'GH₵ 70.00',
    rating: 4.8,
    reviewCount: 21,
    badges: ['Fresh Daily'],
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&auto=format&fit=crop&q=80',
    description: 'Invigorating blend of Sicilian bergamot, fresh neroli blossom, wild white jasmine, and aquatic white musk. Crisp, uplifting, and refreshing for Ghana’s sunny days.',
    sku: 'DOLYN-PF-04',
    inStock: true,
    stockCount: 30,
    sizes: ['100ml', '250ml']
  },
  {
    id: 13,
    title: 'Arabian Sandalwood & Cocoa Musk Fine Mist (200ml)',
    category: 'Perfumes & Fragrances',
    price: 'GH₵ 70.00',
    numericPrice: 70.0,
    originalPrice: 'GH₵ 85.00',
    rating: 4.9,
    reviewCount: 19,
    badges: ['Warm Woody'],
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80',
    description: 'Sophisticated unisex fragrance fusing creamy Mysore sandalwood, rich Ghanaian cocoa bean extract, tonka bean, and warm musk.',
    sku: 'DOLYN-PF-05',
    inStock: true,
    stockCount: 22
  },
  {
    id: 14,
    title: 'Signature Dolyn Pocket Fragrance Spray Set (3 x 20ml)',
    category: 'Perfumes & Fragrances',
    price: 'GH₵ 55.00',
    numericPrice: 55.0,
    originalPrice: 'GH₵ 65.00',
    rating: 5.0,
    reviewCount: 26,
    badges: ['Travel Pack'],
    image: 'https://images.unsplash.com/photo-1583445013765-46c20c4a6772?w=600&auto=format&fit=crop&q=80',
    description: 'Trio of compact travel sprays: Vanilla Oud, Amber Rose, and Sweet Citrus. Fits easily in handbags, clutches, and pockets for instant fragrance touch-ups.',
    sku: 'DOLYN-PF-06',
    inStock: true,
    stockCount: 35,
    wholesaleBoxQuantity: 15,
    wholesaleBoxPrice: 'GH₵ 675.00'
  },

  // ==========================================
  // 3. Gift Packaging & Event Hampers (6 Products)
  // ==========================================
  {
    id: 15,
    title: 'Executive Corporate Luxury Gift Hamper',
    category: 'Gift Packaging & Hampers',
    price: 'GH₵ 350.00',
    numericPrice: 350.0,
    originalPrice: 'GH₵ 400.00',
    rating: 5.0,
    reviewCount: 18,
    badges: ['Corporate Favorite', 'Customizable'],
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&auto=format&fit=crop&q=80',
    description: 'Signature Packed by Dolyn corporate hamper featuring a handcrafted gift box with royal purple satin bow, whipped shea butter jar, luxury body mist, insulated travel mug, artisan dark chocolates, and a personalized corporate message card.',
    sku: 'DOLYN-GP-01',
    inStock: true,
    stockCount: 15,
    isCustomizable: true,
    customizationOptions: [
      'Ribbon Color: Royal Purple / Champagne Gold / Burgundy',
      'Personalized Calligraphy Card Note',
      'Custom Corporate Logo Branding Sticker',
      'Choice of Shea Scent: Lavender or Vanilla'
    ],
    wholesaleBoxQuantity: 5,
    wholesaleBoxPrice: 'GH₵ 1500.00'
  },
  {
    id: 16,
    title: 'Royal Purple Wedding & Bridal Souvenir Gift Box',
    category: 'Gift Packaging & Hampers',
    price: 'GH₵ 120.00',
    numericPrice: 120.0,
    originalPrice: null,
    rating: 4.9,
    reviewCount: 22,
    badges: ['Event Special', 'Customizable'],
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80',
    description: 'Specially created for bridal parties, anniversaries, and luxury Ghanaian wedding souvenirs. Contains mini shea glow jar, perfume pocket spray, scented bath salts, and thank-you card in an embossed purple drawer box.',
    sku: 'DOLYN-GP-02',
    inStock: true,
    stockCount: 25,
    isCustomizable: true,
    customizationOptions: [
      'Bride & Groom Custom Monogram',
      'Satin Ribbon Tie',
      'Fragrance Selection'
    ],
    wholesaleBoxQuantity: 10,
    wholesaleBoxPrice: 'GH₵ 1000.00'
  },
  {
    id: 17,
    title: 'Self-Care & Pamper Celebration Gift Box',
    category: 'Gift Packaging & Hampers',
    price: 'GH₵ 180.00',
    numericPrice: 180.0,
    originalPrice: 'GH₵ 210.00',
    rating: 4.9,
    reviewCount: 14,
    badges: ['Gift Ready'],
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
    description: 'The ultimate birthday or milestone pamper set: 250g whipped shea butter, 100ml Vanilla Oud mist, handmade black soap bar, exfoliating sisal glove, and soy scented candle in a keepsake gift package.',
    sku: 'DOLYN-GP-03',
    inStock: true,
    stockCount: 12,
    isCustomizable: true,
    customizationOptions: ['Greeting Card Message', 'Box Color (Royal Purple / White Gold)']
  },
  {
    id: 18,
    title: 'Birthday Keepsake Gift Hamper with Scented Candle',
    category: 'Gift Packaging & Hampers',
    price: 'GH₵ 220.00',
    numericPrice: 220.0,
    originalPrice: 'GH₵ 260.00',
    rating: 5.0,
    reviewCount: 17,
    badges: ['Birthday Star', 'Customizable'],
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
    description: 'Exquisite celebration hamper with soy scented candle, vanilla shea butter, body splash, luxury chocolates, and festive birthday packaging with personalized greeting card.',
    sku: 'DOLYN-GP-04',
    inStock: true,
    stockCount: 14,
    isCustomizable: true,
    customizationOptions: ['Recipient Name Card', 'Ribbon Choice']
  },
  {
    id: 19,
    title: 'Custom Event Souvenir Gift Bags (Set of 10 with Ribbons)',
    category: 'Gift Packaging & Hampers',
    price: 'GH₵ 280.00',
    numericPrice: 280.0,
    originalPrice: 'GH₵ 320.00',
    rating: 4.9,
    reviewCount: 12,
    badges: ['Event Pack of 10', 'Bulk Discount'],
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80',
    description: 'Set of 10 matching celebration gift bags with custom satin bows, thank you tags, mini whipped shea jars (60g), and roll-on perfume oils. Ideal for bridal showers and event guests.',
    sku: 'DOLYN-GP-05',
    inStock: true,
    stockCount: 20,
    isCustomizable: true
  },
  {
    id: 20,
    title: 'Pre-Order: Luxury Velvet Wedding Keepsake Hamper',
    category: 'Gift Packaging & Hampers',
    price: 'GH₵ 420.00',
    numericPrice: 420.0,
    originalPrice: 'GH₵ 490.00',
    rating: 5.0,
    reviewCount: 8,
    badges: ['Pre-Order Only', 'Advance Confirmation'],
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&auto=format&fit=crop&q=80',
    description: 'Exclusive limited collection of handcrafted royal purple velvet gift boxes for grand wedding and milestone ceremonies. Made to order with 50% advance confirmation deposit.',
    sku: 'DOLYN-GP-06',
    inStock: false,
    isPreOrder: true,
    stockCount: 0,
    isCustomizable: true,
    customizationOptions: ['Embossed Couple Initials', 'Silk Bow Tie', 'Choice of 3 Luxury Fragrances']
  },

  // ==========================================
  // 4. Household & Sanitary Items (6 Products)
  // ==========================================
  {
    id: 21,
    title: 'Antibacterial Liquid Hand Wash - Fresh Citrus (500ml)',
    category: 'Household & Sanitary',
    price: 'GH₵ 25.00',
    numericPrice: 25.0,
    originalPrice: 'GH₵ 30.00',
    rating: 4.8,
    reviewCount: 39,
    badges: ['Sanitary Essential'],
    image: 'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=600&auto=format&fit=crop&q=80',
    description: 'Hospital-grade antibacterial hand soap with tea tree and aloe vera. Effectively eliminates 99.9% of bacteria while maintaining natural skin hydration throughout frequent hand washing.',
    sku: 'DOLYN-HS-01',
    inStock: true,
    stockCount: 50,
    sizes: ['500ml Pump', '1L Refill', '5L Economy Gallon'],
    varieties: ['Lemon Fresh', 'Lavender Meadow', 'Aloe & Green Tea'],
    wholesaleBoxQuantity: 12,
    wholesaleBoxPrice: 'GH₵ 240.00'
  },
  {
    id: 22,
    title: 'Multipurpose Surface Cleaner & Disinfectant (1L)',
    category: 'Household & Sanitary',
    price: 'GH₵ 35.00',
    numericPrice: 35.0,
    originalPrice: null,
    rating: 4.7,
    reviewCount: 21,
    badges: ['Hospital Grade'],
    image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&auto=format&fit=crop&q=80',
    description: 'Potent germicidal surface spray suitable for kitchen countertops, bathroom tiles, corporate event tables, and office surfaces. Leaves a streak-free shine with zero harmful fumes.',
    sku: 'DOLYN-HS-02',
    inStock: true,
    stockCount: 40,
    sizes: ['1L Spray', '5L Bulk Gallon']
  },
  {
    id: 23,
    title: '70% Ethyl Alcohol Instant Hand Sanitizer Gel (500ml)',
    category: 'Household & Sanitary',
    price: 'GH₵ 28.00',
    numericPrice: 28.0,
    originalPrice: 'GH₵ 35.00',
    rating: 4.9,
    reviewCount: 46,
    badges: ['Fast Acting'],
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80',
    description: 'CDC and WHO compliant 70% alcohol hand sanitizer with glycerin and vitamin E. Dries rapidly without stickiness, protecting against germs during commutes, office work, and public events.',
    sku: 'DOLYN-HS-03',
    inStock: true,
    stockCount: 65,
    wholesaleBoxQuantity: 20,
    wholesaleBoxPrice: 'GH₵ 460.00'
  },
  {
    id: 24,
    title: 'Lavender Aromatherapy Floor Cleaner & Sanitizer (2L)',
    category: 'Household & Sanitary',
    price: 'GH₵ 42.00',
    numericPrice: 42.0,
    originalPrice: 'GH₵ 50.00',
    rating: 4.8,
    reviewCount: 18,
    badges: ['Fresh Scent'],
    image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&auto=format&fit=crop&q=80',
    description: 'High-foaming floor disinfectant infused with natural French lavender oil. Cleans terrazzo, tiles, marble, and wood floors while leaving homes smelling like a tranquil spa.',
    sku: 'DOLYN-HS-04',
    inStock: true,
    stockCount: 35,
    wholesaleBoxQuantity: 6,
    wholesaleBoxPrice: 'GH₵ 220.00'
  },
  {
    id: 25,
    title: 'Heavy-Duty Germicidal Bleach Disinfectant (1L)',
    category: 'Household & Sanitary',
    price: 'GH₵ 22.00',
    numericPrice: 22.0,
    originalPrice: null,
    rating: 4.7,
    reviewCount: 15,
    badges: ['Deep Clean'],
    image: 'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=600&auto=format&fit=crop&q=80',
    description: 'Concentrated sanitizing sodium hypochlorite solution for white laundry, bathroom tile mildew elimination, toilet disinfection, and drain sanitization.',
    sku: 'DOLYN-HS-05',
    inStock: true,
    stockCount: 45
  },
  {
    id: 26,
    title: 'Complete Sanitary Clean & Protect Family Bundle',
    category: 'Household & Sanitary',
    price: 'GH₵ 75.00',
    numericPrice: 75.0,
    originalPrice: 'GH₵ 98.00',
    rating: 4.9,
    reviewCount: 23,
    badges: ['Special Promo', 'Save GH₵ 23'],
    image: 'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=600&auto=format&fit=crop&q=80',
    description: 'Includes 500ml Antibacterial Hand Wash, 1L Multipurpose Surface Cleaner, and 500ml 70% Alcohol Hand Sanitizer. Keep your household and office germ-free.',
    sku: 'DOLYN-HS-06',
    inStock: true,
    stockCount: 16
  },

  // ==========================================
  // 5. Pharmacy & Drugs (8 Products)
  // ==========================================
  {
    id: 27,
    title: 'Paracetamol Extra Tablets 500mg/65mg (Pack of 20)',
    category: 'Pharmacy & Drugs',
    price: 'GH₵ 18.00',
    numericPrice: 18.0,
    originalPrice: 'GH₵ 22.00',
    rating: 4.9,
    reviewCount: 64,
    badges: ['Fast Relief', 'Pharmacy Approved'],
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    description: 'Fast-acting paracetamol reinforced with caffeine for rapid relief of severe headaches, body aches, toothaches, menstrual cramps, and fever symptoms. Safe for adults when taken according to dosage guidelines.',
    sku: 'DOLYN-RX-01',
    inStock: true,
    stockCount: 80,
    isDrugOrHealthcare: true,
    dosageOrUsage: 'Adults: Take 1 to 2 tablets every 4 to 6 hours as required. Do not exceed 8 tablets in 24 hours. Keep out of reach of children.',
    ingredients: 'Paracetamol BP 500mg, Caffeine Anhydrous BP 65mg.'
  },
  {
    id: 28,
    title: 'Vitamin C 1000mg + Zinc Effervescent Tablets (Tube of 20)',
    category: 'Pharmacy & Drugs',
    price: 'GH₵ 45.00',
    numericPrice: 45.0,
    originalPrice: 'GH₵ 55.00',
    rating: 5.0,
    reviewCount: 48,
    badges: ['Immunity Boost', 'Bestseller'],
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop&q=80',
    description: 'High-potency orange-flavored effervescent tablets formulated to support the immune system, boost collagen formation, and provide daily antioxidant defense against environmental stress.',
    sku: 'DOLYN-RX-02',
    inStock: true,
    stockCount: 50,
    isDrugOrHealthcare: true,
    dosageOrUsage: 'Dissolve 1 tablet daily in a glass of cold water (200ml) and drink immediately with breakfast.'
  },
  {
    id: 29,
    title: 'Multi-Symptom Herbal Cough & Cold Expectorant Syrup (100ml)',
    category: 'Pharmacy & Drugs',
    price: 'GH₵ 30.00',
    numericPrice: 30.0,
    originalPrice: 'GH₵ 38.00',
    rating: 4.7,
    reviewCount: 29,
    badges: ['Herbal Relief'],
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop&q=80',
    description: 'Soothing syrup containing ivy leaf extract, thyme, honey, and menthol. Clears bronchial mucus, eases chest congestion, and calms irritated throats day and night.',
    sku: 'DOLYN-RX-03',
    inStock: true,
    stockCount: 35,
    isDrugOrHealthcare: true,
    dosageOrUsage: 'Adults: 10ml three times daily after meals. Children 6-12 years: 5ml twice daily.'
  },
  {
    id: 30,
    title: 'Complete First Aid Emergency Medical Kit',
    category: 'Pharmacy & Drugs',
    price: 'GH₵ 95.00',
    numericPrice: 95.0,
    originalPrice: 'GH₵ 120.00',
    rating: 4.9,
    reviewCount: 31,
    badges: ['Essential', 'Home & Vehicle'],
    image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&auto=format&fit=crop&q=80',
    description: 'Heavy-duty zip kit packed with sterile gauze pads, adhesive bandages, antiseptic iodine solution, surgical tape, burn dressing, triangular bandage, safety scissors, and medical gloves.',
    sku: 'DOLYN-RX-04',
    inStock: true,
    stockCount: 20,
    isDrugOrHealthcare: true
  },
  {
    id: 31,
    title: 'Rapid Antacid Chewable Tablets for Heartburn (Pack of 24)',
    category: 'Pharmacy & Drugs',
    price: 'GH₵ 22.00',
    numericPrice: 22.0,
    originalPrice: null,
    rating: 4.8,
    reviewCount: 19,
    badges: ['Digestive Care'],
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&auto=format&fit=crop&q=80',
    description: 'Fast neutralization of excess stomach acid, acid indigestion, sour stomach, and heartburn. Mint flavored chewable tablets for on-the-go digestive comfort.',
    sku: 'DOLYN-RX-05',
    inStock: true,
    stockCount: 42,
    isDrugOrHealthcare: true,
    dosageOrUsage: 'Chew 1 to 2 tablets thoroughly when symptoms occur, or as directed by a healthcare professional.'
  },
  {
    id: 32,
    title: 'Cetirizine 10mg Non-Drowsy Anti-Allergy Tablets (Pack of 10)',
    category: 'Pharmacy & Drugs',
    price: 'GH₵ 20.00',
    numericPrice: 20.0,
    originalPrice: 'GH₵ 26.00',
    rating: 4.8,
    reviewCount: 25,
    badges: ['Allergy Relief'],
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    description: '24-hour relief from seasonal allergic rhinitis, sneezing, runny nose, itchy watery eyes, and hives. Non-drowsy modern antihistamine formulation.',
    sku: 'DOLYN-RX-06',
    inStock: true,
    stockCount: 38,
    isDrugOrHealthcare: true,
    dosageOrUsage: 'Adults and children aged 12 years and above: 1 tablet (10mg) once daily with water.'
  },
  {
    id: 33,
    title: 'Ibuprofen 400mg Anti-Inflammatory Pain Reliever (Pack of 20)',
    category: 'Pharmacy & Drugs',
    price: 'GH₵ 24.00',
    numericPrice: 24.0,
    originalPrice: 'GH₵ 30.00',
    rating: 4.8,
    reviewCount: 34,
    badges: ['Pain & Swelling', 'Anti-Inflammatory'],
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    description: 'Powerful targeted relief from muscular sprains, arthritis flare-ups, back pain, dental pain, and post-exercise soreness.',
    sku: 'DOLYN-RX-07',
    inStock: true,
    stockCount: 45,
    isDrugOrHealthcare: true,
    dosageOrUsage: 'Take 1 tablet every 6 to 8 hours with or after food. Drink with a full glass of water.'
  },
  {
    id: 34,
    title: 'Daily Multivitamin & Mineral Complex with Korean Ginseng (30 Capsules)',
    category: 'Pharmacy & Drugs',
    price: 'GH₵ 55.00',
    numericPrice: 55.0,
    originalPrice: 'GH₵ 68.00',
    rating: 4.9,
    reviewCount: 41,
    badges: ['Vitality & Energy'],
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
    description: 'Complete nutritional formula combining Vitamins A, B-Complex, D3, E, Iron, Magnesium, and Panax Ginseng to counter physical fatigue and boost brain focus.',
    sku: 'DOLYN-RX-08',
    inStock: true,
    stockCount: 50,
    isDrugOrHealthcare: true,
    dosageOrUsage: 'Take 1 capsule daily after breakfast with water.'
  },

  // ==========================================
  // 6. Flash Deals & Special Promos (4 Products)
  // ==========================================
  {
    id: 35,
    title: 'Shea Butter & Vanilla Oud Duo Glow Bundle',
    category: 'Flash Deals & Specials',
    price: 'GH₵ 85.00',
    numericPrice: 85.0,
    originalPrice: 'GH₵ 110.00',
    rating: 5.0,
    reviewCount: 37,
    badges: ['Flash Deal -23%', 'Limited Stock'],
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    description: 'Special bundle pairing our best-selling Whipped Shea Butter (250g) and Vanilla Oud Luxury Body Splash (250ml) in a custom decorative pouch. Save GH₵ 25 today!',
    sku: 'DOLYN-FL-01',
    inStock: true,
    stockCount: 14,
    sizes: ['Bundle Pack']
  },
  {
    id: 36,
    title: 'Total Home Sanitation Value Pack (3 in 1)',
    category: 'Flash Deals & Specials',
    price: 'GH₵ 68.00',
    numericPrice: 68.0,
    originalPrice: 'GH₵ 90.00',
    rating: 4.9,
    reviewCount: 19,
    badges: ['Save GH₵ 22', 'Clean Home'],
    image: 'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=600&auto=format&fit=crop&q=80',
    description: 'Includes 500ml Antibacterial Hand Wash, 1L Multipurpose Cleaner, and 1L Disinfectant Bleach. Complete defense for your home or office.',
    sku: 'DOLYN-FL-02',
    inStock: true,
    stockCount: 22
  },
  {
    id: 37,
    title: 'Bridal Party Mini Shea Souvenir Pack (Box of 5)',
    category: 'Flash Deals & Specials',
    price: 'GH₵ 140.00',
    numericPrice: 140.0,
    originalPrice: 'GH₵ 175.00',
    rating: 5.0,
    reviewCount: 15,
    badges: ['Event Pack', 'Save 20%'],
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80',
    description: 'Five beautifully packaged mini whipped shea butter jars (80g each) tied with signature royal purple satin ribbons. Perfect for bridal guests and VIP attendees.',
    sku: 'DOLYN-FL-03',
    inStock: true,
    stockCount: 18,
    isCustomizable: true
  },
  {
    id: 38,
    title: 'Daily Immune Shield Pack (Vitamin C + Zinc + Paracetamol)',
    category: 'Flash Deals & Specials',
    price: 'GH₵ 55.00',
    numericPrice: 55.0,
    originalPrice: 'GH₵ 72.00',
    rating: 4.9,
    reviewCount: 33,
    badges: ['Health Bundle', 'Save GH₵ 17'],
    image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&auto=format&fit=crop&q=80',
    description: 'Essential wellness combo: 1 tube of Vitamin C 1000mg + Zinc effervescent and 1 pack of Paracetamol Extra for instant fever & fatigue relief.',
    sku: 'DOLYN-FL-04',
    inStock: true,
    stockCount: 25,
    isDrugOrHealthcare: true
  }
];

export const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: 'Pure Shea Butter & Handcrafted Cosmetics',
    subtitle: 'Nourish Your Natural Glow',
    description: 'Ghana’s finest Grade-A unrefined shea butter, whipped body creams, black soap, and botanical oils packaged with unmatched elegance.',
    buttonText: 'Shop Cosmetics',
    buttonLink: '/shop',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1400&auto=format&fit=crop&q=85',
    tag: 'Handmade in Ghana'
  },
  {
    id: 2,
    title: 'Custom Gift Packaging & Event Hampers',
    subtitle: 'Unforgettable First Impressions',
    description: 'Elevate your corporate events, weddings, and personal milestones with tailor-made gift boxes and personalized keepsake offerings.',
    buttonText: 'Explore Gift Hampers',
    buttonLink: '/shop',
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=1400&auto=format&fit=crop&q=85',
    tag: 'Corporate & Events'
  },
  {
    id: 3,
    title: 'Licensed Pharmacy & Essential Healthcare',
    subtitle: 'Convenient Home Delivery',
    description: 'Fast-acting pain relief, immune multivitamins, first aid, and household sanitary items delivered directly across Accra and nationwide.',
    buttonText: 'Shop Pharmacy',
    buttonLink: '/shop',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1400&auto=format&fit=crop&q=85',
    tag: 'Pharmacy & Health'
  }
];

export const c4Banners: PromoBanner[] = [
  {
    id: 1,
    subtitle: 'FRAGRANCE COLLECTION',
    title: 'Vanilla Oud & Amber Rose Splashes',
    description: 'Long-lasting luxury scents formulated for Ghana’s tropical climate.',
    buttonText: 'Discover Scents',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80',
    price: 'From GH₵ 45'
  },
  {
    id: 2,
    subtitle: 'WHOLESALE & BULK',
    title: 'Box Cartons at Factory Direct Multipliers',
    description: 'Save 15% to 25% when purchasing 12+ or 24+ units in a box.',
    buttonText: 'Order Bulk',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    price: 'Bulk Pricing'
  }
];

export const c6Banner: PromoBanner = {
  id: 6,
  subtitle: 'SPECIAL EVENT PACKAGING',
  title: 'Corporate Hampers & Wedding Souvenirs Tailored to Your Brand',
  description: 'Collaborate with Gwendolyn and our packaging design team for bespoke gift boxes with custom ribbons, stationery, and curated local products.',
  buttonText: 'Request Custom Package',
  image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1200&auto=format&fit=crop&q=85',
  price: 'Custom Quotes'
};

export const c8Banners: PromoBanner[] = [
  {
    id: 7,
    subtitle: 'DAILY ESSENTIALS',
    title: 'Immune Boosters & Vitamin C',
    buttonText: 'Shop Health',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500&auto=format&fit=crop&q=80',
    tag: 'Pharmacy'
  },
  {
    id: 8,
    subtitle: 'PURE RAW INGREDIENTS',
    title: 'Northern Ghana Grade-A Shea',
    buttonText: 'View Shea',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&auto=format&fit=crop&q=80',
    tag: '100% Organic'
  },
  {
    id: 9,
    subtitle: 'CLEAN & SANITIZE',
    title: 'Hospital-Grade Home Cleaners',
    buttonText: 'Shop Sanitary',
    image: 'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=500&auto=format&fit=crop&q=80',
    tag: 'Household'
  }
];

export const brands: Brand[] = [
  { id: 1, name: 'Packed by Dolyn Signature', logo: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&auto=format&fit=crop&q=80' },
  { id: 2, name: 'Ghana Shea Co-op', logo: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&auto=format&fit=crop&q=80' },
  { id: 3, name: 'Paystack Verified', logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&auto=format&fit=crop&q=80' },
  { id: 4, name: 'MTN Mobile Money', logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&auto=format&fit=crop&q=80' },
  { id: 5, name: 'Telecel Cash', logo: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=100&auto=format&fit=crop&q=80' },
  { id: 6, name: 'FDA Ghana Compliant', logo: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&auto=format&fit=crop&q=80' }
];

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'The Miraculous Benefits of Raw Ghanaian Shea Butter for Tropical Skin',
    category: 'Skincare Wisdom',
    author: 'Gwendolyn B. Boahen',
    date: 'Nov 02, 2026',
    comments: '8 Comments',
    snippet: 'Discover why raw unrefined ivory shea butter from Northern Ghana remains the gold standard for restoring damaged skin barriers, soothing eczema, and locking in deep hydration.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    readTime: '4 min read',
    content: `Shea butter has been revered across West Africa for centuries as "women's gold." Extracted by traditional crushing and boiling of the shea tree nuts (Vitellaria paradoxa), unrefined shea butter retains exceptional concentrations of stearic and oleic fatty acids along with natural vitamins A, E, and F.\n\nIn Ghana’s warm climate, high humidity and direct sun can strip natural moisture. Whipped shea butter melts at body temperature, creating a breathable lipid shield that restores elasticity without clogging pores. When combined with natural lavender or almond oil, it transforms into an everyday luxury for both face, body, and natural haircare.`
  },
  {
    id: 2,
    title: 'How to Choose the Perfect Corporate Gift Hamper for Ghanaian Businesses',
    category: 'Gifting & Events',
    author: 'Packed by Dolyn Team',
    date: 'Oct 28, 2026',
    comments: '5 Comments',
    snippet: 'Corporate gifting isn’t just a formality—it is a statement of appreciation. Learn how to tailor customized gift boxes that leave a lasting impact on partners and VIP clients.',
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&auto=format&fit=crop&q=80',
    readTime: '5 min read',
    content: `When corporate entities in Accra, Kumasi, or Takoradi show appreciation to their executives, boards, and strategic clients, standard off-the-shelf gift bags often fail to resonate. A memorable corporate hamper requires three distinct elements:\n\n1. Sensory appeal: Elegant textured boxes, royal purple satin ribbons, and bespoke stationery.\n2. Utility and luxury: Blending handcrafted wellness products like whipped shea butter and fine fragrances with high-end insulated mugs or stationery.\n3. Brand harmony: Customized branding elements that honor both the giver and the recipient.`
  },
  {
    id: 3,
    title: 'Essential Home First Aid & Hygiene: Keeping Your Household Protected',
    category: 'Health & Pharmacy',
    author: 'Health Advisory Team',
    date: 'Oct 20, 2026',
    comments: '12 Comments',
    snippet: 'From fast pain relief and fever management to hospital-grade antiseptics, here is the complete checklist every Ghanaian household should maintain in their medicine cabinet.',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    readTime: '6 min read',
    content: `Unexpected health occurrences—whether a sudden fever, culinary burn, or seasonal cold—can occur at any time. Maintaining an organized home medical and sanitary kit ensures peace of mind.\n\nKey essentials include fast-acting paracetamol for pain and fever, effervescent Vitamin C and zinc for early immune defense, antiseptic iodine solution, adhesive bandages, and non-drowsy antihistamines. Pairing these with hospital-grade antibacterial hand soap safeguards your entire family.`
  },
  {
    id: 4,
    title: 'Layering Fragrances: How to Make Your Body Splash Last All Day in Ghana',
    category: 'Fragrance Tips',
    author: 'Dolyn Beauty Lab',
    date: 'Oct 15, 2026',
    comments: '4 Comments',
    snippet: 'Struggling with perfumes evaporating too quickly in the heat? Master the art of scent anchoring using shea oil as a moisture primer for your favorite fragrances.',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80',
    readTime: '3 min read',
    content: `Fragrance molecules evaporate significantly faster when applied to dry skin, especially in warm climates. The secret to extending the longevity of your body splash from 3 hours to 12+ hours is "scent anchoring."\n\nApply a light layer of unscented or vanilla whipped shea butter onto your pulse points immediately after showering while skin is damp. Spray your Vanilla Oud or Amber Rose mist on top. The rich lipid layer binds to the perfume oils, slowing dissipation and creating an alluring scent aura all day.`
  }
];

export const infoboxes: InfoBox[] = [
  {
    id: 1,
    title: 'Nationwide Delivery in Ghana',
    description: 'Same-day in Accra, express courier to Kumasi & all 16 regions',
    icon: 'package'
  },
  {
    id: 2,
    title: 'Mobile Money & Card Payments',
    description: 'Instant MTN MoMo, Telecel Cash, AT Money & Paystack card checkout',
    icon: 'hand-coins'
  },
  {
    id: 3,
    title: '100% Quality & Authenticity',
    description: 'Pure Grade-A unrefined shea butter, verified cosmetics & approved drugs',
    icon: 'shield'
  },
  {
    id: 4,
    title: 'Custom Gift & Event Gifting',
    description: 'Personalized packaging, corporate hampers & event souvenir options',
    icon: 'calendar'
  }
];

// Seed initial orders for Gwendolyn's Admin Dashboard
export const initialOrders: Order[] = [
  {
    id: 'DOLYN-GH-8291',
    createdAt: '2026-11-05 09:15',
    customerName: 'Kofi Mensah',
    customerPhone: '0244589210',
    customerEmail: 'kofi.mensah@gmail.com',
    deliveryRegion: 'Greater Accra',
    deliveryAddress: 'House 14, Boundary Road, East Legon, Accra',
    deliveryType: 'Same-day',
    preferredDeliveryDate: '2026-11-05',
    preferredDeliveryTime: 'Afternoon (1pm - 5pm)',
    deliveryFee: 35,
    paymentMethod: 'MTN MoMo',
    momoNumber: '0244589210',
    paymentStatus: 'Paid',
    items: [
      {
        product: products[0],
        quantity: 2,
        selectedSize: '250g (Standard)',
        selectedVariety: 'Lavender Dream'
      },
      {
        product: products[8],
        quantity: 1,
        selectedSize: '250ml Full Spray'
      }
    ],
    subtotal: 155.0,
    discount: 15.5,
    total: 174.5,
    status: 'In Packing',
    customNotes: 'Please include royal purple ribbon for gift delivery',
    trackingNumber: 'TRK-ACC-8291'
  },
  {
    id: 'DOLYN-GH-8292',
    createdAt: '2026-11-05 10:40',
    customerName: 'Akosua Asantewaa',
    customerPhone: '0553198421',
    customerEmail: 'akosua.asante@standardbank.com.gh',
    deliveryRegion: 'Greater Accra',
    deliveryAddress: 'Stanbic Heights, Airport City, Accra',
    deliveryType: 'Scheduled',
    preferredDeliveryDate: '2026-11-06',
    preferredDeliveryTime: 'Morning (9am - 12pm)',
    deliveryFee: 25,
    paymentMethod: 'Card (Paystack)',
    paymentStatus: 'Paid',
    items: [
      {
        product: products[14], // Executive Corporate Luxury Hamper
        quantity: 3,
        customizationNote: 'With Stanbic corporate logo cards & royal purple ribbons',
        isWholesaleBox: true
      }
    ],
    subtotal: 1050.0,
    discount: 105.0,
    total: 970.0,
    status: 'Confirmed',
    customNotes: 'Corporate Executive gifts for board members. Call recipient before delivery.',
    trackingNumber: 'TRK-ACC-8292'
  },
  {
    id: 'DOLYN-GH-8293',
    createdAt: '2026-11-04 16:20',
    customerName: 'Dr. Emmanuel Osei',
    customerPhone: '0208119432',
    customerEmail: 'osei.emmanuel@ug.edu.gh',
    deliveryRegion: 'Kumasi (Ashanti)',
    deliveryAddress: 'Plot 12, Block C, Adum, Kumasi',
    deliveryType: 'Express',
    preferredDeliveryDate: '2026-11-06',
    preferredDeliveryTime: 'Standard Dispatch',
    deliveryFee: 45,
    paymentMethod: 'Telecel Cash',
    momoNumber: '0208119432',
    paymentStatus: 'Paid',
    items: [
      {
        product: products[26], // Paracetamol Extra
        quantity: 4
      },
      {
        product: products[27], // Vitamin C 1000mg + Zinc
        quantity: 3
      },
      {
        product: products[20], // Antibacterial Hand Wash
        quantity: 2,
        selectedSize: '500ml Pump'
      }
    ],
    subtotal: 257.0,
    discount: 0,
    total: 302.0,
    status: 'Out for Delivery',
    customNotes: 'Dispatch via VIP Express courier parcel service to Kumasi Adum terminal.',
    trackingNumber: 'TRK-KMS-8293'
  }
];

export const deliveryRates = [
  { id: 'accra-same-day', region: 'Greater Accra (Same-day Express)', fee: 35, time: 'Within 3 - 6 hours today' },
  { id: 'accra-standard', region: 'Greater Accra (Standard Next-Day)', fee: 25, time: 'Next business day' },
  { id: 'kumasi', region: 'Kumasi & Ashanti Region', fee: 45, time: '24 - 48 hours via VIP Courier' },
  { id: 'central-western', region: 'Central & Western (Cape Coast / Takoradi)', fee: 50, time: '24 - 48 hours' },
  { id: 'eastern-volta', region: 'Eastern & Volta (Koforidua / Ho)', fee: 45, time: '24 - 48 hours' },
  { id: 'northern', region: 'Northern Regions (Tamale, Sunyani, Wa, Bolga)', fee: 60, time: '2 - 3 business days' },
  { id: 'pickup', region: 'Customer Pickup (Packed by Dolyn Hub, Accra)', fee: 0, time: 'Available immediately upon notice' }
];

export const dolynFAQs = [
  {
    q: 'How do I pay using Mobile Money (MTN MoMo, Telecel Cash, AT Money)?',
    a: 'During guest checkout, select your preferred Mobile Money provider (MTN, Telecel, or AT Money) and enter your MoMo phone number. Upon clicking "Complete Order", you will receive an instant prompt on your phone to approve the transaction with your 4-digit PIN. Once authorized, your electronic receipt is immediately generated!'
  },
  {
    q: 'Can I purchase items in bulk or wholesale quantities?',
    a: 'Yes! Most of our cosmetics, pure shea butter, fragrances, and sanitary items have wholesale carton options ("price multiplied by the quantity in a box" with built-in volume discounts of 15% to 25%). Select the wholesale box option on the product page or contact Gwendolyn via WhatsApp on 0244149464 for container quantities.'
  },
  {
    q: 'How does custom gift packaging and event hamper personalization work?',
    a: 'When ordering any gift packaging, bridal souvenir, or corporate hamper, you can choose ribbon colors (our signature royal purple, champagne gold, or burgundy), enter custom calligraphy greeting notes, and specify recipient details. For weddings and corporate events, we collaborate closely on theme colors and bulk discounts.'
  },
  {
    q: 'What is your delivery coverage and timelines across Ghana?',
    a: 'We deliver nationwide across Ghana! For Greater Accra, we offer both same-day express delivery (3–6 hours) and standard next-day dispatch. For Kumasi, Takoradi, Cape Coast, Tamale, and other regions, parcels are safely sent through tracked courier dispatches. Free customer pickup is also available at our Accra hub.'
  },
  {
    q: 'What is your policy on returns and order cancellations?',
    a: 'As specified in our customer agreement, we do not accept returns, cancellations, or cash refunds once an order has been dispatched. This is due to strict public health and hygiene safety standards governing cosmetics, toiletries, and pharmaceutical drugs, as well as customized gift packaging. In the unlikely event of physical transit damage, please notify us within 24 hours with photos for a prompt replacement.'
  },
  {
    q: 'Can I pre-order products that are temporarily out of stock?',
    a: 'Yes! Items marked with "Pre-Order" can be ordered with payment in advance. Once confirmed, our production and packaging team prepares your fresh batch with priority delivery.'
  }
];
