
import React, { useRef, useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import HeroSlider from '../components/HeroSlider';
import { Skeleton, Shimmer } from '../components/Skeleton';
import { useAppStore } from '../store';
import { Product } from '../types';
import { ShieldCheck, Truck, Sparkles, ArrowRight, CreditCard, Zap, Heart, Star, Layers, MousePointer2 } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import AmbientParticleCanvas from '../components/AmbientParticleCanvas';

const ParallaxImage: React.FC<{ src: string; alt: string; shapeClass: string; speed?: number }> = ({ src, alt, shapeClass, speed = 0.1 }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });
    
    const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        setLoaded(false);
        setError(false);
    }, [src]);

    const hasImage = !!src && typeof src === 'string' && src.trim() !== '';

    return (
        <div ref={ref} className={`relative overflow-hidden ${shapeClass}`}>
            {(!hasImage || error) ? (
                <div className="absolute inset-0 bg-[#f3f0ea]/70 backdrop-blur-md flex items-center justify-center">
                    <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-[#C38B7C]/10 filter blur-2xl animate-[pulse_6s_infinite_ease-in-out]" />
                    <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 rounded-full bg-[#1A1A1A]/5 filter blur-xl animate-[pulse_4s_infinite_ease-in-out_1s]" />
                </div>
            ) : (
                <>
                    {!loaded && (
                        <div className="absolute inset-0 bg-[#f3f0ea]/70 backdrop-blur-md flex items-center justify-center z-10">
                            <div className="w-full h-full bg-gradient-to-r from-stone-100 via-stone-200/50 to-stone-100 bg-[length:200%_100%] animate-pulse" />
                            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-[#C38B7C]/10 filter blur-2xl animate-[pulse_4s_infinite]" />
                        </div>
                    )}
                    <motion.img 
                        src={src} 
                        alt={alt}
                        onLoad={() => setLoaded(true)}
                        onError={() => setError(true)}
                        style={{ y, scale, willChange: 'transform', opacity: loaded ? 1 : 0 }}
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                    />
                    <div className="absolute inset-0 bg-brand-charcoal/10 transition-opacity duration-700 group-hover:opacity-40"></div>
                </>
            )}
        </div>
    );
};

const SectionHeader: React.FC<{ title: string; subtitle?: string; light?: boolean }> = ({ title, subtitle, light }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
    className="flex flex-col items-center text-center mb-16 md:mb-24 px-4"
  >
    <span className={`text-[9px] lg:text-[10px] font-display font-bold uppercase tracking-[0.4em] mb-4 ${light ? 'text-white/80' : 'text-brand-accent'}`}>
        {subtitle || 'Exceptional Quality'}
    </span>
    <h2 className={`text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-serif font-light leading-tight ${light ? 'text-white' : 'text-brand-charcoal'}`}>
        {title}
    </h2>
  </motion.div>
);

const FeatureBox: React.FC<{ icon: React.ElementType; title: string; desc: string; index: number }> = ({ icon: Icon, title, desc, index }) => (
    <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 1, ease: [0.19, 1, 0.22, 1] }}
        className="flex flex-col items-center text-center px-6 py-20 md:px-8 md:py-24 lg:py-32 xl:py-40 group transition-all duration-700 hover:bg-stone-50/50"
    >
        <div className="mb-8 relative">
            <div className="absolute inset-0 bg-brand-accent/5 scale-0 group-hover:scale-150 rounded-full transition-transform duration-1000"></div>
            <Icon size={30} strokeWidth={1} className="text-brand-charcoal group-hover:text-brand-accent transition-colors duration-700 relative z-10" />
        </div>
        <h4 className="text-[10px] lg:text-[12px] font-sans font-black text-brand-charcoal mb-4 uppercase tracking-[0.3em]">{title}</h4>
        <p className="text-brand-muted text-[10px] md:text-[11px] lg:text-[13px] leading-relaxed w-full max-w-[280px] font-medium uppercase tracking-wider opacity-80 group-hover:opacity-100 transition-opacity duration-700">{desc}</p>
    </motion.div>
);

const HomeSkeleton: React.FC = () => (
    <div className="flex flex-col w-full bg-white">
        {/* Hero Slider Skeleton */}
        <section className="relative w-full aspect-[21/9] md:h-[90vh] bg-stone-50 overflow-hidden">
            <Shimmer className="w-full h-full" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 sm:p-20">
                <Skeleton className="h-4 w-32 mb-8 opacity-40 px-20" />
                <Skeleton className="h-24 md:h-32 w-3/4 max-w-4xl mb-12" />
                <Skeleton className="h-16 w-64 rounded-full" />
            </div>
        </section>

        {/* Content Blocks Skeleton */}
        <section className="container-luxury py-24 sm:py-32">
            <div className="flex flex-col items-center mb-24">
                <Skeleton className="h-3 w-40 mb-6 opacity-40" />
                <Skeleton className="h-16 w-64" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                <Shimmer className="aspect-[16/10] w-full" />
                <div className="flex flex-col justify-center space-y-12 h-full">
                   <Shimmer className="aspect-square w-2/3 rounded-full" />
                   <div className="space-y-4">
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-10 w-48" />
                   </div>
                </div>
            </div>
        </section>

        {/* Trending Section Skeleton */}
        <section className="bg-brand-offwhite py-24 md:py-44">
            <div className="container-luxury">
                <div className="flex flex-col items-center mb-16 sm:mb-24 text-center">
                    <Skeleton className="h-3 w-40 mb-4 opacity-40 mr-1" />
                    <Skeleton className="h-12 w-64" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 sm:gap-20">
                    {[...Array(4)].map((_, i) => <ProductSkeleton key={i} />)}
                </div>
            </div>
        </section>
    </div>
);

