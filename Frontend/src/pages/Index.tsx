import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Image array for the homepage
const images = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80",
    alt: "Wedding Photography",
    path: "/booking",
    title: "WEDDING PHOTOGRAPHY"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80",
    alt: "Photography Presets",
    path: "/presets",
    title: "PHOTOGRAPHY PRESETS"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80",
    alt: "Fine Art Prints",
    path: "/prints",
    title: "FINE ART PRINTS"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?auto=format&fit=crop&q=80",
    alt: "Portfolio Gallery",
    path: "/gallery",
    title: "PORTFOLIO GALLERY"
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&q=80",
    alt: "Photography Blog",
    path: "/blog",
    title: "PHOTOGRAPHY BLOG"
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&q=80",
    alt: "Pre-Wedding Shoots",
    path: "/booking?category=pre-shoot",
    title: "PRE-WEDDING SHOOTS"
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&q=80",
    alt: "About Me",
    path: "/about",
    title: "ABOUT ME"
  }
];

const parallaxImages = [
  "/images/1.jpg", // Wedding shoot
  "/images/2.jpg", // Pre shoot
  "/images/3.jpg", // Birtday shoot
  "/images/4.jpg", // Graduation shoot
  "/images/5.jpg", // Model shoot
];

const ParallaxSections = () => {
  useEffect(() => {
    const getRatio = (el: HTMLElement) => window.innerHeight / (window.innerHeight + el.offsetHeight);

    const sections = gsap.utils.toArray<HTMLElement>("section.parallax-section");
    
    sections.forEach((section, i) => {
      const bg = section.querySelector(".bg") as HTMLElement;

      // Use user's own images
      bg.style.backgroundImage = `url(${parallaxImages[i]})`;
      
      gsap.fromTo(bg, {
        backgroundPosition: () => i ? `50% ${-window.innerHeight * getRatio(section)}px` : "50% 0px"
      }, {
        backgroundPosition: () => `50% ${window.innerHeight * (1 - getRatio(section))}px`,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: () => i ? "top bottom" : "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true
        }
      });
    });

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <>
      <section className="parallax-section">
        <div className="bg"></div>
        <h1>Wedding shoot</h1>
      </section>
      <section className="parallax-section">
        <div className="bg"></div>
        <h1>Pre shoot</h1>
      </section>
      <section className="parallax-section">
        <div className="bg"></div>
        <h1>Birtday shoot</h1>
      </section>
      <section className="parallax-section">
        <div className="bg"></div>
        <h1>Graduation shoot</h1>
      </section>
      <section className="parallax-section">
        <div className="bg"></div>
        <h1>Model shoot</h1>
      </section>
    </>
  );
};

const Index = () => {
  return (
    <Layout hideFooter>
      {/* Hero Section with Tagline - Keeping it unchanged */}
      <Hero />
      
      {/* Using the parallax sections instead of the grid */}
      <ParallaxSections />
      
      {/* Commented out the original grid layout
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
        {images.map((image, index) => (
          <Link 
            to={image.path} 
            key={image.id}
            className={cn(
              "group relative h-screen md:h-[50vh] overflow-hidden",
              index === 0 && "md:col-span-2 lg:col-span-3 h-screen"
            )}
          >
            <div className="absolute inset-0 bg-black/60 z-10 opacity-50 group-hover:opacity-20 transition-opacity duration-500"></div>
            <img 
              src={image.src} 
              alt={image.alt}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="bg-black/40 backdrop-blur-sm px-6 py-4 rounded-sm border border-white/10 transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                <h2 className="text-white font-montserrat text-2xl md:text-3xl tracking-widest font-light">
                  {image.title}
                </h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
      */}
    </Layout>
  );
};

export default Index;
