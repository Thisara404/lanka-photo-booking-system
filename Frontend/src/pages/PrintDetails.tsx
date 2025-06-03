import { PaymentService } from '../services/payment.service';
import { useToast } from '../components/ui/use-toast';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Inside your component:
const PrintDetails = () => {
  // Add these state variables
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // ...existing code...
  
  // Add this function to handle payment
  const handlePurchase = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to purchase prints",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    if (!selectedPrint) return;
    
    try {
      setIsLoading(true);
      
      // Calculate final price based on size and frame selections
      const basePrice = selectedPrint.price;
      const sizeMultiplier = selectedSize === 'large' ? 1.5 : selectedSize === 'medium' ? 1.2 : 1;
      const framePrice = selectedFrame === 'wood' ? 25 : selectedFrame === 'metal' ? 35 : selectedFrame === 'minimalist' ? 30 : 0;
      
      const finalPrice = (basePrice * sizeMultiplier) + framePrice;
      
      // Create payment order
      const response = await PaymentService.createOrder({
        itemId: selectedPrint._id,
        itemType: 'print',
        amount: finalPrice,
        metadata: {
          printSize: selectedSize,
          frame: selectedFrame,
          printName: selectedPrint.name
        }
      });
      
      if (response.status && response.data.approvalUrl) {
        // Redirect to PayPal
        window.location.href = response.data.approvalUrl;
      } else {
        throw new Error("Failed to create payment");
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Find your Buy/Purchase button in the JSX and update it:
  return (
    // ...existing JSX...
    <Button 
      className="w-full" 
      onClick={handlePurchase} 
      disabled={isLoading}
    >
      {isLoading ? "Processing..." : "Buy Now"}
    </Button>
    // ...existing JSX...
  );
};

export default PrintDetails;