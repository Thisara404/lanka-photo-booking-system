
import { useState } from "react";
import Layout from "@/components/Layout";
import SectionTitle from "@/components/SectionTitle";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Sample preset collections
const presetCollections = [
  { id: "landscape", name: "Landscape Presets" },
  { id: "portrait", name: "Portrait Presets" },
  { id: "travel", name: "Travel Presets" },
  { id: "blackAndWhite", name: "Black & White" },
];

// Sample presets data with the same image for before/after to demonstrate preset effects
const presetsData = [
  {
    id: "master-bundle",
    name: "Master Bundle",
    collection: "landscape",
    price: "LKR 15,000",
    description: "Complete collection of all presets in one bundle with 40% off. Includes lifetime updates.",
    rawImage: "https://images.unsplash.com/photo-1682687220067-dced9a881b56?auto=format&fit=crop&q=80&w=1000",
    beforeImage: "https://images.unsplash.com/photo-1682687220067-dced9a881b56?auto=format&fit=crop&q=80&w=1000",
    afterImage: "https://images.unsplash.com/photo-1682687220067-dced9a881b56?auto=format&fit=crop&q=80&w=1000", // Same image as before
    boxImage: "public/lovable-uploads/d8adf1a3-5170-47f1-abf4-843b12c201f7.png",
    version: "V5",
    year: "2024",
    features: [
      "Complete collection of all presets",
      "Lifetime updates included",
      "Compatible with Lightroom Classic and mobile",
      "40% discount compared to individual purchases"
    ]
  },
  {
    id: "2024-v5",
    name: "2024 V5",
    collection: "landscape",
    price: "LKR 6,000",
    description: "Latest 2024 landscape presets optimized for various lighting conditions.",
    rawImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1000",
    beforeImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1000",
    afterImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1000", // Same image as before
    boxImage: "public/lovable-uploads/d8adf1a3-5170-47f1-abf4-843b12c201f7.png",
    version: "V5",
    year: "2024",
    features: [
      "Optimized for 2024 landscape trends",
      "Enhanced natural colors",
      "Sky enhancement features",
      "Compatible with Lightroom Classic and mobile"
    ]
  },
  {
    id: "2021-v4",
    name: "2021 V4",
    collection: "portrait",
    price: "LKR 5,500",
    description: "Popular portrait preset pack with skin tone optimization.",
    rawImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1000",
    beforeImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1000",
    afterImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1000", // Same image as before
    boxImage: "public/lovable-uploads/d8adf1a3-5170-47f1-abf4-843b12c201f7.png",
    version: "V4",
    year: "2021",
    features: [
      "Natural skin tone enhancement",
      "Soft glow effect",
      "Subtle background blur",
      "Compatible with Lightroom Classic and mobile"
    ]
  }
];

const Presets = () => {
  const { toast } = useToast();
  const [selectedCollection, setSelectedCollection] = useState("landscape");
  const [selectedPreset, setSelectedPreset] = useState(presetsData[0]);
  
  const filteredPresets = presetsData.filter(preset => preset.collection === selectedCollection);
  
  const handleAddToCart = () => {
    toast({
      title: "Added to cart!",
      description: `${selectedPreset.name} preset has been added to your cart.`,
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative h-80 bg-black">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80)" }}
        ></div>
        <div className="relative z-10 container mx-auto h-full flex items-center px-4">
          <div className="max-w-2xl">
            <h1 className="font-montserrat text-4xl md:text-5xl text-white font-light tracking-widest uppercase mb-4">
              Professional Photo Presets
            </h1>
            <p className="text-white/80">
              Transform your photos with my carefully crafted presets, designed from years of
              professional experience to help you achieve stunning results with just one click.
            </p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12 bg-background">
        <div className="mb-16">
          <SectionTitle 
            title="Lightroom Preset Collections" 
            subtitle="Browse through my professional presets crafted for different photography styles"
            center
          />
          
          {/* Collection Tabs */}
          <div className="mt-8">
            <Tabs defaultValue={selectedCollection} onValueChange={setSelectedCollection}>
              <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full max-w-2xl mx-auto">
                {presetCollections.map((collection) => (
                  <TabsTrigger key={collection.id} value={collection.id}>
                    {collection.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {/* Preset Products */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {filteredPresets.map((preset) => (
            <div 
              key={preset.id} 
              className={`bg-card rounded-md overflow-hidden hover-lift cursor-pointer transition-all ${selectedPreset.id === preset.id ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setSelectedPreset(preset)}
            >
              <div className="relative aspect-[3/4] bg-black">
                {/* 3D Box Image */}
                <img 
                  src={preset.boxImage} 
                  alt={preset.name}
                  className="w-full h-full object-contain"
                />
                
                {/* Version Badge */}
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-sm text-sm">
                  {preset.year} {preset.version}
                </div>
                
                {/* Selection Indicator */}
                {selectedPreset.id === preset.id && (
                  <div className="absolute top-0 left-0 w-full h-full border-2 border-primary"></div>
                )}
              </div>
              <div className="p-4 border-t border-border">
                <h3 className="font-montserrat text-xl tracking-wider uppercase font-light">{preset.name}</h3>
                <p className="text-primary font-medium mt-1">{preset.price}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Selected Preset Details */}
        <div className="bg-card border border-border rounded-md p-8 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="font-montserrat text-3xl tracking-widest uppercase font-light mb-4">{selectedPreset.name}</h2>
              <div className="w-16 h-1 bg-primary mb-6"></div>
              <p className="text-lg mb-6">{selectedPreset.description}</p>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Features</h3>
                <ul className="space-y-2">
                  {selectedPreset.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <span className="font-montserrat text-3xl">{selectedPreset.price}</span>
                <span className="text-sm text-muted-foreground">Lifetime updates included</span>
              </div>
              
              <Button className="w-full" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
            </div>
            
            {/* Before/After Slider - Now using the same image for both sides */}
            <div className="h-[400px] bg-black/5 rounded-md overflow-hidden animate-fade-in">
              <BeforeAfterSlider
                beforeImage={selectedPreset.beforeImage}
                afterImage={selectedPreset.afterImage}
                presetName={selectedPreset.name}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
        
        {/* Bundle Offer */}
        <div className="bg-black/90 backdrop-blur-sm rounded-lg p-8 border border-white/10 transform hover:scale-[1.01] transition-transform">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="font-montserrat text-2xl md:text-3xl tracking-widest uppercase font-light mb-4 text-white">
                Complete Collection Bundle
              </h3>
              <p className="text-white/70 mb-6">
                Get all my presets in one bundle and save 40%! Includes lifetime updates
                and access to future preset releases.
              </p>
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-montserrat text-white">LKR 15,000</span>
                <span className="text-white/50 line-through">LKR 25,000</span>
              </div>
            </div>
            
            <Button size="lg" className="min-w-[200px] bg-white text-black hover:bg-white/80" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-4 w-4" /> Add Bundle to Cart
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Presets;
