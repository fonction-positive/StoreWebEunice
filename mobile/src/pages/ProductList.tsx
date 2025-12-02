import { useState, useEffect } from "react";
import { ChevronRight, Heart, SlidersHorizontal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Layout from "@/components/Layout";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "@/lib/api";

interface Product {
  id: number;
  name: string;
  category_name: string;
  color: string;
  price: string;
  rating: string;
  reviews: number;
  main_image: { image: string } | null;
}

const ProductList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "All";

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState("featured");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = ["All", "Women", "Man", "Kid"];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = 'products/';
        if (selectedCategory !== "All") {
          url += `?category__name=${selectedCategory}`;
        }

        // Handle sorting
        let ordering = "";
        switch (sortBy) {
          case "price-low":
            ordering = "price";
            break;
          case "price-high":
            ordering = "-price";
            break;
          case "rating":
            ordering = "-rating";
            break;
          default:
            ordering = ""; // featured/default
        }

        if (ordering) {
          url += (url.includes('?') ? '&' : '?') + `ordering=${ordering}`;
        }

        const response = await api.get(url);
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, sortBy]);

  return (
    <Layout>
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ChevronRight className="h-5 w-5 rotate-180" />
            </Button>
            <h1 className="text-3xl font-bold">所有商品</h1>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "secondary"}
              size="sm"
              className="rounded-full font-semibold whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            找到 <span className="font-bold text-foreground">{products.length}</span> 件商品
          </p>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-10 h-10 rounded-full p-0 border-0 bg-transparent hover:bg-accent flex items-center justify-center [&>svg:last-child]:hidden">
              <SlidersHorizontal className="h-5 w-5" />
            </SelectTrigger>
            <SelectContent className="bg-card z-50">
              <SelectItem value="featured">推荐</SelectItem>
              <SelectItem value="price-low">价格从低到高</SelectItem>
              <SelectItem value="price-high">价格从高到低</SelectItem>
              <SelectItem value="rating">评分最高</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 pb-4">
            {products.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`}>
                <Card className="rounded-2xl overflow-hidden hover:scale-105 transition-transform">
                  <div className="relative">
                    <img
                      src={product.main_image?.image || "/placeholder.png"}
                      alt={product.name}
                      className="w-full aspect-square object-cover"
                    />
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute top-3 right-3 h-10 w-10 rounded-full bg-card/90 hover:bg-card"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                    {parseFloat(product.rating) >= 4.7 && (
                      <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                        热门
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm mb-1 line-clamp-1">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center">
                        <span className="text-xs text-muted-foreground">⭐</span>
                        <span className="text-xs font-semibold ml-1">{product.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">({product.reviews})</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Color - {product.color}
                    </p>
                    <p className="font-bold text-lg">¥{product.price}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductList;
