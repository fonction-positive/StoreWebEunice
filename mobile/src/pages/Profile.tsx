import { ChevronRight, User, Package, Heart, Settings, LogOut, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

const Profile = () => {
  const menuItems = [
    { icon: Package, label: "My Orders", count: 3, path: "/orders" },
    { icon: Heart, label: "Favorites", count: 12, path: "/favorites" },
    { icon: Bell, label: "Notifications", count: 5, path: "/notifications" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="max-w-md mx-auto px-4 py-6 h-full overflow-y-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      {/* User Info Card */}
      <Card className="p-6 rounded-2xl mb-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-bold">John Doe</h2>
            <p className="text-sm text-muted-foreground">john.doe@email.com</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 rounded-full text-xs font-semibold"
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Card className="p-4 rounded-2xl text-center">
          <p className="text-2xl font-bold">12</p>
          <p className="text-xs text-muted-foreground">Orders</p>
        </Card>
        <Card className="p-4 rounded-2xl text-center">
          <p className="text-2xl font-bold">24</p>
          <p className="text-xs text-muted-foreground">Favorites</p>
        </Card>
        <Card className="p-4 rounded-2xl text-center">
          <p className="text-2xl font-bold">5</p>
          <p className="text-xs text-muted-foreground">Reviews</p>
        </Card>
      </div>

      {/* Menu Items */}
      <div className="space-y-6 mb-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const content = (
            <Card
              key={item.label}
              className="p-4 rounded-2xl cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-semibold">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.count && (
                    <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                      {item.count}
                    </span>
                  )}
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </Card>
          );

          return item.path ? (
            <Link key={item.label} to={item.path}>
              {content}
            </Link>
          ) : (
            content
          );
        })}
      </div>

      {/* Support Section */}
      <Card className="p-4 rounded-2xl mb-6">
        <h3 className="font-bold mb-3">Support</h3>
        <div className="space-y-2">
          <button className="w-full text-left py-2 px-3 rounded-xl hover:bg-muted/50 transition-colors">
            <span className="text-sm font-medium">Help Center</span>
          </button>
          <button className="w-full text-left py-2 px-3 rounded-xl hover:bg-muted/50 transition-colors">
            <span className="text-sm font-medium">Privacy Policy</span>
          </button>
          <button className="w-full text-left py-2 px-3 rounded-xl hover:bg-muted/50 transition-colors">
            <span className="text-sm font-medium">Terms of Service</span>
          </button>
        </div>
      </Card>

      {/* Logout Button */}
      <Button
        variant="outline"
        className="w-full h-12 rounded-full font-semibold"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Log Out
      </Button>
    </div>
  );
};

export default Profile;
