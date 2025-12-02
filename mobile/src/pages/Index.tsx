import { useState, useEffect } from "react";
import { Search, Bell, Heart, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import api from "@/lib/api";

interface ProductImage {
  id: number;
  image: string;
  is_main: boolean;
}

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  discount_percentage?: number;
  has_discount?: boolean;
  stock: number;
  is_hot_sale?: boolean;
  category?: number;
  rating?: number;
  reviews?: number;
  color?: string;
  size?: string;
  material?: string;
  weight?: string;
  length?: string;
  compatibility?: string;
  main_image?: ProductImage;
  images?: ProductImage[];
}

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isScrolled, setIsScrolled] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const categories = ["All", "Women", "Man", "Kid"];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const response = await api.get('auth/me/');
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      }
    };
    fetchUser();
  }, []);

  // Fetch products from backend API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await api.get('products/');
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch user's favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      try {
        const response = await api.get('favorites/');
        const favoriteIds = response.data.map((fav: any) => fav.product.id);
        setFavorites(favoriteIds);
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
      }
    };
    fetchFavorites();
  }, []);

  const toggleFavorite = async (productId: number, e: React.MouseEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem('access_token');
    if (!token) {
      // 未登录时仅更新本地状态
      setFavorites(prev =>
        prev.includes(productId)
          ? prev.filter(id => id !== productId)
          : [...prev, productId]
      );
      return;
    }

    try {
      const response = await api.post('favorites/toggle/', {
        product_id: productId
      });
      
      // 更新本地状态
      if (response.data.is_favorited) {
        setFavorites(prev => [...prev, productId]);
      } else {
        setFavorites(prev => prev.filter(id => id !== productId));
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto h-full overflow-y-auto">
      {/* Fixed Header and Search */}
      <div
        className={`sticky top-0 z-10 transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-background"
          }`}
      >
        <div className="px-4 pt-6 pb-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-2xl font-bold">F</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">FluffyLetter</h1>
                <p className="text-xs text-muted-foreground">
                  {user ? `欢迎回来，${user.username}` : "发现你的专属风格"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/notifications">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-muted">
                  <Bell className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/language-settings">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-muted">
                  <Globe className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="pl-11 h-10 rounded-full bg-muted border-0"
            />
          </div>
        </div>
      </div>

      <div className="px-4">

        {/* Shop Markets Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold">Shop Markets</h2>
          <Link to="/products">
            <Button variant="ghost" className="text-sm font-semibold">
              See All
            </Button>
          </Link>
        </div>

        {/* Categories */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "secondary"}
              className="rounded-full font-semibold whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-4 pb-4">
          {loading ? (
            <div className="col-span-2 text-center py-8 text-muted-foreground">
              加载中...
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-2 text-center py-8 text-muted-foreground">
              暂无商品
            </div>
          ) : (
            products.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`}>
                <div className="hover:scale-[1.02] transition-transform">
                  <div className="relative rounded-[2rem] overflow-hidden bg-muted/30 shadow-sm">
                    <img
                      src={product.main_image?.image || "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=400&fit=crop"}
                      alt={product.name}
                      className="w-full aspect-square object-cover"
                    />
                    {product.is_hot_sale && (
                      <div className="absolute top-3 left-3">
                        <Badge variant="default" className="bg-red-500 text-white rounded-full">Hot Sale</Badge>
                      </div>
                    )}
                    <button
                      className="absolute top-3 right-3 h-10 w-10 rounded-full bg-background flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                      onClick={(e) => toggleFavorite(product.id, e)}
                    >
                      <Heart
                        className={`h-5 w-5 transition-colors ${favorites.includes(product.id)
                            ? "fill-[rgb(255,107,107)] text-[rgb(255,107,107)]"
                            : "text-foreground"
                          }`}
                      />
                    </button>
                  </div>
                  <div className="pt-3 px-1">
                    <h3 className="font-bold text-base mb-1 tracking-tight">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {product.description || "暂无描述"}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-xl">¥{product.price}</p>
                      {product.original_price && product.original_price > product.price && (
                        <>
                          <p className="text-sm text-muted-foreground line-through">¥{product.original_price}</p>
                          {product.discount_percentage > 0 && (
                            <Badge variant="destructive" className="text-xs rounded-full">-{product.discount_percentage}%</Badge>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
