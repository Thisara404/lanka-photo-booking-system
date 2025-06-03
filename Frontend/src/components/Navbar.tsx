import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X, User, LogIn } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Force re-render when user changes
  useEffect(() => {
    // This is just to ensure the component re-renders when user state changes
    console.log("User state changed in Navbar:", user?.name || "No user");
  }, [user]);
  
  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm" : "bg-white/0 dark:bg-gray-900/0"
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold">
            Lanka Photography
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Home</Link>
            <Link to="/gallery" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Gallery</Link>
            <Link to="/prints" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Prints</Link>
            <Link to="/presets" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Presets</Link>
            <Link to="/blog" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Blog</Link>
            <Link to="/booking" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Booking</Link>
            <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Contact</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-primary font-medium hover:text-primary/80">Admin Dashboard</Link>
            )}
          </div>

          {/* Right Section: Cart, Profile/Auth */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <Button variant="ghost" size="icon" asChild>
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
              </Link>
            </Button>

            {/* Profile/Auth */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name || "User"}&background=random`} />
                      <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <span className="font-medium">{user.name}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  {/* {user?.role === 'admin' && (
                    <DropdownMenuItem asChild className="font-medium text-primary">
                      <Link to="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )} */}
                  <DropdownMenuItem asChild>
                    <Link to="/profile?tab=bookings">My Bookings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile?tab=downloads">My Downloads</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">
                    <LogIn className="h-4 w-4 mr-1" />
                    Login
                  </Link>
                </Button>
                <Button variant="default" size="sm" asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 space-y-2">
            <Link to="/" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">Home</Link>
            <Link to="/gallery" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">Gallery</Link>
            <Link to="/prints" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">Prints</Link>
            <Link to="/presets" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">Presets</Link>
            <Link to="/blog" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">Blog</Link>
            <Link to="/booking" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">Booking</Link>
            <Link to="/contact" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">Contact</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="block px-3 py-2 rounded-md bg-primary/10 text-primary font-medium">Admin Dashboard</Link>
            )}
            {!user && (
              <>
                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                <Link to="/login" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">Login</Link>
                <Link to="/register" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
