
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-background z-0" />
      
      {/* Visual elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>
      
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
              <Shield className="h-8 w-8 text-accent" />
            </div>
          </div>
          
          <h2 className="text-4xl font-bold mb-6">Ready to Join the Elite?</h2>
          
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Take your esports experience to the next level with premium features, exclusive tournaments, and a thriving community of professional players.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="bg-accent hover:bg-accent/90 text-white min-w-40" size="lg">
              Get Started Now
            </Button>
            <Button variant="outline" className="group min-w-40" size="lg">
              Learn More
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
