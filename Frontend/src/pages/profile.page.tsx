import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { format } from 'date-fns';

// Import admin components
import BookingsList from "@/components/admin/BookingsList.component";
import ContactsList from "@/components/admin/ContactsList.component";
import BlogManagement from "@/components/admin/BlogManagement.component";
import GalleryManagement from "@/components/admin/GalleryManagement.component";
import ProductManagement from "@/components/admin/ProductsManagement.component";
// Import UserService at the top of the file
import UserService from "@/services/user.service";
// Import the UserPurchases component at the top
import UserPurchases from "../components/user/UserPurchases.component";

export default function Profile() {
  const { user, logout, loading: authLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updating, setUpdating] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'account';
  
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
    
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user, authLoading, navigate]);
  
  useEffect(() => {
    const fetchUserBookings = async () => {
      if (!user) return;
      
      try {
        console.log("Fetching bookings for user:", user._id);
        setLoadingBookings(true);
        
        const response = await UserService.getUserBookings();
        console.log("Bookings response:", response.data);
        setBookings(response.data);
      } catch (error) {
        console.error("Failed to fetch user bookings:", error);
        toast({
          title: "Error",
          description: "Failed to load your bookings data.",
          variant: "destructive"
        });
      } finally {
        setLoadingBookings(false);
      }
    };
    
    fetchUserBookings();
    
    // Add a refresh interval to periodically check for new bookings
    const interval = setInterval(fetchUserBookings, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [user, toast]);
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (password && password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    setUpdating(true);
    
    try {
      const updatedProfile = {
        name,
        email,
        phone,
        ...(password ? { password } : {})
      };
      
      await UserService.updateUserProfile(updatedProfile); // Changed from updateProfile to updateUserProfile
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };
  
  if (authLoading) {
    return (
      <Layout>
        <div className="container py-8 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile sidebar */}
          <div className="md:w-1/4">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.name || "User"}&background=random`} />
                  <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <CardTitle className="mt-2">{user?.name}</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
                <div className="mt-2 inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {user?.role === 'admin' ? 'Administrator' : 'Customer'}
                </div>
              </CardHeader>
              <CardContent>
                {/* Add a prominent admin dashboard button if user is admin
                {user?.role === 'admin' && (
                  <Button asChild variant="default" className="w-full mb-3">
                    <Link to="/admin">
                      Admin Dashboard
                    </Link>
                  </Button>
                )} */}
                <Button 
                  variant="outline" 
                  className="w-full mb-2"
                  onClick={handleLogout}
                >
                  Log Out
                </Button>
              </CardContent>
            </Card>

            {/* Admin dashboard card - Make it more visible */}
            {user?.role === 'admin' && (
                <Card className="mt-4 border-primary/50">
                <CardHeader className="bg-primary text-primary-foreground text-center">
                  <CardTitle className="text-base">Admin Controls</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <Button asChild className="w-full">
                    <Link to="/admin">Go to Admin Dashboard</Link>
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Access the admin dashboard to manage all aspects of your photography website.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Main content */}
          <div className="md:w-3/4">
            <Tabs defaultValue={defaultTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="account">My Account</TabsTrigger>
                <TabsTrigger value="bookings">My Bookings</TabsTrigger>
                <TabsTrigger value="downloads">My Downloads</TabsTrigger>
                {user?.role === 'admin' && (
                  <>
                    <TabsTrigger value="manage-bookings">Manage Bookings</TabsTrigger>
                    <TabsTrigger value="manage-contacts">Contact Messages</TabsTrigger>
                    <TabsTrigger value="manage-content">Manage Content</TabsTrigger>
                  </>
                )}
              </TabsList>
              
              {/* Account Settings Tab */}
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input 
                            id="phone" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="border-t pt-4 mt-4">
                        <h3 className="text-lg font-medium mb-2">Change Password</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input 
                              id="password" 
                              type="password" 
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input 
                              id="confirmPassword" 
                              type="password" 
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <Button type="submit" disabled={updating}>
                          {updating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                              Updating...
                            </>
                          ) : (
                            "Update Profile"
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* User Bookings Tab */}
              <TabsContent value="bookings">
                <Card>
                  <CardHeader>
                    <CardTitle>My Bookings</CardTitle>
                    <CardDescription>View and manage your photography sessions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loadingBookings ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                      </div>
                    ) : bookings.length > 0 ? (
                      <div className="space-y-4">
                        {bookings.map((booking) => (
                          <div key={booking._id} className="border rounded-md p-4">
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium">{booking.category} Session</h3>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                              <p>Date: {format(new Date(booking.date), 'PPP')}</p>
                              <p>Time: {booking.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500">No bookings found</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Downloads Tab */}
              <TabsContent value="downloads">
                <Card>
                  <CardHeader>
                    <CardTitle>My Downloads</CardTitle>
                    <CardDescription>Access your purchased photos, presets, and prints</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UserPurchases />
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Admin: Manage Bookings Tab */}
              {user?.role === 'admin' && (
                <TabsContent value="manage-bookings">
                  <BookingsList />
                </TabsContent>
              )}
              
              {/* Admin: Contact Messages Tab */}
              {user?.role === 'admin' && (
                <TabsContent value="manage-contacts">
                  <ContactsList />
                </TabsContent>
              )}
              
              {/* Admin: Manage Content Tab */}
              {user?.role === 'admin' && (
                <TabsContent value="manage-content">
                  <Tabs defaultValue="blog">
                    <TabsList className="mb-4">
                      <TabsTrigger value="blog">Blog</TabsTrigger>
                      <TabsTrigger value="gallery">Gallery</TabsTrigger>
                      <TabsTrigger value="products">Products</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="blog">
                      <BlogManagement />
                    </TabsContent>
                    
                    <TabsContent value="gallery">
                      <GalleryManagement />
                    </TabsContent>
                    
                    <TabsContent value="products">
                      <ProductManagement />
                    </TabsContent>
                  </Tabs>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
}