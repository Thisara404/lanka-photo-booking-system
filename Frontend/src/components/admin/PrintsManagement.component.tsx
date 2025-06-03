import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useToast } from '../../components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Switch } from '../../components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import PrintStats from './PrintStats.component';

const categoryOptions = [
  { value: 'landscapes', label: 'Landscapes' },
  { value: 'wildlife', label: 'Wildlife' },
  { value: 'coastal', label: 'Coastal' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'other', label: 'Other' }
];

// Add this helper function near the top of your file, before the PrintsManagement component
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

export default function PrintsManagement() {
  const [prints, setPrints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPrint, setCurrentPrint] = useState(null);
  const [newSize, setNewSize] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
    imageUrl: '',
    highResFile: null,
    category: 'landscapes',
    featured: false,
    inStock: true,
    printSizes: []
  });
  const { toast } = useToast();
  
  useEffect(() => {
    fetchPrints();
  }, []);
  
  const fetchPrints = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/prints/admin/all');
      setPrints(response.data);
    } catch (error) {
      console.error('Error fetching prints:', error);
      toast({
        title: "Error",
        description: "Failed to fetch prints. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleFormChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (name === 'price') {
      setFormData({ ...formData, [name]: value.replace(/[^0-9]/g, '') });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  const handleCategoryChange = (value) => {
    setFormData({ ...formData, category: value });
  };
  
  const handleAddSize = () => {
    if (newSize.trim() && !formData.printSizes.includes(newSize.trim())) {
      setFormData({
        ...formData, 
        printSizes: [...formData.printSizes, newSize.trim()]
      });
      setNewSize('');
    }
  };
  
  const handleRemoveSize = (size) => {
    setFormData({
      ...formData,
      printSizes: formData.printSizes.filter(s => s !== size)
    });
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: null,
      imageUrl: '',
      highResFile: null,
      category: 'landscapes',
      featured: false,
      inStock: true,
      printSizes: []
    });
    setNewSize('');
    setCurrentPrint(null);
    setEditMode(false);
  };
  
  const editPrint = (print) => {
    setCurrentPrint(print);
    setFormData({
      name: print.name,
      description: print.description,
      price: print.price.toString(),
      image: null,
      imageUrl: print.image || '',
      highResFile: null,
      category: print.category || 'landscapes',
      featured: print.featured,
      inStock: print.inStock,
      printSizes: [...print.printSizes]
    });
    setEditMode(true);
    setDialogOpen(true);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Create FormData object for file uploads
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('description', formData.description);
      formDataObj.append('price', formData.price);
      formDataObj.append('category', formData.category);
      formDataObj.append('printSizes', JSON.stringify(formData.printSizes));
      formDataObj.append('featured', formData.featured.toString());
      formDataObj.append('inStock', formData.inStock.toString());
      
      // Only append files if they exist
      if (formData.image) {
        formDataObj.append('image', formData.image);
      } else if (formData.imageUrl) {
        formDataObj.append('imageUrl', formData.imageUrl);
      }
      
      if (formData.highResFile) {
        formDataObj.append('highResFile', formData.highResFile);
      }
      
      // Debug formData
      console.log("Form data being sent:");
      for (let [key, value] of formDataObj.entries()) {
        console.log(key, value instanceof File ? value.name : value);
      }
      
      let response;
      
      if (editMode) {
        response = await api.put(`/api/prints/${currentPrint._id}`, formDataObj, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        toast({
          title: "Print updated",
          description: "The print has been updated successfully.",
        });
      } else {
        response = await api.post('/api/prints', formDataObj, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        toast({
          title: "Print created",
          description: "The print has been added successfully.",
        });
      }
      
      // Refresh prints list
      fetchPrints();
      
      // Close dialog and reset form
      setDialogOpen(false);
      resetForm();
      
    } catch (error) {
      console.error('Error saving print:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save print. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const deletePrint = async (id) => {
    if (window.confirm("Are you sure you want to delete this print?")) {
      try {
        setLoading(true);
        await api.delete(`/api/prints/${id}`);
        
        // Update local state
        setPrints(prints.filter(print => print._id !== id));
        
        toast({
          title: "Print deleted",
          description: "The print has been deleted successfully.",
        });
      } catch (error) {
        console.error('Error deleting print:', error);
        toast({
          title: "Error",
          description: "Failed to delete print. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
  };
  
  if (loading && prints.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Prints Management</CardTitle>
            <CardDescription>Add or edit your photography prints</CardDescription>
          </div>
          <Button onClick={() => {
            resetForm();
            setDialogOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-1" />
            Add Print
          </Button>
        </CardHeader>
        <CardContent>
          {prints.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Print</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sizes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {prints.map((print) => (
                    <tr key={print._id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img 
                              className="h-10 w-10 rounded-md object-cover" 
                              src={formatImagePath(print.image)} 
                              alt={print.name} 
                              onError={(e) => {
                                e.currentTarget.src = "https://placehold.co/600x400?text=No+Image";
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{print.name}</div>
                            <div className="text-sm text-gray-500">
                              {print.description.length > 50 
                                ? print.description.substring(0, 50) + "..." 
                                : print.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">LKR {print.price.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {print.category.charAt(0).toUpperCase() + print.category.slice(1)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {print.printSizes.map((size, index) => (
                            <Badge key={index} variant="outline">{size}</Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${print.featured ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                            {print.featured ? 'Featured' : 'Not Featured'}
                          </span>
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${print.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {print.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                          {print.highResDownloadUrl && (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              Downloadable
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => editPrint(print)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => deletePrint(print._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No prints found. Click "Add Print" to create one.
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Print Stats Component */}
      <PrintStats />
      
      {/* Print Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{editMode ? 'Edit Print' : 'Add New Print'}</DialogTitle>
          </DialogHeader>
          
          {/* Add ScrollArea to make the form scrollable */}
          <ScrollArea className="h-[70vh] pr-4">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="name">Print Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price (LKR)</Label>
                  <Input
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    placeholder="e.g. 18000"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Print Sizes</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.printSizes.map((size, index) => (
                      <Badge key={index} className="flex items-center">
                        {size}
                        <button
                          type="button"
                          onClick={() => handleRemoveSize(size)}
                          className="ml-2 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Input
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      placeholder="Enter size (e.g. 8x10)"
                      className="flex-grow"
                    />
                    <Button type="button" size="sm" onClick={handleAddSize}>Add Size</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Print Image</Label>
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFormChange}
                  />
                  {formData.imageUrl && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">Current image:</p>
                      <img 
                        src={formatImagePath(formData.imageUrl)}
                        alt="Print preview"
                        className="mt-1 h-20 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = "https://placehold.co/600x400?text=No+Image";
                        }}
                      />
                    </div>
                  )}
                  {!formData.image && !editMode && (
                    <div>
                      <Label htmlFor="imageUrl">Or enter image URL</Label>
                      <Input
                        id="imageUrl"
                        name="imageUrl"
                        type="url"
                        value={formData.imageUrl}
                        onChange={handleFormChange}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="highResFile">High-Resolution File for Download</Label>
                  <Input
                    id="highResFile"
                    name="highResFile"
                    type="file"
                    accept="image/*"
                    onChange={handleFormChange}
                  />
                  {editMode && currentPrint?.highResDownloadUrl && (
                    <p className="text-xs text-green-600">
                      High-resolution file already uploaded
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    This is the file customers will download after purchase. It should be in high resolution.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({...formData, featured: checked})}
                  />
                  <Label htmlFor="featured">Featured print</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="inStock"
                    name="inStock"
                    checked={formData.inStock}
                    onCheckedChange={(checked) => setFormData({...formData, inStock: checked})}
                  />
                  <Label htmlFor="inStock">In stock</Label>
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button variant="outline" type="button" onClick={() => {
                  resetForm();
                  setDialogOpen(false);
                }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editMode ? 'Update Print' : 'Add Print'}
                </Button>
              </DialogFooter>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}