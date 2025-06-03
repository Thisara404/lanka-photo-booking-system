import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";

// Pages
import Index from "@/pages/Index";
import Gallery from "@/pages/Gallery";
import GalleryDetail from "@/pages/AlbumDetail";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Contact from "@/pages/Contact";
import Booking from "@/pages/Booking";
import Prints from "@/pages/Prints";
import Presets from "@/pages/Presets";
import Login from "@/pages/Login.page";
import Register from "@/pages/register.page";
import Profile from "@/pages/profile.page";
import Cart from "@/pages/Cart";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/NotFound";
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentError from './pages/PaymentError';
import PaymentCancel from './pages/PaymentCancel';
import BookingConfirmation from './pages/BookingConfirmation';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gallery/:slug" element={<GalleryDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          <Route path="/prints" element={<Prints />} />
          <Route path="/presets" element={<Presets />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/error" element={<PaymentError />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
