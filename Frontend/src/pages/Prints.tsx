import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from "@/components/Layout";
import { PrintService } from '../services/print.service';
import { useToast } from '../components/ui/use-toast';
import { useAuth } from '../contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Loader2 } from 'lucide-react';

// Define Print interface
interface Print {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  printSizes: string[];
  featured: boolean;
  inStock: boolean;
  highResDownloadUrl?: string;
}

const Prints = () => {
  const [prints, setPrints] = useState<Print[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPrint, setSelectedPrint] = useState<Print | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<string>('No Frame');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    fetchPrints();
  }, []);
  
  const fetchPrints = async () => {
    try {
      setLoading(true);
      const data = await PrintService.getPrints();
      setPrints(data);
    } catch (error) {
      console.error('Error fetching prints:', error);
      toast({
        title: "Error",
        description: "Failed to load prints. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const filteredPrints = selectedCategory 
    ? prints.filter(print => print.category === selectedCategory)
    : prints;
    
  const handlePrintClick = (print: Print) => {
    setSelectedPrint(print);
    setSelectedSize(print.printSizes.length > 0 ? print.printSizes[0] : null);
    setSelectedFrame("No Frame");
    setIsDialogOpen(true);
  };
  
  // Update the handlePurchase function
  const handlePurchase = async () => {
    if (!user) {
      toast({
        title: "Login Required", 
        description: "Please login to purchase prints",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }
    
    if (!selectedPrint || !selectedSize) return;
    
    try {
      setProcessingPayment(true);
      
      // Create payment order
      const response = await PrintService.createPaymentOrder(
        selectedPrint._id, 
        {
          size: selectedSize,
          frame: selectedFrame === 'No Frame' ? null : selectedFrame
        }
      );
      
      console.log("Payment order response:", response);
      
      if (response.success && response.data.approvalUrl) {
        // Redirect to PayPal for payment
        window.location.href = response.data.approvalUrl;
      } else {
        throw new Error("Failed to create payment: " + JSON.stringify(response));
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "There was a problem processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessingPayment(false);
    }
  };
  
  // Calculate price based on size and frame
  const calculatePrice = () => {
    if (!selectedPrint) return 0;
    
    let price = selectedPrint.price;
    
    // Adjust price based on size
    if (selectedSize === 'large' || selectedSize === '16x20' || selectedSize === '20x30') {
      price = price * 1.5;
    } else if (selectedSize === 'medium' || selectedSize === '11x14') {
      price = price * 1.2;
    }
    
    // Add frame price
    if (selectedFrame === 'Wood Frame') {
      price += 2500;
    } else if (selectedFrame === 'Metal Frame') {
      price += 3500;
    } else if (selectedFrame === 'Minimalist Frame') {
      price += 3000;
    }
    
    return price;
  };
  
  // Helper function to format image paths
  const formatImagePath = (imagePath) => {
    if (!imagePath) return "https://placehold.co/800x600?text=No+Image";
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Make sure paths starting with / are properly handled
    if (imagePath.startsWith('/uploads/')) {
      return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${imagePath}`;
    }
    
    // If it's a relative path but doesn't start with /uploads
    if (!imagePath.startsWith('/')) {
      return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/prints/${imagePath}`;
    }
    
    // For any other case, assume it's a path relative to the API
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${imagePath}`;
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center">
            <Loader2 className="h-10 w-10 animate-spin" />
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Photography Prints</h1>
        
        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Filter by Category</h2>
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer px-4 py-2 text-sm"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Badge>
            {['landscapes', 'wildlife', 'coastal', 'cultural', 'other'].map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer px-4 py-2 text-sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Prints Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPrints.length > 0 ? (
            filteredPrints.map(print => (
              <Card key={print._id} className="overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={formatImagePath(print.image)} 
                    alt={print.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/800x600?text=Image+Not+Available";
                      console.warn(`Failed to load image: ${print.image}`);
                    }}
                  />
                  {print.featured && (
                    <Badge className="absolute top-2 right-2">Featured</Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-lg mb-1">{print.name}</h3>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <Badge variant="outline">{print.category}</Badge>
                    {print.highResDownloadUrl && (
                      <Badge variant="secondary">Downloadable</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {print.description.length > 80 
                      ? print.description.substring(0, 80) + "..."
                      : print.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-medium">LKR {print.price.toLocaleString()}</span>
                    <Button 
                      size="sm" 
                      onClick={() => handlePrintClick(print)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-medium mb-2">No prints found</h3>
              <p className="text-muted-foreground">
                {selectedCategory 
                  ? "There are no prints available in this category." 
                  : "There are currently no prints available."}
              </p>
              {selectedCategory && (
                <Button 
                  className="mt-4" 
                  onClick={() => setSelectedCategory(null)}
                >
                  View All Prints
                </Button>
              )}
            </div>
          )}
        </div>
        
        {/* Print Detail Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedPrint?.name}</DialogTitle>
            </DialogHeader>
            
            {selectedPrint && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <img 
                      src={formatImagePath(selectedPrint.image)} 
                      alt={selectedPrint.name} 
                      className="w-full h-auto rounded-md"
                      onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/800x600?text=Image+Not+Available";
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-4">{selectedPrint.description}</p>
                    
                    <div className="space-y-4 mb-6">
                      {/* Size Selection */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Size</label>
                        <Select 
                          value={selectedSize || ''} 
                          onValueChange={setSelectedSize}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedPrint.printSizes.map(size => (
                              <SelectItem key={size} value={size}>
                                {size}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Frame Selection */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Frame Option</label>
                        <Select 
                          value={selectedFrame} 
                          onValueChange={setSelectedFrame}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select frame" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="No Frame">No Frame</SelectItem>
                            <SelectItem value="Wood Frame">Wood Frame (+LKR 2,500)</SelectItem>
                            <SelectItem value="Metal Frame">Metal Frame (+LKR 3,500)</SelectItem>
                            <SelectItem value="Minimalist Frame">Minimalist Frame (+LKR 3,000)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center font-medium">
                        <span>Total Price:</span>
                        <span className="text-xl text-primary">LKR {calculatePrice().toLocaleString()}</span>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        onClick={handlePurchase}
                        disabled={processingPayment}
                      >
                        {processingPayment ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                          </>
                        ) : (
                          <>Buy Now</>
                        )}
                      </Button>
                      
                      {selectedPrint.highResDownloadUrl && (
                        <p className="text-xs text-primary mt-2">
                          Includes high-resolution digital download after purchase
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
            
            <DialogFooter>
              <p className="text-sm text-muted-foreground">
                All prints come with a certificate of authenticity.
              </p>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Prints;
