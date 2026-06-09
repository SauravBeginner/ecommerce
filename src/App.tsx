import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/layout/app-layout";
import { CartPage } from "@/pages/cart-page";
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
