import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Layout from '../components/Layout'; // Or whatever your correct path is
import { Button } from '../components/ui/button';
import { AlertCircle } from 'lucide-react';

const PaymentError = () => {
  const [searchParams] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  useEffect(() => {
    const message = searchParams.get('message');
    if (message) {
      setErrorMessage(message);
    } else {
      setErrorMessage('There was an error processing your payment.');
    }
  }, [searchParams]);
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-card rounded-lg shadow-sm p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
          <p className="text-muted-foreground mb-6">{errorMessage}</p>
          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link to="/">Return to Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/help">Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentError;