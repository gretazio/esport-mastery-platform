
import { Link } from "react-router-dom";
import { Trophy } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-accent" />
              <span className="font-semibold text-xl">ESPORT</span>
            </Link>
            <p className="text-muted-foreground max-w-xs">
              The ultimate destination for esports enthusiasts, players, and teams.
            </p>
          </div>

          {/* Navigation Columns */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Platform</h4>
            <ul className="space-y-2">
              {["About Us", "Careers", "Partners", "News"].map((item) => (
                <li key={item}>
                  <Link 
                    to="/"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-sm">Resources</h4>
            <ul className="space-y-2">
              {["Support", "Gaming Guides", "Tournaments", "Community"].map((item) => (
                <li key={item}>
                  <Link 
                    to="/"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-sm">Legal</h4>
            <ul className="space-y-2">
              {["Terms", "Privacy", "Cookies", "Licenses"].map((item) => (
                <li key={item}>
                  <Link 
                    to="/"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ESPORT. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Twitter", "Discord", "YouTube", "Instagram"].map((platform) => (
              <Link 
                key={platform}
                to="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {platform}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
