import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout.jsx";

import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Orders from "./pages/Orders.jsx";
import NotFound from "./pages/NotFound.jsx";
import Checkout from "./pages/Checkout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

function App() {
  return (
    <Routes>
       
       <Route path="/login" element={<Login />} />
       <Route path="/register" element={<Register />} />

        <Route 
         path="/forgot-password"
         element={<ForgotPassword />}
         />
         <Route path="/reset-password/:token"
         element={<ResetPassword />}
         />
      <Route element={<MainLayout />}>

        <Route path="/" element={<Home />} />

        <Route path="/products" element={<Products />} />

        <Route 
          path="/products/:id" 
          element={<ProductDetails />} 
        />

        <Route path="/cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
          } />

        <Route path="/checkout"
         element={
         <ProtectedRoute> 
          <Checkout />
          </ProtectedRoute>
         }
         />

        

       <Route path="/orders"
         element={
         <ProtectedRoute>
          <Orders />
          </ProtectedRoute>
         } />

        
  
        <Route path="/profile" 
         element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
         }
     />

        <Route path="/wishlist" element={<Wishlist />} />
         
        
        <Route path="*" element={<NotFound />} />

      </Route>

    </Routes>
  );
}

export default App;