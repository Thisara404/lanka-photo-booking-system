import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext"; // Add this import

const Hero = () => {
  const [loaded, setLoaded] = useState(false);
  const { user } = useAuth(); // Get user authentication status
  
  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video or Image */}
      <div className="absolute inset-0 z-0">
        <div 
          className={`w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-10000 ${loaded ? 'scale-105' : 'scale-100'}`}
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80')",
            transition: "transform 15s ease-out",
          }}
        >
          <div className="absolute inset-0 bg-black/75"></div>
        </div>
      </div>
      
      {/* Animated 2D Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-40 h-40 border-2 border-white/10 rotate-45 -z-5 animate-spin" style={{ animationDuration: '30s' }}></div>
      <div className="absolute bottom-1/4 right-1/4 w-60 h-60 border border-white/5 rounded-full -z-5 animate-pulse" style={{ animationDuration: '15s' }}></div>
      <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-white/5 -z-5 animate-float"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)] -z-5"></div>
      
      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden -z-5">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="absolute rounded-full bg-white/10"
            style={{
              width: `${Math.random() * 5 + 2}px`,
              height: `${Math.random() * 5 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 5}s linear infinite alternate`,
            }}
          ></div>
        ))}
      </div>
      
      {/* Moving lines */}
      <div className="absolute inset-0 -z-5">
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent top-1/3 animate-wave" style={{ animationDuration: '10s' }}></div>
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent top-2/3 animate-wave" style={{ animationDuration: '15s', animationDelay: '1s' }}></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className={`transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="font-montserrat text-4xl md:text-6xl lg:text-7xl text-white font-light tracking-widest mb-6 uppercase opacity-0 animate-fadeIn"
              style={{animationDelay: '0.3s', animationFillMode: 'forwards'}}>
            Capturing Life's<br />
            <span className="text-white opacity-0 animate-fadeIn" style={{animationDelay: '0.8s', animationFillMode: 'forwards'}}>Perfect Moments</span>
          </h1>
          <div className="w-24 h-1 bg-white/50 mx-auto my-8 opacity-0 animate-fadeIn" style={{animationDelay: '1.2s', animationFillMode: 'forwards'}}></div>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8 tracking-wide opacity-0 animate-fadeIn"
             style={{animationDelay: '1.5s', animationFillMode: 'forwards'}}>
            Professional photography services in Sri Lanka. Specializing in weddings, 
            portraits, and landscapes that tell your unique story.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 opacity-0 animate-fadeIn" 
               style={{animationDelay: '1.8s', animationFillMode: 'forwards'}}>
            <Button asChild size="lg" className="text-base bg-transparent border border-white hover:bg-white hover:text-black transition-all">
              <Link to="/booking">Book a Session</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base text-white border-white hover:bg-white hover:text-black transition-all">
              <Link to="/gallery">View Portfolio</Link>
            </Button>
            {!user && (
              <Button asChild size="lg" className="text-base bg-primary border border-primary hover:bg-primary/90 hover:text-white transition-all">
                <Link to="/register">Sign Up</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Scroll down indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 opacity-0 animate-fadeIn" 
           style={{animationDelay: '2.5s', animationFillMode: 'forwards'}}>
        <div className="flex flex-col items-center animate-bounce" style={{animationDuration: '2s'}}>
          <span className="text-white/70 text-sm mb-2 tracking-widest uppercase text-xs">Scroll Down</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-white/70"
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Hero;
