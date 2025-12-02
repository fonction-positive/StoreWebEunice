import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import ProductDetail from "./pages/ProductDetail";
import MainLayout from "./components/MainLayout";
import Orders from "./pages/Orders";
import Settings from "./pages/Settings";
import AddressManagement from "./pages/AddressManagement";
import PasswordSecurity from "./pages/PasswordSecurity";
import NotificationSettings from "./pages/NotificationSettings";
import LanguageSettings from "./pages/LanguageSettings";
import HelpCenter from "./pages/HelpCenter";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import About from "./pages/About";
import Notifications from "./pages/Notifications";
import ProductList from "./pages/ProductList";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const MainPages = () => {
  const location = useLocation();

  // Check if we're on a main page or a detail page
  const isMainPage = ['/', '/favorites', '/cart', '/profile'].includes(location.pathname);

  if (!isMainPage) {
    return (
      <Routes>
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/address-management" element={<AddressManagement />} />
        <Route path="/password-security" element={<PasswordSecurity />} />
        <Route path="/notification-settings" element={<NotificationSettings />} />
        <Route path="/language-settings" element={<LanguageSettings />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/about" element={<About />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  return (
    <MainLayout>
      <Index />
      <Favorites />
      <Cart />
      <Profile />
    </MainLayout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/mobile">
        <MainPages />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
