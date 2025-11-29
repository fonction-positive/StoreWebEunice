import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import { Home, Heart, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

import "swiper/css";

interface MainLayoutProps {
  children: React.ReactNode[];
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Heart, label: "Favorites", path: "/favorites" },
    { icon: ShoppingCart, label: "Cart", path: "/cart" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  const handleTabClick = (index: number, path: string) => {
    setActiveIndex(index);
    swiperRef.current?.slideTo(index, 400);
    navigate(path, { replace: true });
  };

  const handleSlideChange = (swiper: SwiperType) => {
    const newIndex = swiper.activeIndex;
    setActiveIndex(newIndex);
    navigate(navItems[newIndex].path, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={handleSlideChange}
        spaceBetween={0}
        slidesPerView={1}
        allowTouchMove={true}
        speed={400}
        touchRatio={1.2}
        threshold={5}
        longSwipesRatio={0.3}
        followFinger={true}
        resistance={true}
        resistanceRatio={0.85}
        className="h-[calc(100vh-5rem)]"
      >
        {children.map((child, index) => (
          <SwiperSlide key={index}>{child}</SwiperSlide>
        ))}
      </Swiper>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-around">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeIndex === index;

              return (
                <button
                  key={item.path}
                  onClick={() => handleTabClick(index, item.path)}
                  className={cn(
                    "flex flex-row items-center gap-2 px-5 py-2.5 rounded-full transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
                  {isActive && (
                    <span className="text-xs font-semibold">{item.label}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default MainLayout;
