import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
  hideNavbar?: boolean;
}

const Layout = ({ children, hideFooter = false, hideNavbar = false }: LayoutProps) => {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Decorative elements - dark 2D shapes with animations */}
      <div className="fixed top-0 right-0 w-64 h-64 bg-black/5 rounded-full blur-3xl -z-10 animate-[pulse_8s_ease-in-out_infinite]"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl -z-10 animate-[bounce_20s_ease-in-out_infinite_alternate]"></div>
      <div className="fixed top-1/2 left-1/4 w-72 h-72 bg-black/5 rounded-full blur-3xl -z-10 animate-[spin_30s_linear_infinite]"></div>
      
      {/* Moving geometric shapes */}
      <div className="fixed top-20 right-1/4 w-40 h-40 border border-black/10 rotate-45 -z-10 animate-[ping_10s_ease-in-out_infinite]"></div>
      <div className="fixed bottom-20 right-20 w-32 h-32 border-2 border-black/5 -z-10 animate-[spin_15s_linear_infinite]"></div>
      
      {/* Diagonal lines with fade effect */}
      <div className="fixed inset-0 opacity-5 -z-10 animate-[fadeIn_5s_ease-out_infinite_alternate]">
        <div className="absolute top-0 left-0 w-full h-full" 
             style={{background: "repeating-linear-gradient(45deg, #000, #000 1px, transparent 1px, transparent 10px)"}}></div>
      </div>
      
      {/* Floating dots pattern */}
      <div className="fixed inset-0 -z-10 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full"
             style={{background: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "30px 30px"}}></div>
      </div>
      
      {!hideNavbar && <Navbar />}
      <main className={`flex-grow ${!hideNavbar ? 'pt-20' : ''}`}>
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
