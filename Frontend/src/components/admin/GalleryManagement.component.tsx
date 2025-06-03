import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, Image, Upload, X } from "lucide-react";
import axios from "axios";

const categories = [
  { value: 'weddings', label: 'Weddings' },
  { value: 'landscapes', label: 'Landscapes' },
  { value: 'wildlife', label: 'Wildlife' },
  { value: 'portraits', label: 'Portraits' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'graduations', label: 'Graduations' },
];

export default function GalleryManagement() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentGallery, setCurrentGallery] = useState(null);
  const [photosDialogOpen, setPhotosDialogOpen] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [photoCaption, setPhotoCaption] = useState('');
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    coverImage: null,
    imageUrl: '',
    featured: false,
  });
  
  // Fetch galleries from API
  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        setLoading(true);
        // Use the API URL from environment variable
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${baseUrl}/api/gallery`);
        setGalleries(response.data);
      } catch (error) {
        console.error('Error fetching galleries:', error);
        toast({
          title: "Error",
          description: "Failed to load galleries",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchGalleries();
  }, []);
  
  // Fetch photos for a specific gallery
  const fetchGalleryPhotos = async (galleryId) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${baseUrl}/api/gallery/${galleryId}`);
      if (response.data && response.data.photos) {
        setGalleryPhotos(response.data.photos);
      } else {
        setGalleryPhotos([]);
      }
    } catch (error) {
      console.error('Error fetching gallery photos:', error);
      setGalleryPhotos([]);
    }
  };
  
  const handleFormChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  const handleCategoryChange = (value) => {
    setFormData({ ...formData, category: value });
  };
  
  const handlePhotoFilesChange = (e) => {
    if (e.target.files) {
      // Convert FileList to Array for easier manipulation
      const filesArray = Array.from(e.target.files);
      setPhotoFiles(filesArray);
    }
  };
  
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      coverImage: null,
      imageUrl: '',
      featured: false,
    });
    setCurrentGallery(null);
    setEditMode(false);
  };
  
  const editGallery = (gallery) => {
    setCurrentGallery(gallery);
    setFormData({
      title: gallery.title,
      description: gallery.description,
      category: gallery.category,
      coverImage: null,
      imageUrl: gallery.coverImage || '',
      featured: gallery.featured,
    });
    setEditMode(true);
    setDialogOpen(true);
  };
  
  const managePhotos = async (gallery) => {
    setSelectedGallery(gallery);
    await fetchGalleryPhotos(gallery._id);
    setPhotosDialogOpen(true);
  };
  
  // Create or update gallery
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const formDataToSend = new FormData();
      
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('featured', formData.featured.toString());
      
      if (formData.coverImage) {
        formDataToSend.append('coverImage', formData.coverImage);
      } else if (formData.imageUrl) {
        formDataToSend.append('imageUrl', formData.imageUrl);
      }
      
      let response;
      
      if (editMode) {
        // Update existing gallery
        response = await axios.put(
          `${baseUrl}/api/gallery/${currentGallery._id}`, 
          formDataToSend, 
          { headers: { 'Content-Type': 'multipart/form-data' }}
        );
        
        // Update galleries list with updated gallery
        setGalleries(galleries.map(g => g._id === currentGallery._id ? response.data : g));
        
        toast({
          title: "Gallery updated",
          description: "The gallery has been updated successfully",
        });
      } else {
        // Create new gallery
        response = await axios.post(
          `${baseUrl}/api/gallery`, 
          formDataToSend, 
          { headers: { 'Content-Type': 'multipart/form-data' }}
        );
        
        // Add new gallery to galleries list
        setGalleries([response.data, ...galleries]);
        
        toast({
          title: "Gallery created",
          description: "The gallery has been created successfully",
        });
      }
      
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving gallery:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save gallery",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Upload photos to gallery
  const handleUploadPhotos = async () => {
    if (!selectedGallery || photoFiles.length === 0) return;
    
    setUploadingPhotos(true);
    
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      // Upload each photo
      for (const file of photoFiles) {
        const formDataToSend = new FormData();
        formDataToSend.append('image', file);
        formDataToSend.append('caption', photoCaption || file.name);
        
        await axios.post(
          `${baseUrl}/api/gallery/${selectedGallery._id}/photos`, 
          formDataToSend, 
          { headers: { 'Content-Type': 'multipart/form-data' }}
        );
      }
      
      // Refresh the gallery photos
      await fetchGalleryPhotos(selectedGallery._id);
      
      // Update the photoCount in the gallery list
      setGalleries(galleries.map(g => {
        if (g._id === selectedGallery._id) {
          return { ...g, photoCount: (g.photoCount || 0) + photoFiles.length };
        }
        return g;
      }));
      
      // Reset the form
      setPhotoFiles([]);
      setPhotoCaption('');
      
      toast({
        title: "Photos uploaded",
        description: `${photoFiles.length} photos have been uploaded successfully`,
      });
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to upload photos",
        variant: "destructive"
      });
    } finally {
      setUploadingPhotos(false);
    }
  };
  
  // Delete a photo
  const deletePhoto = async (photoId) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;
    
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.delete(`${baseUrl}/api/gallery/photos/${photoId}`);
      
      // Remove the photo from the list
      setGalleryPhotos(galleryPhotos.filter(photo => photo._id !== photoId));
      
      // Update the photoCount in the gallery list
      setGalleries(galleries.map(g => {
        if (g._id === selectedGallery._id) {
          return { ...g, photoCount: Math.max(0, (g.photoCount || 0) - 1) };
        }
        return g;
      }));
      
      toast({
        title: "Photo deleted",
        description: "The photo has been deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete photo",
        variant: "destructive"
      });
    }
  };
  
  // Delete a gallery
  const deleteGallery = async (id) => {
    if (!window.confirm("Are you sure you want to delete this gallery? All photos in this gallery will also be deleted.")) return;
    
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.delete(`${baseUrl}/api/gallery/${id}`);
      
      // Remove the gallery from the list
      setGalleries(galleries.filter(gallery => gallery._id !== id));
      
      toast({
        title: "Gallery deleted",
        description: "The gallery and all its photos have been deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting gallery:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete gallery",
        variant: "destructive"
      });
    }
  };
  
  if (loading && galleries.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  // Helper function to get proper image URL
  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${path.startsWith('/') ? '' : '/'}${path}`;
  };
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gallery Management</CardTitle>
            <CardDescription>Create and manage your photography galleries</CardDescription>
          </div>
          <Button onClick={() => {
            resetForm();
            setDialogOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-1" />
            Create Gallery
          </Button>
        </CardHeader>
        <CardContent>
          {galleries.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gallery</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photos</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {galleries.map((gallery) => (
                    <tr key={gallery._id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img 
                              className="h-10 w-10 rounded-md object-cover" 
                              src={getImageUrl(gallery.coverImage)} 
                              alt={gallery.title}
                              onError={(e) => {
                                e.currentTarget.src = "https://placehold.co/100x100?text=No+Image";
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{gallery.title}</div>
                            <div className="text-xs text-gray-500">{gallery.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {gallery.category.charAt(0).toUpperCase() + gallery.category.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {gallery.photoCount || 0} photos
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${gallery.featured ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                          {gallery.featured ? 'Featured' : 'Regular'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => managePhotos(gallery)}
                            title="Manage Photos"
                          >
                            <Image className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => editGallery(gallery)}
                            title="Edit Gallery"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => deleteGallery(gallery._id)}
                            title="Delete Gallery"
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
              No galleries found. Click "Create Gallery" to add one.
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Gallery Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editMode ? 'Edit Gallery' : 'Create New Gallery'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="title">Gallery Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
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
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image</Label>
                <Input
                  id="coverImage"
                  name="coverImage"
                  type="file"
                  accept="image/*"
                  onChange={handleFormChange}
                />
                {formData.imageUrl && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">Current cover image:</p>
                    <img 
                      src={getImageUrl(formData.imageUrl)}
                      alt="Cover"
                      className="mt-1 h-20 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/200x100?text=No+Image";
                      }}
                    />
                  </div>
                )}
                {!formData.coverImage && !editMode && (
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
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({...formData, featured: checked})}
                />
                <Label htmlFor="featured">Featured gallery</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => {
                resetForm();
                setDialogOpen(false);
              }}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {editMode ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  editMode ? 'Update Gallery' : 'Create Gallery'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Photos Management Dialog */}
      {selectedGallery && (
        <Dialog open={photosDialogOpen} onOpenChange={setPhotosDialogOpen}>
          <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Manage Photos: {selectedGallery.title}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="mb-6 p-4 border rounded-lg">
                <h3 className="text-lg font-medium mb-4">Upload New Photos</h3>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="photos">Select Photos (max 6 per gallery)</Label>
                    <Input
                      id="photos"
                      name="photos"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoFilesChange}
                      disabled={galleryPhotos.length >= 6 || uploadingPhotos}
                    />
                    {galleryPhotos.length >= 6 && (
                      <p className="text-amber-500 text-xs mt-1">
                        Maximum 6 photos per gallery reached. Delete some photos to add more.
                      </p>
                    )}
                  </div>
                  {photoFiles.length > 0 && (
                    <>
                      <div>
                        <Label htmlFor="caption">Caption (optional - applies to all uploads)</Label>
                        <Input
                          id="caption"
                          value={photoCaption}
                          onChange={(e) => setPhotoCaption(e.target.value)}
                          placeholder="Describe these photos"
                        />
                      </div>
                      <div className="flex items-center">
                        <p className="text-sm mr-4">{photoFiles.length} file(s) selected</p>
                        <Button 
                          variant="default" 
                          onClick={handleUploadPhotos} 
                          disabled={uploadingPhotos || galleryPhotos.length >= 6}
                        >
                          {uploadingPhotos ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Photos
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="ml-2" 
                          onClick={() => setPhotoFiles([])}
                          disabled={uploadingPhotos}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Clear
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <h3 className="text-lg font-medium mb-4">Gallery Photos ({galleryPhotos.length}/6)</h3>
              
              {galleryPhotos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryPhotos.map((photo) => (
                    <div key={photo._id} className="relative group rounded-md overflow-hidden">
                      <img 
                        src={getImageUrl(photo.src)}
                        alt={photo.caption || 'Gallery photo'}
                        className="w-full aspect-square object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://placehold.co/300x300?text=No+Image";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                        {photo.caption && (
                          <p className="text-white text-sm">{photo.caption}</p>
                        )}
                        <div className="flex justify-end">
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => deletePhoto(photo._id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 border rounded-lg">
                  No photos in this gallery. Upload some photos using the form above.
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setPhotosDialogOpen(false)}>
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}