const StorySection: React.FC = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });
    const storyY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

    return (
        <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-charcoal py-32">
            <motion.div 
                style={{ y: storyY, height: '120%', top: '-10%', willChange: 'transform' }}
                className="absolute inset-0 z-0"
            >
                <img src="https://images.unsplash.com/photo-1518764876364-2d0bc97401d4?q=80&w=2070" className="w-full h-full object-cover opacity-20 grayscale" alt="Brand Story" />
            </motion.div>

            {/* Elegant luxury textile ambient dust and fibers drifting upwards */}
            <AmbientParticleCanvas 
                moteCount={24}
                fiberCount={8}
                className="absolute inset-0 pointer-events-none z-[5]"
                speedMultiplier={0.4}
                particleColor="235, 218, 204"
                glowColor="250, 242, 235"
            />
            
            <div className="container-luxury relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2 }}
                >
                  <h2 className="text-5xl md:text-6xl lg:text-8xl xl:text-[110px] font-serif font-light text-white leading-[0.9] mb-16 italic">
                    Empowering the <br /> <span className="text-brand-accent">Modern Matriarch</span>
                  </h2>
                  <p className="text-[0.65rem] md:text-sm font-sans font-light text-white/80 mb-16 leading-loose max-w-2xl mx-auto uppercase tracking-[0.3em]">
                      SAZO is not just about fashion; it's about the soul of the woman wearing it. Every stitch is a story of strength, every fabric a memory of soft grace.
                  </p>
                  <button onClick={() => window.location.href='/about'} className="text-[9px] md:text-[10px] lg:text-[11px] font-display font-black text-white uppercase tracking-[0.4em] border-b border-white pb-2 md:pb-3 hover:text-brand-accent hover:border-brand-accent transition-all duration-700">
                      Our Narrative
                  </button>
                </motion.div>
            </div>
        </section>
    );
};

