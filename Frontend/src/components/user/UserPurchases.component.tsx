import React, { useState, useEffect } from 'react';
import { PrintService } from '../../services/print.service';
import { useToast } from '../../hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Loader2, Download, FileImage } from 'lucide-react';
import { format } from 'date-fns';
import { Pagination } from '../../components/ui/pagination';
import { formatImagePath } from '../../utils/image-helpers';

const UserPurchases = () => {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<{[key: string]: boolean}>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const { toast } = useToast();
  
  useEffect(() => {
    fetchPurchases(1);
  }, []);
  
  const fetchPurchases = async (page: number) => {
    try {
      setLoading(true);
      const response = await PrintService.getPurchaseHistory(page);
      console.log('Purchase history response:', response);
      
      if (response.success) {
        setPurchases(response.data.purchases || []);
        setCurrentPage(response.data.pagination?.current || 1);
        setTotalPages(response.data.pagination?.total || 1);
      } else {
        throw new Error('Failed to fetch purchases');
      }
    } catch (error) {
      console.error('Error fetching purchases:', error);
      toast({
        title: "Error",
        description: "Failed to load your purchases. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handlePageChange = (page: number) => {
    fetchPurchases(page);
  };
  
  const downloadPrint = async (downloadLink: string, printName: string, purchaseId: string) => {
    try {
      setDownloading(prev => ({ ...prev, [purchaseId]: true }));
      
      // Extract token from the download link
      const token = downloadLink.split('/').pop();
      
      if (!token) {
        throw new Error('Invalid download link');
      }
      
      // Use fetch with proper auth header
      const response = await fetch(`/api/prints/download/${token}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        console.error('Download error status:', response.status);
        throw new Error('Download failed with status: ' + response.status);
      }
      
      // Get the blob from the response
      const blob = await response.blob();
      
      // Check if the blob is valid
      if (blob.size === 0) {
        throw new Error('Downloaded file is empty');
      }
      
      console.log('Download blob:', { 
        type: blob.type, 
        size: (blob.size / 1024).toFixed(2) + ' KB' 
      });
      
      // Create object URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const a = document.createElement('a');
      a.href = url;
      a.download = `${printName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
      document.body.appendChild(a);
      
      // Click the link to trigger the download
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download started",
        description: "Your print is being downloaded."
      });
      
      // Refresh the purchases to update the download count
      setTimeout(() => {
        fetchPurchases(currentPage);
      }, 1000); // Refresh after a small delay
      
    } catch (error) {
      console.error('Error downloading print:', error);
      toast({
        title: "Download failed",
        description: "There was a problem downloading your print. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDownloading(prev => ({ ...prev, [purchaseId]: false }));
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  if (loading && purchases.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (purchases.length === 0) {
    return (
      <div className="text-center py-12">
        <FileImage className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No purchases yet</h3>
        <p className="text-muted-foreground mb-4">
          You haven't purchased any prints yet.
        </p>
        <Button asChild>
          <a href="/prints">Browse Prints</a>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Your Print Purchases</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {purchases.map((purchase) => (
          <Card key={purchase._id} className="overflow-hidden">
            <div className="aspect-square relative rounded-t-md overflow-hidden">
              <img 
                src={formatImagePath(purchase.printId?.image)} 
                alt={purchase.printId?.name || 'Print'}
                className="object-cover w-full h-full"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/600x400?text=No+Image";
                  console.warn(`Failed to load image: ${purchase.printId?.image}`);
                }}
              />
              {purchase.printId?.category && (
                <Badge className="absolute top-2 right-2">{purchase.printId.category}</Badge>
              )}
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{purchase.printId?.name || 'Print'}</CardTitle>
              <CardDescription>
                Purchased on {formatDate(purchase.createdAt)}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline">{purchase.selectedSize}</Badge>
                {purchase.frameOption !== 'None' && (
                  <Badge variant="secondary">{purchase.frameOption}</Badge>
                )}
              </div>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-medium">LKR {purchase.amount?.toLocaleString() || '0'}</span>
                </div>
                {purchase.downloadCount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Downloads:</span>
                    <span className="font-medium">{purchase.downloadCount}</span>
                  </div>
                )}
                {purchase.downloadExpiry && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expires:</span>
                    <span className="font-medium">{formatDate(purchase.downloadExpiry)}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              {purchase.downloadLink ? (
                <Button 
                  className="w-full" 
                  onClick={() => downloadPrint(
                    purchase.downloadLink, 
                    purchase.printId?.name || 'print', 
                    purchase._id
                  )}
                  disabled={downloading[purchase._id]}
                >
                  {downloading[purchase._id] ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" /> Download High-Res Image
                    </>
                  )}
                </Button>
              ) : (
                <p className="text-xs text-muted-foreground text-center w-full">
                  Physical print only - no download available
                </p>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        </div>
      )}
    </div>
  );
};

export default UserPurchases;