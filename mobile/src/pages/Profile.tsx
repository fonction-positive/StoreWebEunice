import { useState, useEffect } from "react";
import { ChevronRight, User, Package, Heart, Settings, LogOut, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/api";

interface UserData {
  id: number;
  username: string;
  email: string;
  avatar?: string;
}

interface Stats {
  orders: number;
  favorites: number;
  reviews: number;
}

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [stats, setStats] = useState<Stats>({ orders: 0, favorites: 0, reviews: 0 });
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('access_token');

      if (!token) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      try {
        // Fetch user info
        const userResponse = await api.get('auth/me/');
        setUser(userResponse.data);
        setIsLoggedIn(true);

        // Fetch orders count
        try {
          const ordersResponse = await api.get('orders/');
          setStats(prev => ({ ...prev, orders: ordersResponse.data.length || 0 }));
        } catch (error) {
          console.error('Failed to fetch orders:', error);
        }

        // Fetch favorites count from backend
        try {
          const favoritesResponse = await api.get('favorites/');
          setStats(prev => ({ ...prev, favorites: favoritesResponse.data.length || 0 }));
        } catch (error) {
          console.error('Failed to fetch favorites:', error);
        }

      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // If token is invalid, clear it
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsLoggedIn(false);
    setStats({ orders: 0, favorites: 0, reviews: 0 });
  };

  const menuItems = [
    { icon: Package, label: "My Orders", count: stats.orders, path: "/orders" },
    { icon: Bell, label: "Notifications", count: 0, path: "/notifications" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-6 h-full flex items-center justify-center">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    );
  }

  // Get user initials for avatar fallback
  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 h-full overflow-y-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      {/* User Info Card - Different for logged in/out */}
      {isLoggedIn && user ? (
        <Card className="p-6 rounded-2xl mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              {user.avatar && <AvatarImage src={user.avatar} />}
              <AvatarFallback className="text-xl font-bold">
                {getInitials(user.username)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{user.username}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Link to="/edit-profile">
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 rounded-full text-xs font-semibold"
                >
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-6 rounded-2xl mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 bg-muted">
              <AvatarFallback className="text-xl font-bold">
                <User className="h-10 w-10 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold">未登录</h2>
              <p className="text-sm text-muted-foreground mb-3">快来加入我们吧~</p>
              <Link to="/login">
                <Button
                  size="sm"
                  className="rounded-full text-xs font-semibold"
                >
                  注册登录
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Stats - Only show if logged in */}
      {isLoggedIn && (
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Card className="p-4 rounded-2xl text-center">
            <p className="text-2xl font-bold">{stats.orders}</p>
            <p className="text-xs text-muted-foreground">Orders</p>
          </Card>
          <Card className="p-4 rounded-2xl text-center">
            <p className="text-2xl font-bold">{stats.favorites}</p>
            <p className="text-xs text-muted-foreground">Favorites</p>
          </Card>
          <Card className="p-4 rounded-2xl text-center">
            <p className="text-2xl font-bold">{stats.reviews}</p>
            <p className="text-xs text-muted-foreground">Reviews</p>
          </Card>
        </div>
      )}

      {/* Menu Items */}
      <div className="space-y-6 mb-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.label}
              className="p-4 my-3 rounded-2xl cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleMenuClick(item.path)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-semibold">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {isLoggedIn && item.count !== undefined && item.count > 0 && (
                    <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                      {item.count}
                    </span>
                  )}
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Support Section */}
      <Card className="p-4 rounded-2xl mb-6">
        <h3 className="font-bold mb-3">Support</h3>
        <div className="space-y-2">
          <Link to="/help-center">
            <button className="w-full text-left py-2 px-3 rounded-xl hover:bg-muted/50 transition-colors">
              <span className="text-sm font-medium">Help Center</span>
            </button>
          </Link>
          <Link to="/privacy-policy">
            <button className="w-full text-left py-2 px-3 rounded-xl hover:bg-muted/50 transition-colors">
              <span className="text-sm font-medium">Privacy Policy</span>
            </button>
          </Link>
          <Link to="/about">
            <button className="w-full text-left py-2 px-3 rounded-xl hover:bg-muted/50 transition-colors">
              <span className="text-sm font-medium">About</span>
            </button>
          </Link>
        </div>
      </Card>

      {/* Logout Button - Only show if logged in */}
      {isLoggedIn && (
        <Button
          variant="outline"
          className="w-full h-12 rounded-full font-semibold"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Log Out
        </Button>
      )}
    </div>
  );
};

export default Profile;
