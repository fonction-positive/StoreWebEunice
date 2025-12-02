import { useState, useEffect } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

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
  color?: string;
  size?: string;
  main_image?: ProductImage;
}

interface Favorite {
  id: number;
  product: number;
  product_detail: Product;
  created_at: string;
}

const Favorites = () => {
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status and fetch favorites
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);

    if (token) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const response = await api.get('favorites/');
      setFavorites(response.data);
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
      toast({
        title: "加载失败",
        description: "无法加载收藏列表",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Remove from favorites
  const removeFavorite = async (productId: number) => {
    try {
      await api.delete(`favorites/remove/${productId}/`);
      setFavorites(prev => prev.filter(fav => fav.product !== productId));
      toast({
        title: "已取消收藏",
        description: "已从收藏夹中移除",
      });
    } catch (err) {
      console.error('Failed to remove favorite:', err);
      toast({
        title: "操作失败",
        description: "无法移除收藏",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-6 h-full overflow-y-auto">
        <h1 className="text-3xl font-bold mb-8">Favorites</h1>
        <div className="flex justify-center items-center py-16">
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-6 h-full overflow-y-auto">
        <h1 className="text-3xl font-bold mb-8">Favorites</h1>
        <div className="flex flex-col items-center justify-center py-16 px-6">
          <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mb-6">
            <Heart className="h-16 w-16 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-center">请先登录</h2>
          <p className="text-muted-foreground text-center mb-8 max-w-sm">
            登录后可以查看您的收藏
          </p>
          <Link to="/login" className="w-full max-w-xs">
            <Button className="w-full h-14 rounded-full text-base font-bold">
              注册登录
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6 h-full overflow-y-auto">
      <h1 className="text-3xl font-bold mb-8">Favorites</h1>

      {favorites.length === 0 ? (
        /* Empty Favorites */
        <div className="flex flex-col items-center justify-center py-16 px-6">
          <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mb-6">
            <Heart className="h-16 w-16 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-center">暂无收藏</h2>
          <p className="text-muted-foreground text-center mb-8 max-w-sm">
            快去收藏您喜欢的商品吧
          </p>
          <Link to="/products" className="w-full max-w-xs">
            <Button className="w-full h-14 rounded-full text-base font-bold">
              <ShoppingBag className="h-5 w-5 mr-2" />
              开始购物
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {favorites.map((favorite) => (
            <Link key={favorite.id} to={`/product/${favorite.product_detail.id}`}>
              <Card className="rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform">
                <div className="relative">
                  <img
                    src={favorite.product_detail.main_image?.image || "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=400&fit=crop"}
                    alt={favorite.product_detail.name}
                    className="w-full aspect-square object-cover"
                  />
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-3 right-3 h-10 w-10 rounded-full bg-card/90 hover:bg-card"
                    onClick={(e) => {
                      e.preventDefault();
                      removeFavorite(favorite.product);
                    }}
                  >
                    <Heart className="h-5 w-5 fill-[rgb(255,107,107)] text-[rgb(255,107,107)]" />
                  </Button>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-sm mb-1 line-clamp-1">{favorite.product_detail.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {favorite.product_detail.description || (favorite.product_detail.color ? `Color - ${favorite.product_detail.color}` : "")}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-lg">¥{favorite.product_detail.price}</p>
                    {favorite.product_detail.original_price && favorite.product_detail.original_price > favorite.product_detail.price && (
                      <p className="text-xs text-muted-foreground line-through">
                        ¥{favorite.product_detail.original_price}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
