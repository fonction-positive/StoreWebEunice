import { useState } from "react";
import { ArrowLeft, Heart, Minus, Plus, ChevronRight, Star, Shield, Package, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("Pearl White");
  const [isFavorite, setIsFavorite] = useState(false);

  const product = {
    name: "Premium Pearl Phone Chain",
    price: 28,
    originalPrice: 45,
    rating: 4.8,
    reviews: 128,
    description: "Elegant pearl phone chain with adjustable length. Features durable nylon cord and secure metal clasps. Perfect for keeping your phone accessible while adding a touch of style.",
    images: [
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=800&fit=crop",
    ],
    colors: [
      { name: "Pearl White", hex: "#F5F5F5", stock: 45 },
      { name: "Rose Gold", hex: "#E6C7B8", stock: 32 },
      { name: "Classic Black", hex: "#1F1F1F", stock: 28 },
      { name: "Mint Green", hex: "#B8E6D5", stock: 15 },
    ],
    features: [
      { icon: Shield, text: "Anti-drop Protection" },
      { icon: Package, text: "Universal Fit" },
      { icon: Sparkles, text: "Premium Materials" },
    ],
    specs: {
      length: "120cm adjustable",
      material: "Nylon cord + Pearl beads",
      weight: "15g",
      compatibility: "All smartphones",
    },
  };

  const [currentImage, setCurrentImage] = useState(0);

  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${quantity}x ${product.name} (${selectedColor})`,
    });
  };

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
            onClick={() => setIsFavorite(!isFavorite)}
            className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-background transition-all"
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-[rgb(255,107,107)] text-[rgb(255,107,107)]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Product Images */}
      <div className="relative aspect-square bg-muted">
        <img
          src={product.images[currentImage]}
          alt={product.name}
          className="w-full h-full object-cover"
        />

        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {product.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`h-2 rounded-full transition-all ${
                currentImage === index ? "w-8 bg-foreground" : "w-2 bg-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="rounded-full">Hot Sale</Badge>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-foreground" />
              <span className="font-semibold">{product.rating}</span>
              <span className="text-muted-foreground text-sm">({product.reviews})</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-3">{product.name}</h1>
          <div className="flex items-center gap-3 mb-2">
            <p className="text-3xl font-bold">${product.price}</p>
            <p className="text-xl text-muted-foreground line-through">${product.originalPrice}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Total Stock:</span>
            <Badge variant={product.colors.reduce((sum, c) => sum + c.stock, 0) > 50 ? "secondary" : "destructive"} className="rounded-full">
              {product.colors.reduce((sum, c) => sum + c.stock, 0)} units available
            </Badge>
          </div>
        </div>


        {/* Color Selection */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold">Select Color</h3>
            <span className="text-sm text-muted-foreground">
              {product.colors.find(c => c.name === selectedColor)?.stock} in stock
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {product.colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  selectedColor === color.name
                    ? "border-foreground bg-muted"
                    : "border-border bg-background"
                }`}
              >
                <div
                  className="h-8 w-8 rounded-full border-2 border-border flex-shrink-0"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="font-semibold text-sm">{color.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Specifications */}
        <Card className="p-4 rounded-2xl">
          <h3 className="font-bold mb-3">Specifications</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Length</span>
              <span className="font-semibold">{product.specs.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Material</span>
              <span className="font-semibold">{product.specs.material}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Weight</span>
              <span className="font-semibold">{product.specs.weight}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Compatibility</span>
              <span className="font-semibold">{product.specs.compatibility}</span>
            </div>
          </div>
        </Card>

        {/* Description */}
        <div>
          <h3 className="font-bold mb-2">Description</h3>
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>
        </div>

        {/* Customer Reviews Preview */}
        <Card className="p-4 rounded-2xl">
          <button className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold">Customer Reviews</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-foreground" />
                <span className="font-semibold">{product.rating}</span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5" />
          </button>
        </Card>
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
                        setQuantity(quantity + 1);
                      }}
                      className="h-8 w-8 rounded-full bg-background/20 flex items-center justify-center"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="font-bold text-lg">Add to Cart</span>
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
                <h3 className="font-bold text-xl">Add to Cart</h3>
                
                {/* Quantity Selector */}
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Quantity</span>
                  <div className="flex items-center gap-3 bg-muted rounded-full px-4 py-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-8 w-8 rounded-full bg-background flex items-center justify-center"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="font-bold text-lg w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="h-8 w-8 rounded-full bg-background flex items-center justify-center"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Selected Color */}
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Color</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-5 w-5 rounded-full border-2 border-border"
                      style={{ backgroundColor: product.colors.find(c => c.name === selectedColor)?.hex }}
                    />
                    <span className="text-muted-foreground">{selectedColor}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-2xl">${product.price * quantity}</span>
                </div>
              </div>

              <Button
                className="w-full h-14 rounded-full text-base font-bold"
                onClick={handleAddToCart}
              >
                Add to Cart - ${product.price * quantity}
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default ProductDetail;
