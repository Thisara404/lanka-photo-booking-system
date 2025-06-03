import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function BookingConfirmation() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // If user tries to navigate directly to this page, redirect to home
  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        // If user is logged in, refresh the token to ensure it's used for future requests
        const token = localStorage.getItem('token');
        if (token) {
          // Re-apply token to ensure it's used for future requests
          const event = new Event('storage');
          window.dispatchEvent(event);
        }
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [user]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <Card>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Thank you for booking a photography session with us. We have received your booking request and will contact you shortly to confirm the details.
              </p>
              
              <p>
                Your booking has been saved to our system. {user ? "You can track the status of your booking in your profile." : "Create an account or log in to track your booking status."}
              </p>
              
              <div className="pt-6 flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild>
                  <Link to="/">Return to Homepage</Link>
                </Button>
                {user ? (
                  <Button variant="outline" asChild>
                    <Link to="/profile">View My Bookings</Link>
                  </Button>
                ) : (
                  <Button variant="outline" asChild>
                    <Link to="/login">Log In / Sign Up</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}