import { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { BarChart, LineChart, PieChart, Activity, Users, ShoppingCart, Mail, Calendar, Image, BookOpen, Package } from "lucide-react";

// Admin components (to be created)
import PresetsManagement from "@/components/admin/PresetsManagement.component";
import PrintsManagement from "@/components/admin/PrintsManagement.component";
import GalleryManagement from "@/components/admin/GalleryManagement.component";
import BlogManagement from "@/components/admin/BlogManagement.component";
import StatisticsPanel from "@/components/admin/StatisticsPanel.component";
import ContactsList from "@/components/admin/ContactsList.component";
import BookingsList from "@/components/admin/BookingsList.component";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Protect this route - only admin users should access it
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-7 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="prints">Prints</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>
          
          {/* Overview/Statistics Tab */}
          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">LKR 45,231</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+138</div>
                  <p className="text-xs text-muted-foreground">+12.4% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+7</div>
                  <p className="text-xs text-muted-foreground">For this week</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Blog Views</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,345</div>
                  <p className="text-xs text-muted-foreground">+18.2% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Preset Downloads</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">321</div>
                  <p className="text-xs text-muted-foreground">+5.3% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Print Orders</CardTitle>
                  <Image className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">42</div>
                  <p className="text-xs text-muted-foreground">+7.6% from last month</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8">
              <StatisticsPanel />
            </div>
          </TabsContent>
          
          {/* Presets Management Tab */}
          <TabsContent value="presets">
            <PresetsManagement />
          </TabsContent>
          
          {/* Prints Management Tab */}
          <TabsContent value="prints">
            <PrintsManagement />
          </TabsContent>
          
          {/* Gallery Management Tab */}
          <TabsContent value="gallery">
            <GalleryManagement />
          </TabsContent>
          
          {/* Blog Management Tab */}
          <TabsContent value="blog">
            <BlogManagement />
          </TabsContent>
          
          {/* Contact Messages Tab */}
          <TabsContent value="contacts">
            <ContactsList />
          </TabsContent>
          
          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <BookingsList />
          </TabsContent>
          
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;