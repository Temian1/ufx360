import React, { useEffect, useState } from 'react';
import { useTranslation } from '../contexts/TranslationContext';

interface HeroProps {
  onNavigate: (target: 'featured' | 'promos' | 'all-sports') => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const { t, formatCurrency } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    {
      id: 'hero-1',
      kicker: t('hero.offer.kicker'),
      title: t('hero.offer.title'),
      highlight: formatCurrency(30),
      tail: t('hero.offer.tail'),
      cta: t('hero.offer.cta'),
      target: 'promos' as const,
      bgImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAHSu6Z5Ovu2ZEopysTnRmQWjE5XrUhzUseyjoNp5FB9uN9o-yv3V4f_snv7tqyoOq52ooIyrKCus8AAm2FU7ANPSwWpjwSRNQunHkEvHqG0FAUG5nIbBysDQgNmkgWUOUvLiNMuLJsCkhRDa4wkVCij4G4kCxQgpQ5kcqcpPJ_e4ra8VYfxEFEmdAZJPaleGGWBf2_T5Tc3KdGc4GLxirI_vdpfoc2QxQYcysdarpCsADpcBSzm4RkZrCaPHLNvtJEkAuJ6_3Mwtk",
      playerImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCxiB1GCjAC6iiV9lKlwXrUM8wUo7Wp_fyA9wpakwbA42aPeeo4ugmcHx35sMLdmkfjymeBZlzpg8kz_561g3K9tx0LqB5ykxdD6PEV_72Erds2X_UHijj4k4q5C4NA-lillfa73thZCuRANgwADFaT8__y8NxsBjfmHkexIg8_pYuzN3ta5R5UsOAz23vwudgOnARnuyeAa4qb7tiIWIpbDL4bLv4bMhrI-rNv3Efxl8RCM_Y30FKah0ghk-w_55vV5tA5TyWZGrY",
    },
    {
      id: 'hero-2',
      kicker: t('hero.featured.kicker'),
      title: t('hero.featured.title'),
      highlight: t('hero.featured.highlight'),
      tail: t('hero.featured.tail'),
      cta: t('hero.featured.cta'),
      target: 'featured' as const,
      bgImage:
        "https://images.unsplash.com/photo-1517602302552-471fe67acf66?q=80&w=1400&auto=format&fit=crop",
      playerImage:
        "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1000&auto=format&fit=crop",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const activeSlide = slides[activeIndex];

  return (
    <div className="space-y-4">
      <button
        onClick={() => onNavigate(activeSlide.target)}
        className="relative rounded-2xl overflow-hidden h-52 sm:h-64 flex items-center shadow-2xl w-full text-left group transition-all duration-500 hover:scale-[1.01]"
      >
        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('${activeSlide.bgImage}')` }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

        <div className="relative z-10 p-6 sm:p-10 w-3/4 sm:w-1/2 flex flex-col justify-center h-full">
          <p className="text-xs sm:text-sm font-bold text-bet-yellow uppercase mb-2 tracking-widest animate-in slide-in-from-left-4 fade-in duration-500 delay-100 flex items-center gap-2">
            <span className="w-8 h-[2px] bg-bet-yellow inline-block"></span>
            {activeSlide.kicker}
          </p>
          <h1 className="text-3xl sm:text-5xl font-black text-white italic leading-none mb-4 animate-in slide-in-from-left-4 fade-in duration-500 delay-200 drop-shadow-lg">
            {activeSlide.title} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-bet-yellow to-yellow-200">{activeSlide.highlight}</span> <br/>
            {activeSlide.tail}
          </h1>
          <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 delay-300">
            <span className="inline-flex items-center gap-2 bg-bet-yellow text-gray-900 font-black px-8 py-3 rounded-full text-sm hover:bg-white hover:text-black transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,223,27,0.3)]">
                {activeSlide.cta}
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </span>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 h-full w-1/2 sm:w-1/2 pointer-events-none">
          <img
            alt="Sports promo"
            className="h-full w-full object-cover object-top mask-image-gradient animate-in slide-in-from-right-8 fade-in duration-700"
            src={activeSlide.playerImage}
            style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 20%, black)', maskImage: 'linear-gradient(to right, transparent, black 20%, black)' }}
          />
        </div>
      </button>

      <div className="flex justify-center gap-3">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => setActiveIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${activeIndex === index ? 'w-10 bg-bet-yellow shadow-[0_0_10px_rgba(255,223,27,0.5)]' : 'w-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