const HomePage: React.FC = () => {
  const { products, navigate, settings, loading } = useAppStore(state => ({
    products: state.products,
    navigate: state.navigate,
    settings: state.settings,
    loading: state.loading
  }));

  if (loading && products.length === 0) return <HomeSkeleton />;

  const { homepageNewArrivalsCount, homepageTrendingCount } = settings;

  const getSortedProducts = (items: Product[], key: 'newArrivalDisplayOrder' | 'trendingDisplayOrder') => {
      // Ensure items are unique by ID first
      const uniqueItemsMap = new Map<string, Product>();
      items.forEach(p => uniqueItemsMap.set(String(p.id), p));
      const uniqueItems = Array.from(uniqueItemsMap.values());

      const pinned = uniqueItems.filter(p => p[key] && p[key]! < 1000).sort((a, b) => (a[key] || 0) - (b[key] || 0));
      const others = uniqueItems.filter(p => !p[key] || p[key]! >= 1000).sort((a, b) => String(b.id || '').localeCompare(String(a.id || '')));
      return [...pinned, ...others];
  };

  const allNewArrivals = getSortedProducts(products.filter(p => p.isNewArrival), 'newArrivalDisplayOrder');
  const allTrendingProducts = getSortedProducts(products.filter(p => p.isTrending), 'trendingDisplayOrder');
  
  const newArrivalsDisplay = allNewArrivals.slice(0, homepageNewArrivalsCount || 4);
  const trendingProductsDisplay = allTrendingProducts.slice(0, homepageTrendingCount || 4);

  return (
    <div className="bg-white overflow-x-hidden">
      <HeroSlider />

      {/* --- CURATED COLLECTIONS (Editorial Style) --- */}
      {settings.signatureBanners && settings.signatureBanners.length > 0 && (
          <section className="py-24 md:py-44 container-luxury">
              <SectionHeader title="The Art of Elegance" subtitle="Collections" />
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-20 items-center">
                  {settings.signatureBanners.map((banner, index) => {
                      const getShapeClass = (shape?: string) => {
                          switch (shape) {
                              case 'rounded': return 'rounded-3xl';
                              case 'circle': return 'rounded-full';
                              case 'blob-1': return 'rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%]';
                              case 'blob-2': return 'rounded-[60%_40%_30%_70%_/_60%_30%_70%_40%]';
                              case 'blob-3': return 'rounded-[50%_50%_20%_80%_/_25%_80%_20%_75%]';
                              default: return 'rounded-[2px]';
                          }
                      };

                      const mobileMode = settings.signatureMobileDisplayMode || 'both';

                      if (index === 0) {
                          return (
                              <motion.div 
                                key={banner.id}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.2 }}
                                className={`md:col-span-7 group cursor-pointer ${mobileMode === 'banner2' ? 'hidden md:block' : ''}`}
                                onClick={() => navigate(banner.link || '/shop')}
                              >
                                    <ParallaxImage 
                                      src={banner.desktopImage || ''} 
                                      alt={banner.title || 'Collection'} 
                                      shapeClass={`aspect-[4/5] md:aspect-[16/10] ${getShapeClass(banner.shape)}`} 
                                    />
                                  <div className="mt-10 max-w-lg">
                                      <span className="text-[9px] lg:text-[10px] font-display font-bold uppercase tracking-[0.4em] mb-4 block text-brand-accent">{banner.header || ''}</span>
                                      <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 leading-tight">{banner.title || ''}</h3>
                                      <p className="text-brand-muted text-sm leading-loose mb-10 font-light">{banner.description || ''}</p>
                                      <button className="text-[10px] lg:text-[11px] font-display font-black uppercase tracking-[0.3em] border-b border-brand-charcoal pb-2 hover:text-brand-accent hover:border-brand-accent transition-all duration-500">{banner.buttonText || 'Discover'}</button>
                                  </div>
                              </motion.div>
                          );
                      }
                      if (index === 1) {
                          return (
                              <motion.div 
                                key={banner.id}
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.2, delay: 0.2 }}
                                className={`md:col-span-5 flex flex-col gap-24 ${mobileMode === 'banner1' ? 'hidden md:flex' : ''}`}
                              >
                                  <div className="group cursor-pointer" onClick={() => navigate(banner.link || '/shop')}>
                                        <div className="translate-x-0 lg:translate-x-12 mb-10">
                                            <ParallaxImage 
                                                src={banner.desktopImage || ''} 
                                                alt={banner.title || 'Collection'} 
                                                shapeClass={`aspect-[4/5] ${getShapeClass(banner.shape || 'circle')}`} 
                                            />
                                        </div>
                                      <div className="pl-0 lg:pl-12">
                                          <span className="text-[9px] lg:text-[10px] font-display font-bold uppercase tracking-[0.4em] mb-3 block text-brand-accent">{banner.header || ''}</span>
                                          <h3 className="text-3xl font-serif mb-4">{banner.title || ''}</h3>
                                          <button className="text-[9px] lg:text-[10px] font-display font-bold uppercase tracking-[0.2em] text-brand-muted/70 group-hover:text-brand-charcoal transition-all duration-500">{banner.buttonText || 'View'}</button>
                                      </div>
                                  </div>
                              </motion.div>
                          );
                      }
                      return null;
                  })}
              </div>
          </section>
      )}

      {/* --- TRENDING PRODUCTS GRID --- */}
      <section className="bg-brand-offwhite py-24 md:py-44">
        <div className="container-luxury">
            <SectionHeader title="The Edit" subtitle="Trending Selection" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-16 md:gap-x-10 md:gap-y-20">
                {loading ? (
                    [...Array(4)].map((_, i) => <ProductSkeleton key={i} />)
                ) : (
                    trendingProductsDisplay.map((p, i) => (
                        <ProductCard key={`${p.id}-${i}`} product={p} />
                    ))
                )}
            </div>
            <div className="mt-20 md:mt-32 flex justify-center">
                <button 
                  onClick={() => navigate('/shop')} 
                  className="luxury-button-outline"
                >
                    Showcase All Products
                </button>
            </div>
        </div>
      </section>

      {/* --- BRAND STORY / VISION --- */}
      <StorySection />

      {/* --- TRUST & CRAFTSMANSHIP --- */}
      <section className="py-12 md:py-24 bg-white border-t border-stone-100">
          <div className="container-luxury max-w-screen-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 lg:divide-x divide-stone-100">
                  <FeatureBox icon={ShieldCheck} title="AUTHENTIC QUALITY" desc="Curated premium fabrics & original beauty essentials." index={0} />
                  <FeatureBox icon={Truck} title="EXPRESS DELIVERY" desc="Swift delivery across Bangladesh, right to your doorstep." index={1} />
                  <FeatureBox icon={CreditCard} title="SECURE PAYMENT" desc="Safe and encrypted payment options for your peace of mind." index={2} />
                  <FeatureBox icon={Sparkles} title="EXCLUSIVE STYLES" desc="Limited edition designs for the modern elegance." index={3} />
              </div>
          </div>
      </section>
    </div>
  );
};

export default HomePage;
