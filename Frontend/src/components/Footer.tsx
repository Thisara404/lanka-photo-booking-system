
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card/50 border-t border-border px-0 mx-0 mt-4 py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <h3 className="font-playfair text-base font-medium mb-1">
              Chamodya Kodagoda <span className="text-primary">Photography</span>
            </h3>
            <p className="text-xs text-muted-foreground max-w-xs">
              Capturing Sri Lanka's beauty and your special moments with a unique artistic perspective.
            </p>
          </div>
          <div>
            <h4 className="font-playfair text-xs mb-1">Quick Links</h4>
            <ul className="space-y-1">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/booking">Book a Session</FooterLink>
              <FooterLink to="/prints">Prints</FooterLink>
              <FooterLink to="/presets">Presets</FooterLink>
              <FooterLink to="/blog">Blog</FooterLink>
            </ul>
          </div>
          <div>
            <h4 className="font-playfair text-xs mb-1">Services</h4>
            <ul className="space-y-1">
              <FooterLink to="/booking?category=wedding">Wedding Photography</FooterLink>
              <FooterLink to="/booking?category=pre-shoot">Pre-shoot Photography</FooterLink>
              <FooterLink to="/booking?category=birthday">Birthday Photography</FooterLink>
              <FooterLink to="/booking?category=graduation">Graduation Photography</FooterLink>
            </ul>
          </div>
          <div>
            <h4 className="font-playfair text-xs mb-1">Connect</h4>
            <ul className="space-y-1">
              <FooterLink to="/contact">Contact Me</FooterLink>
              <FooterLink to="/about">About Me</FooterLink>
              <li>
                <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="text-xs text-foreground/70 hover:text-primary transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-xs text-foreground/70 hover:text-primary transition-colors">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-4 pt-2 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Chamodya Kodagoda Photography. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-1 md:mt-0">
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({
  to,
  children
}: {
  to: string;
  children: React.ReactNode;
}) => (
  <li>
    <Link to={to} className="text-xs text-foreground/70 hover:text-primary transition-colors">
      {children}
    </Link>
  </li>
);

export default Footer;
