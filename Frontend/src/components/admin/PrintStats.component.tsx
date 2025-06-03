import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Loader2, BarChart, Download, Eye, RefreshCcw } from 'lucide-react';
import api from '../../api';
import { useToast } from '../../hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { format } from 'date-fns';

interface PrintStat {
  _id: string;
  name: string;
  image: string;
  price: number;
  salesCount: number;
  downloadCount: number;
  category: string;
}

interface PrintPurchase {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  amount: number;
  status: string;
  selectedSize: string;
  frameOption: string;
  downloadLink?: string;
  downloadExpiry?: string;
  createdAt: string;
  downloadCount: number;
  paymentDetails: {
    captureId: string;
    paymentMethod: string;
    paymentTimestamp: string;
  };
}

const formatImagePath = (imagePath) => {
  if (!imagePath) return "https://placehold.co/600x400?text=No+Image";
  
  // If it's already a complete URL (starts with http:// or https://)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If path begins with /uploads/
  if (imagePath.startsWith('/uploads/')) {
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${imagePath}`;
  }
  
  // For other relative paths
  return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/prints/${imagePath}`;
};

const PrintStats = () => {
  const [prints, setPrints] = useState<PrintStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailDialog, setDetailDialog] = useState(false);
  const [selectedPrint, setSelectedPrint] = useState<string | null>(null);
  const [purchases, setPurchases] = useState<PrintPurchase[]>([]);
  const [loadingPurchases, setLoadingPurchases] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchPrintStats();
  }, []);
  
  const fetchPrintStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/prints/admin/stats');
      setPrints(response.data);
    } catch (error) {
      console.error('Error fetching print stats:', error);
      toast({
        title: "Error",
        description: "Failed to load print statistics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchPrintPurchases = async (printId: string) => {
    try {
      setLoadingPurchases(true);
      const response = await api.get(`/api/prints/admin/purchases/${printId}`);
      setPurchases(response.data);
      setDetailDialog(true);
    } catch (error) {
      console.error('Error fetching print purchases:', error);
      toast({
        title: "Error",
        description: "Failed to load purchase details",
        variant: "destructive"
      });
    } finally {
      setLoadingPurchases(false);
    }
  };
  
  const showDetails = (printId: string) => {
    setSelectedPrint(printId);
    fetchPrintPurchases(printId);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'PPpp'); // 'Mar 15, 2023, 2:30 PM'
  };
  
  // Add a refresh function to the component
  const refreshStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/prints/admin/stats');
      setPrints(response.data);
      toast({
        title: "Statistics refreshed",
        description: "The latest sales and download data has been loaded."
      });
    } catch (error) {
      console.error('Error refreshing print stats:', error);
      toast({
        title: "Error",
        description: "Failed to refresh statistics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <>
      <Card className="mt-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Print Sales & Downloads</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshStats}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCcw className="h-4 w-4 mr-2" />}
              Refresh
            </Button>
          </div>
          <CardDescription>
            Track sales and downloads of your photography prints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left">Print</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-right">Sales</th>
                  <th className="px-4 py-3 text-right">Downloads</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {prints.length > 0 ? (
                  prints.map((print) => (
                    <tr key={print._id} className="border-b hover:bg-muted/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded overflow-hidden">
                            <img 
                              src={formatImagePath(print.image)} 
                              alt={print.name} 
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "https://placehold.co/600x400?text=No+Image";
                                console.warn("Failed to load image:", print.image);
                              }}
                            />
                          </div>
                          <span className="font-medium">{print.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{print.category}</td>
                      <td className="px-4 py-3">LKR {print.price.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">{print.salesCount}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="flex items-center justify-end">
                          <Download className="h-4 w-4 mr-1" /> 
                          {print.downloadCount}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => showDetails(print._id)}
                          disabled={loadingPurchases && selectedPrint === print._id}
                        >
                          {loadingPurchases && selectedPrint === print._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" /> 
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No prints found with sales or downloads.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={detailDialog} onOpenChange={setDetailDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Purchase Details</DialogTitle>
            <DialogDescription>
              Showing all purchases and downloads for this print
            </DialogDescription>
          </DialogHeader>
          
          {loadingPurchases ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              {purchases.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left">Customer</th>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Size</th>
                        <th className="px-4 py-2 text-left">Frame</th>
                        <th className="px-4 py-2 text-right">Amount</th>
                        <th className="px-4 py-2 text-right">Downloads</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchases.map((purchase) => (
                        <tr key={purchase._id} className="border-b">
                          <td className="px-4 py-2">
                            <div>
                              <div className="font-medium">{purchase.userId.name}</div>
                              <div className="text-xs text-muted-foreground">{purchase.userId.email}</div>
                            </div>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {formatDate(purchase.createdAt)}
                          </td>
                          <td className="px-4 py-2">{purchase.selectedSize}</td>
                          <td className="px-4 py-2">{purchase.frameOption}</td>
                          <td className="px-4 py-2 text-right">LKR {purchase.amount.toLocaleString()}</td>
                          <td className="px-4 py-2 text-right">
                            {purchase.downloadCount || 0}
                            {purchase.downloadLink && (
                              <div className="text-xs text-primary">
                                {purchase.downloadExpiry && 
                                  `Expires: ${formatDate(purchase.downloadExpiry)}`}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No purchase records found for this print.
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PrintStats;