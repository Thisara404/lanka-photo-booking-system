
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SectionTitle from "@/components/SectionTitle";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Sample albums data
const albumsData = {
  "weddings": {
    title: "Wedding Albums",
    description: "Capturing beautiful moments from wedding ceremonies across Sri Lanka.",
    photos: Array(24).fill(0).map((_, i) => ({
      id: `wedding-${i+1}`,
      src: `https://images.unsplash.com/photo-${1519741497674 + i}?auto=format&fit=crop&q=80`,
      caption: `Wedding photography sample ${i+1}`
    }))
  },
  "landscapes": {
    title: "Sri Lanka Landscapes",
    description: "Beautiful landscapes from across the island nation.",
    photos: Array(18).fill(0).map((_, i) => ({
      id: `landscape-${i+1}`,
      src: `https://images.unsplash.com/photo-${1469474968028 + i}?auto=format&fit=crop&q=80`,
      caption: `Sri Lankan landscape ${i+1}`
    }))
  },
  "wildlife": {
    title: "Wildlife Photography",
    description: "Sri Lanka's rich biodiversity captured through my lens.",
    photos: Array(15).fill(0).map((_, i) => ({
      id: `wildlife-${i+1}`,
      src: `https://images.unsplash.com/photo-${1602491453631 + i}?auto=format&fit=crop&q=80`,
      caption: `Wildlife photo ${i+1}`
    }))
  },
  "portraits": {
    title: "Portrait Sessions",
    description: "Professional portrait photography for various clients.",
    photos: Array(22).fill(0).map((_, i) => ({
      id: `portrait-${i+1}`,
      src: `https://images.unsplash.com/photo-${1504257432389 + i}?auto=format&fit=crop&q=80`,
      caption: `Portrait session ${i+1}`
    }))
  },
  "cultural": {
    title: "Sri Lankan Culture",
    description: "Photographs celebrating the rich cultural heritage of Sri Lanka.",
    photos: Array(19).fill(0).map((_, i) => ({
      id: `cultural-${i+1}`,
      src: `https://images.unsplash.com/photo-${1564449606763 + i}?auto=format&fit=crop&q=80`,
      caption: `Cultural photography ${i+1}`
    }))
  },
  "graduations": {
    title: "Graduation Sessions",
    description: "Capturing the milestone moments of academic achievement.",
    photos: Array(12).fill(0).map((_, i) => ({
      id: `graduation-${i+1}`,
      src: `https://images.unsplash.com/photo-${1523050854058 + i}?auto=format&fit=crop&q=80`,
      caption: `Graduation session ${i+1}`
    }))
  }
};

const AlbumDetail = () => {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  
  if (!id || !albumsData[id as keyof typeof albumsData]) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl mb-4">Album Not Found</h1>
          <p className="mb-8">The album you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/gallery">Back to Gallery</Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  const album = albumsData[id as keyof typeof albumsData];
  
  const handlePhotoClick = (index: number) => {
    setSelectedPhoto(index);
    setOpen(true);
  };
  
  const handlePrevious = () => {
    if (selectedPhoto === null) return;
    setSelectedPhoto((prev) => (prev === 0 ? album.photos.length - 1 : prev - 1));
  };
  
  const handleNext = () => {
    if (selectedPhoto === null) return;
    setSelectedPhoto((prev) => (prev === album.photos.length - 1 ? 0 : prev + 1));
  };
  
  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative h-72 bg-black">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: `url(${album.photos[0].src})` }}
        ></div>
        <div className="relative z-10 container mx-auto h-full flex items-center px-4">
          <div>
            <Link to="/gallery" className="text-white/70 hover:text-white flex items-center mb-4">
              <ChevronLeft size={18} />
              <span>Back to Gallery</span>
            </Link>
            <h1 className="font-montserrat text-4xl md:text-5xl text-white font-light tracking-widest uppercase mb-4">
              {album.title}
            </h1>
            <p className="text-white/80 max-w-2xl tracking-wide">
              {album.description}
            </p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {album.photos.map((photo, index) => (
            <div 
              key={photo.id}
              className="aspect-square overflow-hidden rounded-lg cursor-pointer hover-lift"
              onClick={() => handlePhotoClick(index)}
            >
              <img 
                src={photo.src} 
                alt={photo.caption} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Photo Lightbox */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl h-[80vh] p-0 bg-black border-none">
          {selectedPhoto !== null && (
            <>
              <div className="relative w-full h-full flex items-center justify-center">
                <img 
                  src={album.photos[selectedPhoto].src} 
                  alt={album.photos[selectedPhoto].caption} 
                  className="max-h-full max-w-full object-contain"
                />
                
                <div 
                  className="absolute left-4 rounded-full bg-black/50 p-2 cursor-pointer hover:bg-black/80 transition-colors"
                  onClick={handlePrevious}
                >
                  <ChevronLeft size={24} className="text-white" />
                </div>
                
                <div 
                  className="absolute right-4 rounded-full bg-black/50 p-2 cursor-pointer hover:bg-black/80 transition-colors"
                  onClick={handleNext}
                >
                  <ChevronRight size={24} className="text-white" />
                </div>
                
                <div className="absolute bottom-4 left-0 right-0 text-center text-white/80 text-sm">
                  {album.photos[selectedPhoto].caption}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AlbumDetail;
