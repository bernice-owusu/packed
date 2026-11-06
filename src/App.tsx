import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import { Topbar } from './components/Navbar/Topbar';
import { Header } from './components/Navbar/Header';
import { Navigation } from './components/Navbar/Navigation';
import { MobileMenu } from './components/Navbar/MobileMenu';
import { MobileBottomBar } from './components/Navbar/MobileBottomBar';
import { HeroSlider } from './components/Hero/HeroSlider';
import { TopCategories } from './components/Categories/TopCategories';
import { FeaturedProducts } from './components/Products/FeaturedProducts';
import { DualBanners } from './components/Banners/DualBanners';
import { TopPicks } from './components/Products/TopPicks';
import { WideBanner } from './components/Banners/WideBanner';
import { BestDealsCountdown } from './components/Deals/BestDealsCountdown';
import { TripleBanners } from './components/Banners/TripleBanners';
import { MultiColumnShowcase } from './components/Products/MultiColumnShowcase';
import { BrandCarousel } from './components/Brands/BrandCarousel';
import { BlogSection } from './components/Blog/BlogSection';
import { InfoBoxes } from './components/Features/InfoBoxes';
import { Footer } from './components/Footer/Footer';
import { ShopPage } from './components/Pages/ShopPage';
import { BlogPage } from './components/Pages/BlogPage';
import { AboutPage } from './components/Pages/AboutPage';
import { ContactPage } from './components/Pages/ContactPage';
import { AdminPage } from './components/Pages/AdminPage';
import { QuickViewModal } from './components/Modals/QuickViewModal';
import { CartDrawer } from './components/Modals/CartDrawer';
import { OrderTrackingModal } from './components/Modals/OrderTrackingModal';
import { ArticleReaderModal } from './components/Modals/ArticleReaderModal';
import { ElectronicReceiptModal } from './components/Modals/ElectronicReceiptModal';
import { PolicyModal } from './components/Modals/PolicyModal';
import { ToastContainer } from './components/Notifications/ToastContainer';
import { MessageCircle } from 'lucide-react';

export default function App() {
  const getLayoutFromPath = (): string => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      if (path === '/admin') return 'admin';
      if (path === '/shop') return 'shop';
      if (path === '/blog') return 'blog';
      if (path === '/about') return 'about';
      if (path === '/contact') return 'contact';
    }
    return 'home2';
  };

  const [activeLayout, setActiveLayout] = useState<string>(getLayoutFromPath);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      setActiveLayout(getLayoutFromPath());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (page: string) => {
    setActiveLayout(page);
    const targetPath = page === 'home2' ? '/' : `/${page}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dedicated /admin portal route - hidden from client storefront
  if (activeLayout === 'admin') {
    return (
      <AppProvider>
        <div className="min-h-screen bg-[#FAF7FB] text-[#1D395F] selection:bg-[#581C87] selection:text-white font-['Rubik',sans-serif]">
          <AdminPage onExit={() => navigateTo('home2')} />
          <ToastContainer />
        </div>
      </AppProvider>
    );
  }

  return (
    <AppProvider>
      <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-white text-[#1D395F] selection:bg-[#581C87] selection:text-white font-['Rubik',sans-serif]">
        {/* Client Navigation Layers (No Admin link visible) */}
        <Topbar />
        <Header
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
          onLogoClick={() => navigateTo('home2')}
        />
        <Navigation activeLayout={activeLayout} setActiveLayout={setActiveLayout} />

        {/* Main Content Area */}
        <main className="flex-1 pb-20 md:pb-0 w-full overflow-x-hidden">
          {activeLayout === 'shop' ? (
            <ShopPage />
          ) : activeLayout === 'blog' ? (
            <BlogPage />
          ) : activeLayout === 'about' ? (
            <AboutPage />
          ) : activeLayout === 'contact' ? (
            <ContactPage />
          ) : (
            /* Home Store Experience */
            <>
              {/* Section 1: Hero Carousel */}
              <HeroSlider onNavigateShop={() => navigateTo('shop')} />

              {/* Section 2: Top Categories Showcase */}
              <TopCategories />

              {/* Section 3: Featured Products with Left Promo Banner */}
              <FeaturedProducts onNavigateShop={() => navigateTo('shop')} />

              {/* Section 4: Dual Promotional Banners */}
              <DualBanners />

              {/* Section 5: Top Picks This Week */}
              <TopPicks onNavigateShop={() => navigateTo('shop')} />

              {/* Section 6: Wide Promotional Banner */}
              <WideBanner onNavigateContact={() => navigateTo('contact')} />

              {/* Section 7: Flash Deals & Weekly Countdown Specials */}
              <BestDealsCountdown />

              {/* Section 8: Triple Promotional Banners */}
              <TripleBanners />

              {/* Section 9: Multi-Column Showcase */}
              <MultiColumnShowcase onNavigateShop={() => navigateTo('shop')} />

              {/* Section 10: Payment & Partner Badges */}
              <BrandCarousel />

              {/* Section 11: Health, Beauty & Gifting Insights Journal */}
              <BlogSection onNavigateBlog={() => navigateTo('blog')} />

              {/* Section 12: Guarantees & Features */}
              <InfoBoxes />
            </>
          )}
        </main>

        {/* Main Footer */}
        <Footer onNavigatePage={navigateTo} />

        {/* Mobile & Tablet App Bottom Navigation Bar */}
        <MobileBottomBar
          activeLayout={activeLayout}
          setActiveLayout={setActiveLayout}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Floating WhatsApp Quick Concierge (Desktop & Tablet) */}
        <a
          href="https://wa.me/233244149464?text=Hello%20Packed%20by%20Dolyn,%20I%20have%20an%20inquiry%20regarding%20products/orders"
          target="_blank"
          rel="noreferrer"
          className="hidden md:flex fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl items-center justify-center transition-all duration-300 hover:scale-110 group border-2 border-white/80"
          title="Chat with Gwendolyn on WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold pl-0 group-hover:pl-2">
            WhatsApp 0244149464
          </span>
        </a>

        {/* Modals & Slide-out Drawers */}
        <QuickViewModal />
        <CartDrawer />
        <OrderTrackingModal />
        <ArticleReaderModal />
        <ElectronicReceiptModal />
        <PolicyModal />
        <MobileMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          activeLayout={activeLayout}
          setActiveLayout={setActiveLayout}
        />
        <ToastContainer />
      </div>
    </AppProvider>
  );
}
