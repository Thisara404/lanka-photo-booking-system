import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SectionTitle from "@/components/SectionTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import api from "@/api";

// Replace the hardcoded blog posts with state and fetching
const Blog = () => {
  // Keep existing state variables
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Add categories state if needed
  const categories = [
    { id: "all", name: "All Posts" },
    { id: "camera-basics", name: "Camera Basics" },
    { id: "composition", name: "Composition" },
    { id: "editing", name: "Photo Editing" },
    { id: "tips", name: "Photography Tips" },
    { id: "uncategorized", name: "Uncategorized" }
  ];
  
  // Fetch blogs when component mounts
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/blog');
        console.log("Fetched blogs:", response.data);
        
        // Transform API response to match expected format
        const processedBlogs = response.data.map(blog => ({
          id: blog.slug,
          title: blog.title,
          excerpt: blog.excerpt,
          content: blog.content,
          category: blog.category || 'uncategorized',
          date: new Date(blog.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          readTime: blog.readTime || '5 min read',
          author: blog.author || 'Chamodya Kodagoda',
          image: blog.image.startsWith('http') 
            ? blog.image 
            : blog.image.startsWith('/') 
              ? `http://localhost:5000${blog.image}` 
              : `http://localhost:5000/${blog.image}`
        }));
        
        setBlogPosts(processedBlogs);
        setError(null);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blog posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, []);
  
  const filteredPosts = blogPosts.filter(post => {
    // Filter by category
    const categoryMatch = selectedCategory === "all" || post.category === selectedCategory;
    
    // Filter by search term
    const searchMatch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    return categoryMatch && searchMatch;
  });
  
  // Add loading and error states to your rendering:
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4">Loading blog posts...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">Try Again</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative h-72 bg-black">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80)" }}
        ></div>
        <div className="relative z-10 container mx-auto h-full flex items-center px-4">
          <div>
            <h1 className="font-montserrat text-4xl md:text-5xl text-white font-light tracking-widest uppercase mb-4">
              Photography Blog
            </h1>
            <p className="text-white/80 max-w-2xl">
              Tips, tutorials, and insights to help you improve your photography skills.
              Learn from my experience and take your photos to the next level.
            </p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between mb-10">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6 md:mb-0">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                size="sm"
              >
                {category.name}
              </Button>
            ))}
          </div>
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        
        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <div key={post.id} className="group flex flex-col bg-card rounded-lg overflow-hidden border border-border hover-lift">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    console.warn(`Image failed to load: ${post.image}`);
                    e.currentTarget.src = "https://placehold.co/600x400?text=Photography+Blog";
                  }}
                />
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <div className="mb-2">
                  <span className="text-xs text-primary font-medium">
                    {categories.find(cat => cat.id === post.category)?.name}
                  </span>
                </div>
                
                <h2 className="font-montserrat text-xl font-light tracking-wider uppercase mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-muted-foreground text-sm mb-4 flex-1">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div className="text-xs text-muted-foreground">
                    {post.date} · {post.readTime}
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link to={`/blog/${post.id}`}>Read More</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Empty state */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-montserrat font-light tracking-wider uppercase mb-2">No Articles Found</h3>
            <p className="text-muted-foreground">
              Try changing your search term or selecting a different category.
            </p>
            <Button 
              className="mt-4" 
              onClick={() => {
                setSelectedCategory("all");
                setSearchTerm("");
              }}
            >
              View All Posts
            </Button>
          </div>
        )}
        
        {/* Newsletter */}
        <div className="mt-20 bg-card rounded-lg p-8 border border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left md:max-w-lg">
              <h3 className="font-montserrat text-2xl md:text-3xl tracking-widest uppercase font-light mb-4">
                Subscribe to the Newsletter
              </h3>
              <p className="text-muted-foreground">
                Get photography tips, tutorials, and inspiration delivered straight to your inbox.
                No spam, just valuable content to help you improve your photography skills.
              </p>
            </div>
            
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              <Input placeholder="Your email address" className="min-w-[250px]" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
