
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Sample cart items
const initialCartItems = [
  {
    id: "preset1",
    name: "Mountain Gold Preset",
    type: "preset",
    price: 5000,
    quantity: 1,
    image: "/lovable-uploads/f9ad0a4e-56d0-46ac-b989-b1f92766dd89.png"
  },
  {
    id: "print2",
    name: "Misty Mountain Summit Print",
    type: "print",
    price: 18000,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80"
  }
];

const Cart = () => {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = subtotal - discount;
  
  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };
  
  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
    });
  };
  
  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === "photo10") {
      setPromoApplied(true);
      
      toast({
        title: "Promo code applied!",
        description: "10% discount has been applied to your order.",
      });
    } else {
      toast({
        title: "Invalid promo code",
        description: "Please enter a valid promo code.",
        variant: "destructive",
      });
    }
  };
  
  const handleCheckout = () => {
    setIsCheckingOut(true);
    
    // Simulate checkout process
    setTimeout(() => {
      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase. You'll receive a confirmation email shortly.",
      });
      
      // Reset cart
      setCartItems([]);
      setPromoCode("");
      setPromoApplied(false);
      setIsCheckingOut(false);
    }, 2000);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="font-playfair text-4xl mb-10">Your Cart</h1>
        
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-medium mb-6">Cart Items ({cartItems.length})</h2>
                  
                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-4 pb-6 border-b border-border">
                        <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-grow">
                          <h3 className="font-medium mb-1">{item.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {item.type === 'preset' ? 'Digital Preset' : 'Fine Art Print'}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <button 
                                className="w-8 h-8 flex items-center justify-center rounded-md border border-border"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              >
                                -
                              </button>
                              <span className="w-10 text-center">{item.quantity}</span>
                              <button 
                                className="w-8 h-8 flex items-center justify-center rounded-md border border-border"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <span className="font-medium">LKR {item.price.toLocaleString()}</span>
                              <button 
                                className="text-red-500 hover:text-red-600 transition-colors"
                                onClick={() => handleRemoveItem(item.id)}
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div>
              <div className="bg-card rounded-lg border border-border overflow-hidden sticky top-24">
                <div className="p-6">
                  <h2 className="text-xl font-medium mb-6">Order Summary</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>LKR {subtotal.toLocaleString()}</span>
                    </div>
                    
                    {promoApplied && (
                      <div className="flex justify-between text-primary">
                        <span>Discount (10%)</span>
                        <span>-LKR {discount.toLocaleString()}</span>
                      </div>
                    )}
                    
                    <div className="pt-4 border-t border-border">
                      <div className="flex justify-between font-medium text-lg">
                        <span>Total</span>
                        <span>LKR {total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Promo Code */}
                  <div className="mt-6">
                    <h3 className="text-sm font-medium mb-2">Promo Code</h3>
                    <div className="flex gap-2">
                      <Input 
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter promo code"
                        disabled={promoApplied}
                      />
                      <Button 
                        variant="outline" 
                        onClick={handleApplyPromo}
                        disabled={promoApplied || !promoCode}
                      >
                        Apply
                      </Button>
                    </div>
                    {promoApplied && (
                      <p className="text-xs text-primary mt-1">Promo code PHOTO10 applied!</p>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full mt-6" 
                    size="lg"
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                  >
                    {isCheckingOut ? "Processing..." : "Checkout"}
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    By proceeding to checkout, you agree to our{' '}
                    <Link to="/terms" className="text-primary underline">Terms of Service</Link>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet.
              Browse our presets and prints to find something you'll love!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild>
                <Link to="/presets">Browse Presets</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/prints">Browse Prints</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
