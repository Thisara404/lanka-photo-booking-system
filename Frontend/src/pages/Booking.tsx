import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/use-toast';
import api from '../api';
import { Button } from '../components/ui/button';
import { Loader2 } from 'lucide-react';
import Layout from "@/components/Layout";
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

// Service information with images and prices
const serviceInfo = {
  "Wedding Photography": {
    image: "/images/services/wedding.jpg", // Update with your actual image path
    price: 100000,
    deposit: 10000,
    description: "Comprehensive coverage of your special day, from preparation to reception."
  },
  "Pre-Wedding Shoot": {
    image: "/images/services/pre-wedding.jpg", // Update with your actual image path
    price: 50000,
    deposit: 7000,
    description: "Capture your love story before the big day in beautiful locations."
  },
  "Birthday Photography": {
    image: "/images/services/birthday.jpg", // Update with your actual image path
    price: 15000,
    deposit: 3000,
    description: "Preserve memories of your celebration with professional photography."
  },
  "Graduation Photography": {
    image: "/images/services/graduation.jpg", // Update with your actual image path
    price: 25000,
    deposit: 5000,
    description: "Celebrate your academic achievement with professional photography."
  }
};

const Booking = () => {
  // Existing state variables
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("Wedding Photography");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableTimes, setAvailableTimes] = useState<string[]>([
    "9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: ""
  });

  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || ""
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  // Handle next step logic
  const handleNextStep = async () => {
    // Validation for each step
    if (step === 1) {
      // Validate service, date, and time selection
      if (!selectedCategory) {
        toast({
          title: "Please select a service",
          description: "You need to select a photography service.",
          variant: "destructive",
        });
        return;
      }

      if (!selectedDate) {
        toast({
          title: "Please select a date",
          description: "You need to select a date for your booking.",
          variant: "destructive",
        });
        return;
      }

      if (!selectedTime) {
        toast({
          title: "Please select a time",
          description: "You need to select a time slot for your booking.",
          variant: "destructive",
        });
        return;
      }
      
      // If everything is valid, proceed to next step
      setStep(2);
      return;
    }

    if (step === 2) {
      // Validate contact information
      if (!formData.name || !formData.email || !formData.phone) {
        toast({
          title: "Missing Information",
          description: "Please fill in your name, email, and phone number.",
          variant: "destructive",
        });
        return;
      }
      
      // Validate phone number specifically
      if (formData.phone.trim() === '') {
        toast({
          title: "Missing Phone Number",
          description: "Please provide a valid phone number for your booking.",
          variant: "destructive",
        });
        return;
      }

      // If everything is valid, proceed to confirmation step
      setStep(3);
      return;
    }

    if (step === 3) {
      // This is the final confirmation step - implement the payment process here
      await handleBookAndPay();
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Function to handle the booking and payment process
  const handleBookAndPay = async () => {
    try {
      if (!user) {
        toast({
          title: "Login Required",
          description: "Please log in to book a session",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }
      
      setSubmitting(true);
      
      console.log("Creating booking with data:", {
        date: selectedDate,
        time: selectedTime,
        category: selectedCategory,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || "0000000000" // Ensure phone is never empty
      });
      
      // Create the booking first with correct API endpoint
      const bookingData = {
        date: selectedDate,
        time: selectedTime,
        category: selectedCategory,
        message: formData.notes || '',
        address: formData.address || '',
        name: formData.name || user.name,
        email: formData.email || user.email,
        phone: formData.phone || "0000000000" // Default value if empty
      };
      
      // Use the correct endpoint with /api prefix
      const bookingResponse = await api.post('/api/bookings', bookingData);
      console.log("Booking response:", bookingResponse.data);
      
      if (bookingResponse.data && bookingResponse.data.booking && bookingResponse.data.booking._id) {
        const booking = bookingResponse.data.booking;
        setBookingId(booking._id);
        
        // Get deposit amount from serviceInfo based on category
        const depositAmount = serviceInfo[selectedCategory].deposit;
        
        console.log("Creating payment for booking ID:", booking._id, "amount:", depositAmount);
        
        // Now process payment
        setProcessingPayment(true);
        
        // Create payment order
        const response = await api.post(`/api/bookings/${booking._id}/payment`, {
          depositAmount
        });
        
        console.log("Payment response:", response.data);
        
        if (response.data.success && response.data.data.approvalUrl) {
          // Store booking ID in sessionStorage to use after redirect
          sessionStorage.setItem('pendingBookingId', booking._id);
          
          // Redirect to PayPal
          window.location.href = response.data.data.approvalUrl;
        } else {
          throw new Error("Failed to create payment: " + JSON.stringify(response.data));
        }
      } else {
        throw new Error("Failed to create booking: Invalid response structure");
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "There was a problem processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
      setProcessingPayment(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-center mb-6">Book a Photography Session</h1>
        
        {/* Progress indicators */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>1</div>
            <div className={`h-1 w-12 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>2</div>
            <div className={`h-1 w-12 ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200'}`}>3</div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Select Photography Service"}
              {step === 2 && "Enter Your Details"}
              {step === 3 && "Review & Confirm"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Display selected service image and description */}
            {selectedCategory && (
              <div className="mb-6">
                <div className="rounded-lg overflow-hidden shadow-md max-h-64">
                  <img 
                    src={serviceInfo[selectedCategory].image} 
                    alt={selectedCategory}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // If image fails to load, use a fallback
                      e.currentTarget.src = "/images/placeholder-service.jpg"; 
                    }}
                  />
                </div>
                <p className="mt-3 text-muted-foreground text-sm">
                  {serviceInfo[selectedCategory].description}
                </p>
                <div className="mt-2 font-semibold">
                  Price: LKR {serviceInfo[selectedCategory].price.toLocaleString()}
                  <span className="text-sm text-muted-foreground ml-2">(Deposit: LKR {serviceInfo[selectedCategory].deposit.toLocaleString()})</span>
                </div>
              </div>
            )}
            
            {/* Step 1: Select Service, Date, and Time */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">SELECT PHOTOGRAPHY SERVICE</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.keys(serviceInfo).map((category) => (
                      <Button 
                        key={category}
                        type="button"
                        variant={selectedCategory === category ? "default" : "outline"}
                        onClick={() => setSelectedCategory(category)}
                        className="justify-start"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">SELECT DATE</h3>
                    <div className="border rounded-md p-3">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={{ before: new Date() }}
                        className="rounded-md border"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">SELECT TIME</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {availableTimes.map((time) => (
                        <Button
                          key={time}
                          type="button"
                          variant={selectedTime === time ? "default" : "outline"}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2: Contact Information */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                  <Input 
                    id="name" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="phone" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your contact number"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Required for booking confirmation</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Event Location/Address</Label>
                  <Input 
                    id="address" 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter event location or address"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea 
                    id="notes" 
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any special requirements or information"
                    rows={3}
                  />
                </div>
              </div>
            )}
            
            {/* Step 3: Review and Confirm */}
            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">BOOKING SUMMARY</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Service:</span>
                    <span className="font-medium">{selectedCategory}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">
                      {selectedDate ? format(selectedDate, 'PP') : ''}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Contact:</span>
                    <span className="font-medium">{formData.email} | {formData.phone}</span>
                  </div>
                  
                  {formData.address && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-medium">{formData.address}</span>
                    </div>
                  )}
                  
                  {formData.notes && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Notes:</span>
                      <span className="font-medium">{formData.notes}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between py-2 mt-4">
                    <span className="font-medium">Total Price:</span>
                    <span className="font-bold">
                      LKR {serviceInfo[selectedCategory].price.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Deposit Required:</span>
                    <span className="font-bold text-primary">
                      LKR {serviceInfo[selectedCategory].deposit.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="mt-4 p-3 bg-muted/50 rounded text-sm">
                    <p>
                      By confirming this booking, you agree to our terms and conditions. A deposit of LKR {serviceInfo[selectedCategory].deposit.toLocaleString()} is required to secure your booking date and time. This amount will be converted to USD for payment processing.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-8 flex justify-between">
              {step > 1 ? (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  Previous
                </Button>
              ) : (
                <div></div> // Empty div to maintain spacing
              )}
              
              <Button 
                onClick={step < 3 ? () => {
                  // Validation for step 1
                  if (step === 1) {
                    if (!selectedDate) {
                      toast({ title: "Please select a date", variant: "destructive" });
                      return;
                    }
                    if (!selectedTime) {
                      toast({ title: "Please select a time", variant: "destructive" });
                      return;
                    }
                  }
                  
                  // Validation for step 2
                  if (step === 2) {
                    if (!formData.name || !formData.email || !formData.phone) {
                      toast({
                        title: "Missing information",
                        description: "Please fill in all required fields",
                        variant: "destructive",
                      });
                      return;
                    }
                  }
                  
                  setStep(step + 1);
                } : handleBookAndPay}
                disabled={submitting || processingPayment}
              >
                {submitting || processingPayment ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    {processingPayment ? "Processing Payment..." : "Processing..."}
                  </>
                ) : (
                  step < 3 ? "Next" : "Book and Pay"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Booking;
