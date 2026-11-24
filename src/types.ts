export interface Product {
  id: number;
  title: string;
  category: string;
  price: string;
  numericPrice?: number;
  originalPrice: string | null;
  rating: number;
  reviewCount: number;
  badges: string[];
  image: string;
  description?: string;
  sku?: string;
  inStock?: boolean;
  isPreOrder?: boolean;
  stockCount?: number;
  sizes?: string[];
  varieties?: string[];
  wholesaleBoxQuantity?: number;
  wholesaleBoxPrice?: string;
  isCustomizable?: boolean;
  customizationOptions?: string[];
  isDrugOrHealthcare?: boolean;
  dosageOrUsage?: string;
  ingredients?: string;
  isFlashSale?: boolean;
  flashSaleStartDate?: string;
  flashSaleStartTime?: string;
  flashSaleEndDate?: string;
  flashSaleEndTime?: string;
}

export interface Category {
  id: string;
  title: string;
  count: string;
  icon: string;
  description?: string;
}

export interface MediaItem {
  id: string;
  url: string;
  title: string;
  category: string;
  uploadedAt: string;
  isCustom?: boolean;
  size?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  minSpend?: number;
  isActive: boolean;
  description?: string;
  usageCount: number;
}

export interface HeroSlide {
  id: number;
  title: string;
  subtitle?: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  tag?: string;
}

export interface PromoBanner {
  id: number;
  subtitle: string;
  title: string;
  description?: string;
  buttonText: string;
  image: string;
  price?: string;
  tag?: string;
}

export interface Brand {
  id: number;
  name: string;
  logo: string;
}

export interface BlogPost {
  id: number;
  title: string;
  category: string;
  author: string;
  date: string;
  comments: string;
  snippet: string;
  image: string;
  content?: string;
  readTime?: string;
}

export interface InfoBox {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedVariety?: string;
  customizationNote?: string;
  isWholesaleBox?: boolean;
}

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryRegion: string;
  deliveryAddress: string;
  deliveryType: 'Same-day' | 'Express' | 'Scheduled' | 'Customer Pickup';
  preferredDeliveryDate: string;
  preferredDeliveryTime: string;
  deliveryFee: number;
  paymentMethod: 'MTN MoMo' | 'Telecel Cash' | 'AT Money' | 'Card (Paystack)' | 'Paystack (Card/MoMo)' | string;
  paymentRef?: string;
  momoNumber?: string;
  paymentStatus: 'Paid' | 'Pre-order Confirmed' | 'Pending';
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: 'New' | 'Confirmed' | 'In Packing' | 'Out for Delivery' | 'Delivered';
  customNotes?: string;
  trackingNumber: string;
}

export interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedTime: string;
}

export interface AboutStat {
  value: string;
  label: string;
}

export interface AboutPillar {
  title: string;
  description: string;
}

export interface AboutContent {
  badge: string;
  title: string;
  intro: string;
  stats: AboutStat[];
  pillars: AboutPillar[];
  founderLabel: string;
  founderName: string;
  founderInitials: string;
  founderQuote: string;
}

export interface ContactContent {
  phone: string;
  whatsapp: string;
  whatsappDisplay: string;
  email: string;
  primaryContactName: string;
  addressLine1: string;
  addressShort: string;
  addressNote: string;
  hours: string;
}

export interface SiteContent {
  heroSlides: HeroSlide[];
  c4Banners: PromoBanner[];
  c6Banner: PromoBanner;
  c8Banners: PromoBanner[];
  about: AboutContent;
  contact: ContactContent;
}
