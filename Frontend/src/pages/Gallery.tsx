import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ArrowUp } from "lucide-react";
import "@/styles/gallery.css";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, Observer);

// Local gallery data to avoid API dependency
const localGalleries = [
    {
        _id: "1",
        title: "Wildlife of Sri Lanka",
        slug: "wildlife-of-sri-lanka",
        description:
            "Capturing the incredible diversity of wildlife across Sri Lanka, from elephants in Udawalawe to leopards in Yala.",
        category: "wildlife",
        coverImage: "/images/3.jpg",
        featured: true,
        photos: [
            { src: "/images/3.jpg", caption: "Wildlife 1" },
            { src: "/images/2.jpg", caption: "Wildlife 2" },
            { src: "/images/4.jpg", caption: "Wildlife 3" },
            { src: "/images/5.jpg", caption: "Wildlife 4" },
            { src: "/images/6.jpg", caption: "Wildlife 5" },
        ],
    },
    {
        _id: "2",
        title: "Sri Lankan Weddings",
        slug: "sri-lankan-weddings",
        description:
            "Traditional Sri Lankan wedding ceremonies captured with attention to cultural details and emotional moments.",
        category: "weddings",
        coverImage: "/images/1.jpg",
        featured: true,
        photos: [
            { src: "/images/1.jpg", caption: "Wedding 1" },
            { src: "/images/7.jpg", caption: "Wedding 2" },
            { src: "/images/8.jpg", caption: "Wedding 3" },
            { src: "/images/6.jpg", caption: "Wedding 4" },
        ],
    },
    {
        _id: "3",
        title: "Sri Lanka Landscapes",
        slug: "sri-lanka-landscapes",
        description: "Beautiful landscapes from across the island nation.",
        category: "landscapes",
        coverImage: "/images/2.jpg",
        featured: true,
        photos: [
            { src: "/images/2.jpg", caption: "Landscape 1" },
            { src: "/images/9.jpg", caption: "Landscape 2" },
            { src: "/images/10.jpg", caption: "Landscape 3" },
            { src: "/images/11.jpg", caption: "Landscape 4" },
            { src: "/images/12.jpg", caption: "Landscape 5" },
        ],
    },
];

