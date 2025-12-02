import { useState, useEffect } from "react";
import { ArrowLeft, Heart, Minus, Plus, ChevronRight, Star, Shield, Package, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Link, useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
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
  category_name?: string;
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
  is_favorited?: boolean;
}

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  // Fetch product details from backend API
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const response = await api.get(`products/${id}/`);
        setProduct(response.data);
        setIsFavorite(response.data.is_favorited || false);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        toast({
          title: "错误",
          description: "无法加载商品信息",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast({
          title: "请先登录",
          description: "添加商品到购物车需要先登录",
          variant: "destructive",
        });
        return;
      }
      
      await api.post('cart/add_item/', {
        product_id: product.id,
        quantity: quantity
      });
      
      toast({
        title: "已添加到购物车",
        description: `${quantity}x ${product.name}`,
      });
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
      const errorMsg = error.response?.data?.error || "无法添加到购物车，请稍后重试";
      toast({
        title: "添加失败",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  const toggleFavorite = async () => {
    if (!product) return;

    const token = localStorage.getItem('access_token');
    if (!token) {
      toast({
        title: "请先登录",
        description: "收藏功能需要先登录",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await api.post('favorites/toggle/', {
        product_id: product.id
      });
      
      setIsFavorite(response.data.is_favorited);
      toast({
        title: response.data.is_favorited ? "已添加到收藏夹" : "已取消收藏",
        description: response.data.message,
      });
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      toast({
        title: "操作失败",
        description: "无法更新收藏状态",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">商品不存在</p>
        </div>
      </div>
    );
  }

  const productImages = product.images && product.images.length > 0
    ? product.images.map(img => img.image)
    : product.main_image
    ? [product.main_image.image]
    : ["https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=800&h=800&fit=crop"];

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Fixed Floating Back and Favorite Buttons */}
      <div className="fixed top-4 left-0 right-0 z-20">
        <div className="max-w-md mx-auto px-4 flex items-center justify-between">
          <Link to="/">
            <button className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-background transition-all">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          <button
            onClick={toggleFavorite}
            className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-background transition-all"
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-[rgb(255,107,107)] text-[rgb(255,107,107)]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Product Images */}
      <div className="relative aspect-square bg-muted">
        <img
          src={productImages[currentImage]}
          alt={product.name}
          className="w-full h-full object-cover"
        />

        {productImages.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {productImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`h-2 rounded-full transition-all ${
                  currentImage === index ? "w-8 bg-foreground" : "w-2 bg-foreground/30"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {product.is_hot_sale && (
              <Badge variant="default" className="bg-red-500 text-white rounded-full">Hot Sale</Badge>
            )}
            {(product.rating || product.reviews) && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-foreground" />
                <span className="font-semibold">{product.rating || 5.0}</span>
                {product.reviews !== undefined && (
                  <span className="text-muted-foreground text-sm">({product.reviews})</span>
                )}
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold mb-3">{product.name}</h1>
          <div className="flex items-center gap-3 mb-2">
            <p className="text-3xl font-bold">¥{product.price}</p>
            {product.original_price && product.original_price > product.price && (
              <>
                <p className="text-xl text-muted-foreground line-through">¥{product.original_price}</p>
                {product.discount_percentage > 0 && (
                  <Badge variant="destructive" className="rounded-full">-{product.discount_percentage}%</Badge>
                )}
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">库存:</span>
            <Badge variant={product.stock > 0 ? "secondary" : "destructive"} className="rounded-full">
              {product.stock > 0 ? `${product.stock} 件` : "缺货"}
            </Badge>
          </div>
        </div>


        {/* Specifications */}
        <Card className="p-4 rounded-2xl">
          <h3 className="font-bold mb-3">商品信息</h3>
          <div className="space-y-2">
            {product.category_name && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">分类</span>
                <span className="font-semibold">{product.category_name}</span>
              </div>
            )}
            {product.size && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">型号/尺寸</span>
                <span className="font-semibold">{product.size}</span>
              </div>
            )}
            {product.color && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">颜色</span>
                <span className="font-semibold">{product.color}</span>
              </div>
            )}
            {product.material && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">材质</span>
                <span className="font-semibold">{product.material}</span>
              </div>
            )}
            {product.weight && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">重量</span>
                <span className="font-semibold">{product.weight}</span>
              </div>
            )}
            {product.length && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">长度</span>
                <span className="font-semibold">{product.length}</span>
              </div>
            )}
            {product.compatibility && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">适用性</span>
                <span className="font-semibold">{product.compatibility}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">库存</span>
              <span className="font-semibold">{product.stock} 件</span>
            </div>
          </div>
        </Card>

        {/* Description */}
        {product.description && (
          <div>
            <h3 className="font-bold mb-2">商品描述</h3>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>
        )}

        {/* Customer Reviews Preview */}
        {(product.rating || product.reviews) && (
          <Card className="p-4 rounded-2xl">
            <button className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold">用户评价</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-foreground" />
                  <span className="font-semibold">{product.rating || 5.0}</span>
                  {product.reviews !== undefined && product.reviews > 0 && (
                    <span className="text-muted-foreground text-sm">({product.reviews}条)</span>
                  )}
                </div>
              </div>
              <ChevronRight className="h-5 w-5" />
            </button>
          </Card>
        )}
      </div>

      {/* Bottom Drawer - Fixed */}
      <div className="fixed bottom-0 left-0 right-0 z-20">
        <Drawer>
          <DrawerTrigger asChild>
            <div className="bg-background border-t border-border">
              <div className="max-w-md mx-auto px-4 py-4">
                <div className="flex items-center justify-between gap-4 bg-foreground text-background rounded-full px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuantity(Math.max(1, quantity - 1));
                      }}
                      className="h-8 w-8 rounded-full bg-background/20 flex items-center justify-center"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="font-bold text-lg w-8 text-center">{quantity}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuantity(Math.min(product.stock, quantity + 1));
                      }}
                      className="h-8 w-8 rounded-full bg-background/20 flex items-center justify-center"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="font-bold text-lg">加入购物车</span>
                  <div className="flex gap-1">
                    <ChevronRight className="h-5 w-5" />
                    <ChevronRight className="h-5 w-5 -ml-3" />
                    <ChevronRight className="h-5 w-5 -ml-3" />
                  </div>
                </div>
              </div>
            </div>
          </DrawerTrigger>
          <DrawerContent>
            <div className="max-w-md mx-auto w-full p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="font-bold text-xl">加入购物车</h3>
                
                {/* Quantity Selector */}
                <div className="flex items-center justify-between">
                  <span className="font-semibold">数量</span>
                  <div className="flex items-center gap-3 bg-muted rounded-full px-4 py-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-8 w-8 rounded-full bg-background flex items-center justify-center"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="font-bold text-lg w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="h-8 w-8 rounded-full bg-background flex items-center justify-center"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="font-bold text-lg">总计</span>
                  <span className="font-bold text-2xl">¥{(product.price * quantity).toFixed(2)}</span>
                </div>
              </div>

              <Button
                className="w-full h-14 rounded-full text-base font-bold"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {product.stock > 0 ? `加入购物车 - ¥${(product.price * quantity).toFixed(2)}` : '缺货'}
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default ProductDetail;
