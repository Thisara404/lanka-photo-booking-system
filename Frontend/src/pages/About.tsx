
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative h-72 bg-black">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80)" }}
        ></div>
        <div className="relative z-10 container mx-auto h-full flex items-center px-4">
          <div>
            <h1 className="font-playfair text-4xl md:text-5xl text-white font-medium mb-4">
              About Me
            </h1>
            <p className="text-white/80 max-w-2xl">
              Learn about my journey, approach, and passion for photography.
            </p>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-2/5">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1552168324-d612d77725e3?auto=format&fit=crop&q=80" 
                  alt="Chamodya Kodagoda" 
                  className="rounded-lg shadow-lg w-full max-w-md mx-auto"
                />
                <div className="absolute -bottom-5 -right-5 bg-primary text-white p-4 rounded-lg shadow-lg">
                  <span className="font-playfair text-lg">10+ years of experience</span>
                </div>
              </div>
            </div>
            
            <div className="lg:w-3/5">
              <h2 className="font-playfair text-3xl md:text-4xl font-medium mb-6">
                Chamodya Kodagoda
              </h2>
              
              <p className="text-lg mb-6">
                I'm a professional photographer based in Sri Lanka, specializing in wedding photography, 
                portrait sessions, and landscape photography. My journey with photography began over 10 
                years ago when I got my first DSLR camera as a gift.
              </p>
              
              <p className="mb-6">
                What started as a hobby quickly turned into a passion, and eventually into a career. I'm 
                driven by the desire to capture authentic moments and emotions, turning them into 
                timeless memories that my clients can cherish forever.
              </p>
              
              <p className="mb-10">
                My style combines documentary photography with artistic composition, using natural light
                whenever possible to create images that are both beautiful and emotionally resonant. I 
                believe that the best photographs tell a story and evoke genuine feelings.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button asChild>
                  <Link to="/booking">Book a Session</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/contact">Contact Me</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* My Approach */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="font-playfair text-3xl md:text-4xl font-medium mb-10 text-center">
            My Approach
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-lg border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-playfair text-xl font-medium mb-3">Attention to Detail</h3>
              <p className="text-muted-foreground">
                I believe that what sets great photography apart is attention to the small details. 
                From lighting to composition, I'm meticulous about every aspect of my work.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-lg border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-playfair text-xl font-medium mb-3">Authentic Emotions</h3>
              <p className="text-muted-foreground">
                I focus on capturing genuine emotions and connections. My approach is unobtrusive, 
                allowing real moments to unfold naturally while I document them.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-lg border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-playfair text-xl font-medium mb-3">Creative Vision</h3>
              <p className="text-muted-foreground">
                Beyond just capturing what's there, I bring a creative vision to my work, 
                finding unique perspectives and creating artistic compositions.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Equipment */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-playfair text-3xl md:text-4xl font-medium mb-10 text-center">
            My Equipment
          </h2>
          
          <div className="flex flex-col md:flex-row justify-center gap-10">
            <div className="md:w-1/3 space-y-6">
              <h3 className="font-playfair text-2xl mb-4">Cameras</h3>
              
              <div className="flex gap-4 p-4 bg-card rounded-lg border border-border">
                <div className="w-16 h-16 bg-black rounded flex items-center justify-center">
                  <span className="font-playfair text-white font-bold">C</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Canon EOS R5</h4>
                  <p className="text-sm text-muted-foreground">Primary camera for all professional work</p>
                </div>
              </div>
              
              <div className="flex gap-4 p-4 bg-card rounded-lg border border-border">
                <div className="w-16 h-16 bg-black rounded flex items-center justify-center">
                  <span className="font-playfair text-white font-bold">C</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Canon 5D Mark IV</h4>
                  <p className="text-sm text-muted-foreground">Secondary camera and backup</p>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/3 space-y-6">
              <h3 className="font-playfair text-2xl mb-4">Lenses</h3>
              
              <div className="flex gap-4 p-4 bg-card rounded-lg border border-border">
                <div className="w-16 h-16 bg-black rounded flex items-center justify-center">
                  <span className="font-playfair text-white text-xs font-bold">24-70</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Canon RF 24-70mm f/2.8L</h4>
                  <p className="text-sm text-muted-foreground">Versatile zoom for events and portraits</p>
                </div>
              </div>
              
              <div className="flex gap-4 p-4 bg-card rounded-lg border border-border">
                <div className="w-16 h-16 bg-black rounded flex items-center justify-center">
                  <span className="font-playfair text-white text-xs font-bold">70-200</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Canon RF 70-200mm f/2.8L</h4>
                  <p className="text-sm text-muted-foreground">Perfect for portraits and compression</p>
                </div>
              </div>
              
              <div className="flex gap-4 p-4 bg-card rounded-lg border border-border">
                <div className="w-16 h-16 bg-black rounded flex items-center justify-center">
                  <span className="font-playfair text-white text-xs font-bold">85mm</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Canon RF 85mm f/1.2L</h4>
                  <p className="text-sm text-muted-foreground">My favorite lens for portrait work</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl text-white font-medium mb-6">
            Let's Work Together
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10">
            I'd love to hear about your photography needs and how I can help capture your special moments.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/booking">Book a Session</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Contact Me</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