const Gallery = () => {
    const [galleries, setGalleries] = useState(localGalleries);
    const [loading, setLoading] = useState(true);
    const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [isContentSection, setIsContentSection] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isInScrollZone, setIsInScrollZone] = useState(false);
    const heroRef = useRef(null);
    const galleryContentRef = useRef(null);

    // Initialize galleries with local data
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // Track mouse position for scroll zones
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
            
            // Define scroll zones (left and right edges)
            const windowWidth = window.innerWidth;
            const scrollZoneWidth = 150; // pixels from edge
            
            const isInLeftZone = e.clientX < scrollZoneWidth;
            const isInRightZone = e.clientX > (windowWidth - scrollZoneWidth);
            
            setIsInScrollZone(isInLeftZone || isInRightZone);
        };

        window.addEventListener('mousemove', handleMouseMove);
        
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    // Initialize split header effect
    useEffect(() => {
        if (loading || !galleries.length) return;

        try {
            const heroContainers = document.querySelectorAll(".hero__image-cont");
            const animSwipes = document.querySelectorAll(".anim-swipe");
            const currentGallery = galleries[currentGalleryIndex];

            if (!currentGallery) return;

            // Set images for split header
            heroContainers.forEach((container) => {
                const img = container.querySelector("img");
                if (img) {
                    img.style.opacity = "1";
                    img.style.width = "100%";
                    img.style.height = "100%";
                    img.style.objectFit = "cover";
                    img.style.objectPosition = "center";
                    img.style.position = "absolute";
                    img.style.left = "0";
                    img.style.top = "0";
                    img.src = currentGallery.coverImage;
                }
            });

            // Initial split header animation
            gsap.to(animSwipes, {
                yPercent: 300,
                delay: 0.2,
                duration: 3,
                stagger: {
                    from: "random",
                    each: 0.1,
                },
                ease: "sine.out",
            });

            // Animate the scroll down indicator
            gsap.fromTo(
                ".scroll-down-indicator",
                { y: -20, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, delay: 3 }
            );

            return () => {
                ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
            };
        } catch (err) {
            console.error("GSAP animation setup error:", err);
        }
    }, [loading, galleries, currentGalleryIndex]);

    // Setup scroll detection for sections
    useEffect(() => {
        if (loading) return;

        const handleScroll = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;

            // Check if we're in the content section (below the hero)
            setIsContentSection(scrollY > windowHeight * 0.3);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll(); // Initial check

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [loading]);

    // Setup wheel event handling with smart scrolling logic
    useEffect(() => {
        if (loading || !galleries.length) return;

        const handleWheel = (e) => {
            if (animating) return;

            // If mouse is in scroll zones (left/right edges), allow normal page scrolling
            if (isInScrollZone) {
                return; // Let browser handle normal scroll
            }

            // If we're in the content section and not in scroll zones, handle gallery navigation
            if (isContentSection) {
                e.preventDefault();
                
                if (e.deltaY > 0) {
                    // Scrolling down - next gallery
                    gotoGallery(currentGalleryIndex + 1);
                } else {
                    // Scrolling up - previous gallery
                    gotoGallery(currentGalleryIndex - 1);
                }
            }
        };

        // Add keyboard navigation
        const handleKeyDown = (e) => {
            if (animating) return;

            if ((e.key === "ArrowUp" || e.key === "ArrowLeft") && isContentSection) {
                e.preventDefault();
                gotoGallery(currentGalleryIndex - 1);
            }
            if ((e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === " ") && isContentSection) {
                e.preventDefault();
                gotoGallery(currentGalleryIndex + 1);
            }
            
            // ESC key to scroll back to top
            if (e.key === "Escape" && isContentSection) {
                scrollToTop();
            }
        };

        window.addEventListener("wheel", handleWheel, { passive: false });
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("wheel", handleWheel);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [loading, galleries, currentGalleryIndex, animating, isContentSection, isInScrollZone]);

    // Function to handle gallery navigation
    const gotoGallery = (index) => {
        if (animating || !galleries.length) return;

        setAnimating(true);
        const wrappedIndex = (index + galleries.length) % galleries.length;

        try {
            const gallerySlides = document.querySelectorAll(".gallery-slide");
            if (!gallerySlides.length) {
                setAnimating(false);
                return;
            }

            const currentSlide = gallerySlides[currentGalleryIndex];
            const nextSlide = gallerySlides[wrappedIndex];
            const direction = index > currentGalleryIndex ? 1 : -1;

            const tl = gsap.timeline({
                defaults: { duration: 1, ease: "expo.inOut" },
                onComplete: () => {
                    setAnimating(false);
                    setCurrentGalleryIndex(wrappedIndex);

                    // Update hero section images
                    const heroContainers = document.querySelectorAll(".hero__image-cont");
                    const nextGallery = galleries[wrappedIndex];

                    heroContainers.forEach((container) => {
                        const img = container.querySelector("img");
                        if (img && nextGallery) {
                            img.src = nextGallery.coverImage;
                        }
                    });
                },
            });

            tl.to(currentSlide, {
                xPercent: -100 * direction,
                opacity: 0,
            })
                .fromTo(
                    nextSlide,
                    { xPercent: 100 * direction, opacity: 0 },
                    { xPercent: 0, opacity: 1 },
                    0
                )
                .fromTo(
                    `.gallery-slide:nth-child(${wrappedIndex + 1}) .gallery-images img`,
                    { scale: 1.5, opacity: 0.5 },
                    { scale: 1, opacity: 1, stagger: 0.1 },
                    0.3
                );
        } catch (err) {
            console.error("Gallery transition error:", err);
            setCurrentGalleryIndex(wrappedIndex);
            setAnimating(false);
        }
    };

    // Handle scroll down button click
    const handleScrollDown = () => {
        const contentSection = galleryContentRef.current;
        if (contentSection) {
            contentSection.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    // Handle scroll to top
    const scrollToTop = () => {
        if (animating) return;
        
        setAnimating(true);
        
        gsap.to(window, {
            duration: 1.5,
            scrollTo: { y: 0, offsetY: 0 },
            ease: "power3.inOut",
            onComplete: () => setAnimating(false)
        });
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-screen bg-black text-white">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout hideFooter>
            <div className="relative">
                {/* Scroll zones indicator (only visible when in content section) */}
                {isContentSection && (
                    <>
                        <div className={`fixed left-0 top-0 h-full w-32 z-30 transition-all duration-300 ${
                            isInScrollZone ? 'bg-white/10 backdrop-blur-sm' : ''
                        }`}>
                            <div className="flex items-center justify-center h-full">
                                <div className={`text-white/50 text-xs transform -rotate-90 transition-opacity duration-300 ${
                                    isInScrollZone ? 'opacity-100' : 'opacity-30'
                                }`}>
                                    Normal Scroll Zone
                                </div>
                            </div>
                        </div>
                        <div className={`fixed right-0 top-0 h-full w-32 z-30 transition-all duration-300 ${
                            isInScrollZone ? 'bg-white/10 backdrop-blur-sm' : ''
                        }`}>
                            <div className="flex items-center justify-center h-full">
                                <div className={`text-white/50 text-xs transform rotate-90 transition-opacity duration-300 ${
                                    isInScrollZone ? 'opacity-100' : 'opacity-30'
                                }`}>
                                    Normal Scroll Zone
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Back to top button */}
                {isContentSection && (
                    <button
                        onClick={scrollToTop}
                        className="fixed top-6 left-1/2 transform -translate-x-1/2 z-40 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full transition-all duration-300 flex items-center space-x-2 group"
                        disabled={animating}
                    >
                        <ArrowUp className="h-4 w-4 group-hover:animate-bounce" />
                        <span className="text-sm">Back to Gallery</span>
                    </button>
                )}

                {/* Hero Section with Split Header Effect */}
                <section ref={heroRef} className="hero h-screen relative">
                    <div className="absolute inset-0 z-10 bg-black/50"></div>

                    <div className="hero__inner">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="hero__image-cont">
                                <img
                                    src={
                                        galleries[currentGalleryIndex]?.coverImage ||
                                        "/images/1.jpg"
                                    }
                                    alt={
                                        galleries[currentGalleryIndex]?.title ||
                                        "Gallery image"
                                    }
                                    className="w-full h-full object-cover"
                                />
                                <div className="anim-swipe"></div>
                            </div>
                        ))}
                    </div>

                    {/* Gallery Title Overlay */}
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
                        <h1 className="text-5xl md:text-7xl font-bold text-white text-center mb-8">
                            {galleries[currentGalleryIndex]?.title || "Gallery"}
                        </h1>

                        {/* Scroll down indicator button */}
                        <div
                            className="scroll-down-indicator absolute bottom-10 cursor-pointer"
                            onClick={handleScrollDown}
                        >
                            <div className="flex flex-col items-center space-y-2">
                                <p className="text-white uppercase tracking-widest text-sm">
                                    SCROLL DOWN
                                </p>
                                <div className="animate-bounce">
                                    <ChevronDown className="text-white h-6 w-6" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Gallery content section */}
                <section ref={galleryContentRef} className="min-h-screen bg-black">
                    <div className="gallery-container relative pt-16">
                        {galleries.map((gallery, index) => (
                            <div
                                key={gallery._id}
                                className={`gallery-slide ${
                                    index === currentGalleryIndex
                                        ? "opacity-100"
                                        : "opacity-0 pointer-events-none absolute inset-0"
                                }`}
                            >
                                <div className="flex flex-col px-4 py-16 bg-gradient-to-b from-black/80 to-transparent">
                                    <div className="container mx-auto flex flex-col">
                                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                                            {gallery.title}
                                        </h2>
                                        <p className="text-white/80 text-lg mb-8 max-w-2xl">
                                            {gallery.description}
                                        </p>

                                        <Link
                                            to={`/album/${gallery.slug}`}
                                            className="text-white hover:text-primary mb-8 inline-block underline decoration-dotted w-fit"
                                        >
                                            View Full Album
                                        </Link>

                                        <div className="gallery-images grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {gallery.photos &&
                                                gallery.photos
                                                    .slice(0, 6)
                                                    .map((photo, photoIndex) => (
                                                        <div
                                                            key={photoIndex}
                                                            className="gallery-image-container relative overflow-hidden rounded-lg group"
                                                        >
                                                            <img
                                                                src={photo.src}
                                                                alt={
                                                                    photo.caption ||
                                                                    `Photo ${photoIndex + 1}`
                                                                }
                                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                            />
                                                            {photo.caption && (
                                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                                                    <p className="text-white text-sm">
                                                                        {photo.caption}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                        </div>

                                        {/* Gallery Navigation Instructions */}
                                        <div className="mt-16 p-4 bg-black/30 rounded-lg">
                                            <p className="text-white/60 text-sm text-center mb-2">
                                                Navigate galleries with mouse wheel in center area. Use left/right edges for normal scrolling.
                                            </p>
                                            <p className="text-white/40 text-xs text-center mb-4">
                                                Press ESC or click "Back to Gallery" to return to top • Use keyboard arrows for navigation
                                            </p>
                                            <div className="flex justify-center space-x-8">
                                                <button
                                                    className="flex items-center text-white/70 hover:text-white transition-colors"
                                                    onClick={() => gotoGallery(currentGalleryIndex - 1)}
                                                >
                                                    <span className="border border-white/50 rounded px-2 py-1 mr-2">
                                                        ←
                                                    </span>
                                                    Previous Gallery
                                                </button>
                                                <button
                                                    className="flex items-center text-white/70 hover:text-white transition-colors"
                                                    onClick={() => gotoGallery(currentGalleryIndex + 1)}
                                                >
                                                    Next Gallery
                                                    <span className="border border-white/50 rounded px-2 py-1 ml-2">
                                                        →
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default Gallery;
