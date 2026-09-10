import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/layout/app-layout";
import { AccountLayout, AddressesPage, OrdersPage, ProfilePage } from "@/pages/account-page";
import { CartPage } from "@/pages/cart-page";
import { LoginPage } from "@/pages/login-page";
import { HomePage } from "@/pages/home-page";
import { ProductDetailsPage } from "@/pages/product-details-page";
import { ShopPage } from "@/pages/shop-page";
import { WishlistPage } from "@/pages/wishlist-page";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:slug" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/account" element={<AccountLayout />}>
          <Route index element={<ProfilePage />} />
          <Route path="addresses" element={<AddressesPage />} />
          <Route path="orders" element={<OrdersPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
