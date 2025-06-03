import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { XCircle } from 'lucide-react';

const PaymentCancel = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Log that payment was canceled
    console.log("Payment was canceled by user");
  }, []);
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-card rounded-lg shadow-sm p-8 text-center">
          <XCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
          <p className="text-muted-foreground mb-6">
            Your payment has been cancelled and you have not been charged.
          </p>
          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link to="/">Return to Home</Link>
            </Button>
            <Button variant="outline" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentCancel;