import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '../components/ui/use-toast';
import { PrintService } from '../services/print.service';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const capturePayment = async () => {
      try {
        setLoading(true);
        
        const type = searchParams.get('type');
        const id = searchParams.get('id');
        const token = searchParams.get('token'); // PayPal order ID
        
        if (!token) {
          throw new Error('No payment token found');
        }
        
        console.log('Capturing payment:', { type, id, token });
        
        if (type === 'print') {
          const response = await PrintService.capturePayment(token);
          
          if (response.success) {
            console.log('Payment captured successfully:', response);
            toast({
              title: "Payment Successful!",
              description: "Your print purchase has been completed. You can download it from your profile.",
            });
            setSuccess(true);
          } else {
            throw new Error(response.error || 'Failed to capture payment');
          }
        }
        // Handle other payment types as needed
      } catch (error) {
        console.error('Payment capture error:', error);
        toast({
          title: "Payment Error",
          description: "There was an issue finalizing your payment. Please contact support.",
          variant: "destructive"
        });
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    };
    
    capturePayment();
  }, [searchParams, toast]);
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto bg-card rounded-lg shadow-sm p-8 text-center">
            <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-bold mb-2">Processing Payment</h1>
            <p className="text-muted-foreground mb-6">Please wait while we finalize your payment...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-card rounded-lg shadow-sm p-8 text-center">
          {success ? (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
              <p className="text-muted-foreground mb-6">
                Your purchase has been completed. You can now access your download in your profile.
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 text-amber-500 mx-auto mb-4">⚠️</div>
              <h1 className="text-2xl font-bold mb-2">Payment Processing</h1>
              <p className="text-muted-foreground mb-6">
                Your payment is being processed. If your account is not updated within a few minutes, please contact support.
              </p>
            </>
          )}
          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link to="/profile?tab=downloads">View My Downloads</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentSuccess;