import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import LocalCartDrawer from "@/components/storefront/LocalCartDrawer";
import MobileBottomNav from "@/components/storefront/MobileBottomNav";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import AdminProductDetail from "./pages/AdminProductDetail";
import OrderConfirmation from "./pages/OrderConfirmation";
import TrackOrder from "./pages/TrackOrder";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Account from "./pages/Account";
import AccountWishlist from "./pages/AccountWishlist";
import AccountOrders from "./pages/AccountOrders";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminMenus from "./pages/admin/AdminMenus";
import AdminBanners from "./pages/admin/AdminBanners";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminStorefront from "./pages/admin/AdminStorefront";
import AdminDiscounts from "./pages/admin/AdminDiscounts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminLogin from "./pages/admin/AdminLogin";

const queryClient = new QueryClient();

// Component to use hooks inside providers
const AppContent = () => {
  return (
    <>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LocalCartDrawer />
        <Routes>
          {/* Storefront Routes */}
          <Route path="/" element={<><MobileBottomNav /><div className="pb-16 md:pb-0"><Index /></div></>} />
          <Route path="/shop" element={<><MobileBottomNav /><div className="pb-16 md:pb-0"><Shop /></div></>} />
          <Route path="/product/:handle" element={<><MobileBottomNav /><div className="pb-16 md:pb-0"><ProductDetail /></div></>} />
          <Route path="/p/:id" element={<><MobileBottomNav /><div className="pb-16 md:pb-0"><AdminProductDetail /></div></>} />
          <Route path="/checkout" element={<><MobileBottomNav /><div className="pb-16 md:pb-0"><Checkout /></div></>} />
          <Route path="/order-confirmation" element={<><MobileBottomNav /><div className="pb-16 md:pb-0"><OrderConfirmation /></div></>} />
          <Route path="/track-order" element={<><MobileBottomNav /><div className="pb-16 md:pb-0"><TrackOrder /></div></>} />
          <Route path="/about" element={<><MobileBottomNav /><div className="pb-16 md:pb-0"><AboutUs /></div></>} />
          <Route path="/contact" element={<><MobileBottomNav /><div className="pb-16 md:pb-0"><ContactUs /></div></>} />
          <Route path="/account" element={<><MobileBottomNav /><div className="pb-16 md:pb-0"><Account /></div></>} />
          <Route path="/account/wishlist" element={<><MobileBottomNav /><div className="pb-16 md:pb-0"><AccountWishlist /></div></>} />
          <Route path="/account/orders" element={<><MobileBottomNav /><div className="pb-16 md:pb-0"><AccountOrders /></div></>} />
          
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="storefront" element={<AdminStorefront />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="discounts" element={<AdminDiscounts />} />
            <Route path="menus" element={<AdminMenus />} />
            <Route path="banners" element={<AdminBanners />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<><MobileBottomNav /><div className="pb-16 md:pb-0"><NotFound /></div></>} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
