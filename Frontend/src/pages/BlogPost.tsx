
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

// Sample blog posts data
const blogPostsData = {
  "camera-settings-101": {
    title: "Understanding Camera Settings: A Beginner's Guide",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80",
    category: "camera-basics",
    date: "April 15, 2023",
    readTime: "8 min read",
    author: "Chamodya Kodagoda",
    content: `
      <p class="mb-6">If you're new to photography, understanding the three core camera settings—aperture, shutter speed, and ISO—is essential to taking control of your images. These settings form what photographers call the "exposure triangle," and mastering them will help you create properly exposed photos in any lighting condition.</p>
      
      <h3 class="text-xl font-medium mb-4 mt-8">Aperture: Controlling Depth of Field</h3>
      <p class="mb-4">Aperture refers to the opening in your lens through which light passes. It's measured in f-stops (like f/2.8, f/4, f/8). The smaller the f-number, the larger the aperture opening, which means:</p>
      <ul class="list-disc pl-6 mb-6">
        <li class="mb-2">A large aperture (small f-number like f/1.8) creates a shallow depth of field, blurring the background while keeping your subject sharp—ideal for portraits.</li>
        <li class="mb-2">A small aperture (large f-number like f/16) keeps more of the image in focus from foreground to background—perfect for landscapes.</li>
      </ul>
      
      <h3 class="text-xl font-medium mb-4 mt-8">Shutter Speed: Freezing or Blurring Motion</h3>
      <p class="mb-4">Shutter speed determines how long your camera's sensor is exposed to light. It's measured in seconds or fractions of a second (like 1/50, 1/200, 1/1000). The effects of shutter speed include:</p>
      <ul class="list-disc pl-6 mb-6">
        <li class="mb-2">Fast shutter speeds (like 1/1000 second) freeze motion, perfect for sports or wildlife photography.</li>
        <li class="mb-2">Slow shutter speeds (like 1/15 second or longer) create motion blur, useful for conveying movement in waterfalls or night scenes.</li>
        <li class="mb-2">As a general rule, to avoid camera shake when hand-holding, use a shutter speed that's at least 1/focal length of your lens (e.g., at least 1/50 sec with a 50mm lens).</li>
      </ul>
      
      <h3 class="text-xl font-medium mb-4 mt-8">ISO: Adjusting Light Sensitivity</h3>
      <p class="mb-4">ISO measures your camera sensor's sensitivity to light. Higher ISO values allow you to shoot in darker conditions but can introduce noise (grain) to your images.</p>
      <ul class="list-disc pl-6 mb-6">
        <li class="mb-2">Low ISO (like 100 or 200) provides the highest image quality with minimal noise—ideal for bright conditions.</li>
        <li class="mb-2">High ISO (like 1600, 3200, or higher) lets you shoot in low light but may reduce image quality.</li>
        <li class="mb-2">Modern cameras perform much better at high ISOs than older models, so don't be afraid to experiment.</li>
      </ul>
      
      <h3 class="text-xl font-medium mb-4 mt-8">Putting It All Together</h3>
      <p class="mb-6">The key to mastering camera settings is understanding how these three elements work together. When you adjust one setting, you'll often need to compensate with another to maintain proper exposure:</p>
      <ul class="list-disc pl-6 mb-6">
        <li class="mb-2">If you want a shallower depth of field (lower f-number), you might need a faster shutter speed or lower ISO to avoid overexposure.</li>
        <li class="mb-2">If you need to freeze fast action (faster shutter speed), you might need a larger aperture or higher ISO to let in enough light.</li>
      </ul>
      
      <p class="mb-6">Start in Aperture Priority (A or Av) or Shutter Priority (S or Tv) modes to get comfortable with how changing one setting affects your images. With practice, you'll develop the intuition to quickly choose the right settings for any photographic situation.</p>
      
      <p>Remember, the technical aspects of photography are just tools to help you capture your creative vision. Don't be discouraged if it takes time to master these concepts—every great photographer started as a beginner.</p>
    `,
    relatedPosts: ["composition-rules", "lightroom-tips"]
  },
  "composition-rules": {
    title: "The Rule of Thirds and Beyond: Composition Techniques for Better Photos",
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&q=80",
    category: "composition",
    date: "May 22, 2023",
    readTime: "6 min read",
    author: "Chamodya Kodagoda",
    content: `
      <p class="mb-6">Good composition is what separates a snapshot from a photograph. While technical settings are important, how you arrange elements within your frame has an even greater impact on the visual strength of your images. Let's explore some fundamental composition techniques that will immediately improve your photography.</p>
      
      <h3 class="text-xl font-medium mb-4 mt-8">The Rule of Thirds</h3>
      <p class="mb-6">The rule of thirds is one of the most well-known composition guidelines. Imagine your frame divided into a 3×3 grid (most cameras can display this grid in the viewfinder). Placing key elements along these lines or at their intersections creates a more balanced and interesting image than centering your subject.</p>
      <p class="mb-6">For landscapes, try aligning the horizon with either the upper or lower third line rather than cutting the frame in half. For portraits, position your subject's eyes near an intersection point for a naturally engaging composition.</p>
      
      <h3 class="text-xl font-medium mb-4 mt-8">Leading Lines</h3>
      <p class="mb-6">Leading lines are powerful compositional elements that guide the viewer's eye through your image toward the main subject. These can be literal lines like roads, fences, or shorelines, or implied lines created by the arrangement of objects.</p>
      <p class="mb-6">When incorporating leading lines:</p>
      <ul class="list-disc pl-6 mb-6">
        <li class="mb-2">Look for natural pathways that draw attention to your subject</li>
        <li class="mb-2">Use converging lines to create a sense of depth and perspective</li>
        <li class="mb-2">Consider diagonal lines for a more dynamic feel than straight horizontal or vertical lines</li>
      </ul>
      
      <h3 class="text-xl font-medium mb-4 mt-8">Framing</h3>
      <p class="mb-6">Natural frames within your scene can add depth and context while directing attention to your subject. Look for elements like archways, tree branches, windows, or doorways that can surround your main subject.</p>
      <p class="mb-6">Effective framing:</p>
      <ul class="list-disc pl-6 mb-6">
        <li class="mb-2">Creates a sense of depth by establishing foreground, middle ground, and background</li>
        <li class="mb-2">Adds context to your subject and its environment</li>
        <li class="mb-2">Can be used selectively to hide distracting elements at the edges of your frame</li>
      </ul>
      
      <h3 class="text-xl font-medium mb-4 mt-8">Symmetry and Patterns</h3>
      <p class="mb-6">While the rule of thirds encourages off-center composition, sometimes perfect symmetry creates striking images. Reflections in water, architectural elements, or naturally occurring patterns can make for visually compelling photographs.</p>
      <p class="mb-6">Similarly, identifying and capturing patterns—whether in nature or human-made environments—can create visually rhythmic images. For added interest, look for a "break" in the pattern that creates a focal point.</p>
      
      <h3 class="text-xl font-medium mb-4 mt-8">Perspective and Point of View</h3>
      <p class="mb-6">The angle from which you take a photograph dramatically affects its impact. Instead of always shooting from eye level, experiment with:</p>
      <ul class="list-disc pl-6 mb-6">
        <li class="mb-2">Bird's eye view (shooting from above)</li>
        <li class="mb-2">Worm's eye view (shooting from below)</li>
        <li class="mb-2">Getting close to your subject for an intimate perspective</li>
      </ul>
      
      <h3 class="text-xl font-medium mb-4 mt-8">Breaking the Rules</h3>
      <p class="mb-6">Remember that these composition guidelines are just that—guidelines, not rigid rules. Once you understand them, you can intentionally break them for creative effect. Sometimes a perfectly centered subject or an unconventional angle creates the most impactful image.</p>
      
      <p>The best way to improve your composition skills is through practice and analysis. Study photographs you admire and try to identify the compositional techniques at work. With time, these principles will become second nature, allowing you to compose powerful images intuitively.</p>
    `,
    relatedPosts: ["camera-settings-101", "golden-hour"]
  },
  // More blog posts would be defined here...
};

