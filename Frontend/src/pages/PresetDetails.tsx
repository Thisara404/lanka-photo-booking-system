import { PaymentService } from '../services/payment.service';
import { useToast } from '../components/ui/use-toast';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PresetDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePurchasePreset = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to purchase presets",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!preset) return;

    try {
      setIsLoading(true);

      const response = await PaymentService.createOrder({
        itemId: preset._id,
        itemType: 'preset',
        amount: preset.price,
        metadata: {
          presetName: preset.name,
          presetType: preset.category
        }
      });

      if (response.status && response.data.approvalUrl) {
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

  return (
    // ...existing JSX...
    <Button 
      className="w-full mt-4" 
      onClick={handlePurchasePreset}
      disabled={isLoading}
    >
      {isLoading ? "Processing..." : `Purchase for $${preset.price}`}
    </Button>
    // ...existing JSX...
  );
};

export default PresetDetails;