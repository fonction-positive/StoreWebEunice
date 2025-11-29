import { useState } from "react";
import { ChevronRight, Heart, SlidersHorizontal } from "lucide-react";
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

const ProductList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "All";
  
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState("featured");

  const categories = ["All", "Women", "Man", "Kid"];

  const allProducts = [
    {
      id: 1,
      name: "BLACK CROP TOP",
      category: "Women",
      color: "Grey",
      price: 45,
      rating: 4.5,
      reviews: 124,
      image: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=400&fit=crop",
    },
    {
      id: 2,
      name: "LUXE SWEATER",
      category: "Women",
      color: "Grey",
      price: 85,
      rating: 4.8,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",
    },
    {
      id: 3,
      name: "CLASSIC JACKET",
      category: "Man",
      color: "Brown",
      price: 120,
      rating: 4.6,
      reviews: 203,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
    },
    {
      id: 4,
      name: "RED DRESS",
      category: "Women",
      color: "Red",
      price: 95,
      rating: 4.7,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop",
    },
    {
      id: 5,
      name: "SUMMER TANK",
      category: "Women",
      color: "White",
      price: 35,
      rating: 4.3,
      reviews: 78,
      image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=400&fit=crop",
    },
    {
      id: 6,
      name: "DENIM JACKET",
      category: "Man",
      color: "Blue",
      price: 110,
      rating: 4.9,
      reviews: 267,
      image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=400&fit=crop",
    },
    {
      id: 7,
      name: "CASUAL SHIRT",
      category: "Man",
      color: "Black",
      price: 65,
      rating: 4.4,
      reviews: 134,
      image: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=400&h=400&fit=crop",
    },
    {
      id: 8,
      name: "CUTE ROMPER",
      category: "Kid",
      color: "Pink",
      price: 40,
      rating: 4.6,
      reviews: 92,
      image: "https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=400&h=400&fit=crop",
    },
    {
      id: 9,
      name: "MINI HOODIE",
      category: "Kid",
      color: "Grey",
      price: 45,
      rating: 4.8,
      reviews: 145,
      image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&h=400&fit=crop",
    },
    {
      id: 10,
      name: "SPORT TEE",
      category: "Man",
      color: "Navy",
      price: 30,
      rating: 4.2,
      reviews: 67,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    },
    {
      id: 11,
      name: "FLORAL BLOUSE",
      category: "Women",
      color: "Multi",
      price: 55,
      rating: 4.5,
      reviews: 198,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
    },
    {
      id: 12,
      name: "KIDS JEANS",
      category: "Kid",
      color: "Blue",
      price: 50,
      rating: 4.7,
      reviews: 112,
      image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=400&fit=crop",
    },
  ];

  const filteredProducts = selectedCategory === "All" 
    ? allProducts 
    : allProducts.filter(p => p.category === selectedCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

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
            找到 <span className="font-bold text-foreground">{sortedProducts.length}</span> 件商品
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
        <div className="grid grid-cols-2 gap-4 pb-4">
          {sortedProducts.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <Card className="rounded-2xl overflow-hidden hover:scale-105 transition-transform">
                <div className="relative">
                  <img
                    src={product.image}
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
                  {product.rating >= 4.7 && (
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
                  <p className="font-bold text-lg">${product.price}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductList;