const BlogPost = () => {
  const { id } = useParams();
  
  if (!id || !blogPostsData[id as keyof typeof blogPostsData]) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl mb-4">Article Not Found</h1>
          <p className="mb-8">The blog post you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/blog">Back to Blog</Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  const post = blogPostsData[id as keyof typeof blogPostsData];
  const categoryName = {
    "camera-basics": "Camera Basics",
    "composition": "Composition",
    "editing": "Photo Editing",
    "tips": "Photography Tips"
  }[post.category] || post.category;
  
  return (
    <Layout>
      {/* Hero Image */}
      <div className="relative h-[50vh] bg-black">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url(${post.image})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <div className="relative z-10 container mx-auto h-full flex items-end px-4 pb-12">
          <div className="max-w-3xl">
            <Link to="/blog" className="text-white/70 hover:text-white flex items-center mb-6">
              <ChevronLeft size={18} />
              <span>Back to All Articles</span>
            </Link>
            <div className="mb-2">
              <span className="text-primary text-sm font-medium">
                {categoryName}
              </span>
            </div>
            <h1 className="font-montserrat text-3xl md:text-4xl lg:text-5xl text-white font-light tracking-widest uppercase mb-4">
              {post.title}
            </h1>
            <div className="flex items-center text-white/70 text-sm">
              <span>{post.date}</span>
              <span className="mx-3">•</span>
              <span>{post.readTime}</span>
              <span className="mx-3">•</span>
              <span>By {post.author}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Article Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div 
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>
          
          {/* Author */}
          <div className="mt-12 pt-8 border-t border-border flex items-center">
            <div className="w-16 h-16 rounded-full bg-muted-foreground/20 flex items-center justify-center font-medium text-2xl">
              CK
            </div>
            <div className="ml-4">
              <h3 className="font-medium">{post.author}</h3>
              <p className="text-muted-foreground text-sm">
                Professional photographer specializing in wedding, landscape, and portrait photography.
              </p>
            </div>
          </div>
          
          {/* Related Posts */}
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <div className="mt-12">
              <h3 className="font-montserrat text-xl tracking-widest uppercase font-light mb-6">
                Related Articles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {post.relatedPosts.map(relatedId => {
                  const relatedPost = blogPostsData[relatedId as keyof typeof blogPostsData];
                  if (!relatedPost) return null;
                  
                  return (
                    <Link 
                      key={relatedId}
                      to={`/blog/${relatedId}`}
                      className="group flex flex-col bg-card rounded-lg overflow-hidden border border-border hover-lift"
                    >
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={relatedPost.image} 
                          alt={relatedPost.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                      </div>
                      <div className="p-4">
                        <div className="mb-1">
                          <span className="text-xs text-primary">
                            {relatedPost.category}
                          </span>
                        </div>
                        <h4 className="font-medium group-hover:text-primary transition-colors">
                          {relatedPost.title}
                        </h4>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BlogPost;
