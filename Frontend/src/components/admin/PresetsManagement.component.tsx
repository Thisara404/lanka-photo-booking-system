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
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";

const samplePresets = [
  {
    _id: '1',
    name: 'Mountain Gold Preset',
    description: 'Perfect for landscape photography, enhances golden hour tones.',
    price: 5000,
    featured: true,
    inStock: true,
    image: '/lovable-uploads/f9ad0a4e-56d0-46ac-b989-b1f92766dd89.png'
  },
  {
    _id: '2',
    name: 'Sri Lanka Portrait Collection',
    description: 'A set of 5 presets designed for portrait photography in tropical settings.',
    price: 7500,
    featured: false,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&q=80'
  }
];

export default function PresetsManagement() {
  const [presets, setPresets] = useState(samplePresets);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPreset, setCurrentPreset] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
    imageUrl: '',
    featured: false,
    inStock: true,
    downloadLink: ''
  });
  const { toast } = useToast();
  
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
  
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: null,
      imageUrl: '',
      featured: false,
      inStock: true,
      downloadLink: ''
    });
    setCurrentPreset(null);
    setEditMode(false);
  };
  
  const editPreset = (preset) => {
    setCurrentPreset(preset);
    setFormData({
      name: preset.name,
      description: preset.description,
      price: preset.price.toString(),
      image: null,
      imageUrl: preset.image || '',
      featured: preset.featured,
      inStock: preset.inStock,
      downloadLink: preset.downloadLink || ''
    });
    setEditMode(true);
    setDialogOpen(true);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: editMode ? "Preset updated" : "Preset created",
      description: `The preset has been ${editMode ? 'updated' : 'added'} successfully.`,
    });
    setDialogOpen(false);
    resetForm();
  };
  
  const deletePreset = (id) => {
    if (window.confirm("Are you sure you want to delete this preset?")) {
      setPresets(presets.filter(preset => preset._id !== id));
      toast({
        title: "Preset deleted",
        description: "The preset has been deleted successfully.",
      });
    }
  };
  
  if (loading) {
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
            <CardTitle>Presets Management</CardTitle>
            <CardDescription>Add or edit your photography presets</CardDescription>
          </div>
          <Button onClick={() => {
            resetForm();
            setDialogOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-1" />
            Add Preset
          </Button>
        </CardHeader>
        <CardContent>
          {presets.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preset</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {presets.map((preset) => (
                    <tr key={preset._id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-md object-cover" src={preset.image} alt={preset.name} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{preset.name}</div>
                            <div className="text-sm text-gray-500">{preset.description.substring(0, 50)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">LKR {preset.price.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${preset.featured ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                            {preset.featured ? 'Featured' : 'Regular'}
                          </span>
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${preset.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {preset.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => editPreset(preset)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => deletePreset(preset._id)}
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
              No presets found. Click "Add Preset" to create one.
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Preset Form Dialog */}
      <Dialog open={dialogOpen} onValueChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editMode ? 'Edit Preset' : 'Add New Preset'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="name">Preset Name</Label>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (LKR)</Label>
                  <Input
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    placeholder="e.g. 5000"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="downloadLink">Download Link</Label>
                  <Input
                    id="downloadLink"
                    name="downloadLink"
                    value={formData.downloadLink}
                    onChange={handleFormChange}
                    placeholder="e.g. https://example.com/download"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Preset Image</Label>
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
                      src={formData.imageUrl}
                      alt="Preset preview"
                      className="mt-1 h-20 object-cover rounded"
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
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({...formData, featured: checked})}
                />
                <Label htmlFor="featured">Featured preset</Label>
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
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => {
                resetForm();
                setDialogOpen(false);
              }}>
                Cancel
              </Button>
              <Button type="submit">
                {editMode ? 'Update Preset' : 'Add Preset'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}