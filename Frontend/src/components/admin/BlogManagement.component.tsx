import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import api from "@/api";

export default function BlogManagement() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    image: null,
    imageUrl: '',
    readTime: '',
    published: true
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchBlogs();
  }, []);
  
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/blog');
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast({
        title: "Error",
        description: "Failed to load blog posts.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleFormChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    } else if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Update the handleSubmit function to better handle errors
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.content) {
      toast({
        title: "Validation Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    // Ensure excerpt doesn't exceed 250 characters
    const excerptToUse = formData.excerpt 
      ? formData.excerpt.substring(0, 250) 
      : formData.content.substring(0, 240) + '...';

    try {
      setSubmitting(true);
      
      const data = new FormData();
      
      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          data.append('image', formData[key]);
        } else if (key === 'excerpt') {
          // Always use our sanitized excerpt
          data.append('excerpt', excerptToUse);
        } else if (key !== 'image') {
          // Convert boolean to string for FormData
          if (typeof formData[key] === 'boolean') {
            data.append(key, String(formData[key]));
          } else if (formData[key] !== null && formData[key] !== undefined) {
            data.append(key, formData[key]);
          }
        }
      });
      
      // Log data for debugging
      console.log('Submitting form data:', Object.fromEntries(data.entries()));
      
      let response;
      if (editMode && currentBlog?._id) {
        response = await api.put(`/api/blog/${currentBlog._id}`, data);
        setBlogs(blogs.map(blog => 
          blog._id === currentBlog._id ? response.data : blog
        ));
        toast({
          title: "Blog updated",
          description: "Blog post has been updated successfully.",
        });
      } else {
        response = await api.post('/api/blog', data);
        setBlogs([response.data, ...blogs]);
        toast({
          title: "Blog created",
          description: "Blog post has been created successfully.",
        });
      }
      
      resetForm();
      setDialogOpen(false);
    } catch (error) {
      console.error("Error saving blog:", error);
      toast({
        title: "Error",
        description: `Failed to ${editMode ? 'update' : 'create'} blog post: ${error.response?.data?.message || error.message}`,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const deleteBlog = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        await api.delete(`/blog/${id}`);
        setBlogs(blogs.filter(blog => blog._id !== id));
        toast({
          title: "Blog deleted",
          description: "Blog post has been deleted successfully.",
        });
      } catch (error) {
        console.error("Error deleting blog:", error);
        toast({
          title: "Error",
          description: "Failed to delete blog post.",
          variant: "destructive",
        });
      }
    }
  };
  
  const editBlog = (blog) => {
    setCurrentBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt || '',
      category: blog.category || '',
      image: null,
      imageUrl: blog.image || '',
      readTime: blog.readTime || '5 min read',
      published: blog.published
    });
    setEditMode(true);
    setDialogOpen(true);
  };
  
  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: '',
      image: null,
      imageUrl: '',
      readTime: '5 min read',
      published: true
    });
    setCurrentBlog(null);
    setEditMode(false);
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
            <CardTitle>Blog Posts</CardTitle>
            <CardDescription>Manage your blog content</CardDescription>
          </div>
          <Button onClick={() => {
            resetForm();
            setDialogOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-1" />
            New Post
          </Button>
        </CardHeader>
        <CardContent>
          {blogs.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {blogs.map((blog) => (
                    <tr key={blog._id}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                        <div className="text-xs text-gray-500">{blog.readTime}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{blog.category || "Uncategorized"}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${blog.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {blog.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => editBlog(blog)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => deleteBlog(blog._id)}
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
              No blog posts found. Click "New Post" to create one.
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Blog Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => {
        if (!open) resetForm();
        setDialogOpen(open);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editMode ? 'Edit Blog Post' : 'Create New Blog Post'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    placeholder="e.g. Photography Tips"
                  />
                </div>
                <div>
                  <Label htmlFor="readTime">Read Time</Label>
                  <Input
                    id="readTime"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleFormChange}
                    placeholder="e.g. 5 min read"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="excerpt">Excerpt (short summary - max 250 characters)</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleFormChange}
                  rows={2}
                  maxLength={250}
                />
                <div className="text-xs text-muted-foreground text-right mt-1">
                  {formData.excerpt ? formData.excerpt.length : 0}/250
                </div>
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleFormChange}
                  rows={8}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Cover Image</Label>
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
                      src={
                        formData.imageUrl.startsWith('http') 
                          ? formData.imageUrl 
                          : formData.imageUrl.startsWith('/') 
                            ? `http://localhost:5000${formData.imageUrl}` 
                            : `http://localhost:5000/${formData.imageUrl}`
                      }
                      alt="Blog cover"
                      className="mt-1 h-20 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/600x400?text=Image+Not+Found";
                        console.warn("Image failed to load:", formData.imageUrl);
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
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  name="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({...formData, published: checked})}
                />
                <Label htmlFor="published">Publish immediately</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => {
                resetForm();
                setDialogOpen(false);
              }}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {editMode ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  editMode ? 'Update Post' : 'Create Post'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}