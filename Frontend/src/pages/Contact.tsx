import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import emailjs from '@emailjs/browser';
import { Loader2 } from "lucide-react";
import api from "@/api";

// EmailJS configuration variables
const EMAILJS_SERVICE_ID = "service_79uh8t5";
const EMAILJS_TEMPLATE_ID = "template_8s60ilf";
const EMAILJS_PUBLIC_KEY = "GlZxeLMhaVANy3nsj";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // First send email via EmailJS for immediate notification
      const emailResult = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          reply_to: formData.email,
          subject: formData.subject || "No Subject",
          message: formData.message
        },
        EMAILJS_PUBLIC_KEY
      );

      // Then store the contact message in the database
      await api.post('/contact', formData);

      if (emailResult.text === "OK") {
        toast({
          title: "Message sent successfully!",
          description: "I'll get back to you as soon as possible.",
        });
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Error sending message",
        description: "There was a problem sending your message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative h-72 bg-black">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?auto=format&fit=crop&q=80)" }}
        ></div>
        <div className="relative z-10 container mx-auto h-full flex items-center px-4">
          <div>
            <h1 className="font-playfair text-4xl md:text-5xl text-white font-medium mb-4">
              Contact Me
            </h1>
            <p className="text-white/80 max-w-2xl">
              Have questions or want to discuss a photography project?
              Get in touch and let's create something beautiful together.
            </p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="font-playfair text-3xl mb-6">Send a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email Address" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input 
                  id="subject" 
                  name="subject" 
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this regarding?" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea 
                  id="message" 
                  name="message" 
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message" 
                  rows={6} 
                  required 
                />
              </div>
              
              <Button type="submit" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          </div>
          
          {/* Contact Info */}
          <div>
            <h2 className="font-playfair text-3xl mb-6">Contact Information</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-medium mb-2">Location</h3>
                <p className="text-muted-foreground mb-2">Colombo, Sri Lanka</p>
                <p className="text-muted-foreground">Available for travel throughout Sri Lanka and internationally</p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">Email</h3>
                <a href="mailto:info@chamodya.com" className="text-primary hover:text-primary/80 transition-colors">
                  info@chamodya.com
                </a>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">Phone</h3>
                <a href="tel:+94123456789" className="text-primary hover:text-primary/80 transition-colors">
                  +94 12 345 6789
                </a>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">Working Hours</h3>
                <p className="text-muted-foreground mb-1">Monday - Friday: 9AM - 6PM</p>
                <p className="text-muted-foreground">Weekends: By appointment</p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-4">Follow Me</h3>
                <div className="flex space-x-4">
                  {["Instagram", "Facebook", "Twitter", "LinkedIn"].map((social) => (
                    <a 
                      key={social} 
                      href="#"
                      className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white transition-colors duration-300"
                    >
                      {social.charAt(0)}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
