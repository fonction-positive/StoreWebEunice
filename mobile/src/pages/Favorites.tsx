import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
const Favorites = () => {
  const favoriteProducts = [
    {
      id: 1,
      name: "BLACK CROP TOP",
      color: "Grey",
      price: 45,
      image: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=400&fit=crop",
    },
    {
      id: 2,
      name: "LUXE SWEATER",
      color: "Grey",
      price: 85,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",
    },
  ];

  return (
    <div className="max-w-md mx-auto px-4 py-6 h-full overflow-y-auto">
      <h1 className="text-3xl font-bold mb-8">Favorites</h1>

      <div className="grid grid-cols-2 gap-4">
        {favoriteProducts.map((product) => (
          <Card key={product.id} className="rounded-2xl overflow-hidden">
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
              >
                <Heart className="h-5 w-5 fill-[rgb(255,107,107)] text-[rgb(255,107,107)]" />
              </Button>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-sm mb-1">{product.name}</h3>
              <p className="text-xs text-muted-foreground mb-2">
                Color - {product.color}
              </p>
              <p className="font-bold text-lg">${product.price}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
