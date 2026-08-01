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

import Dashboard from "./admin/Dashboard";
import AdminProducts from "./admin/Products";
import AdminOrders from "./admin/Orders";
import AdminUsers from "./admin/Users";

import AdminCoupons from "./admin/Coupons";
import AdminAnalytics from "./admin/Analytics";
import AdminRoute from "./components/AdminRoute.jsx";
import Users from "./admin/Users.jsx";
import Categories from "./admin/Categories.jsx";
import Settings from "./admin/Setting.jsx";

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


      <Route
  path="/admin/dashboard"
  element={
    <AdminRoute>
      <Dashboard />
    </AdminRoute>
  }
/>



<Route
  path="/admin/orders"
  element={
    <AdminRoute>
      <AdminOrders />
    </AdminRoute>
  }
/>

<Route
  path="/admin/users"
  element={
   <AdminRoute> 
    <Users />
  </AdminRoute>
  }
/>

<Route
  path="/admin/categories"
  
  element={
    <AdminRoute>
      <Categories />
    </AdminRoute>
  }
/>

<Route
  path="/admin/coupons"
  element={
    <AdminRoute>
      <AdminCoupons />
    </AdminRoute>
  }
/>

<Route
  path="/admin/analytics"
  element={
    <AdminRoute>
      <AdminAnalytics />
    </AdminRoute>
  }
/>


<Route path="/admin/products" 
element=
{
  <AdminRoute>
    <AdminProducts />
  </AdminRoute>
}
/>
 



<Route 
path="/admin/settings" 
element=
{
  <AdminRoute>
    <Settings />
  </AdminRoute>
}
 />
 </Routes>
);
}
export default App;