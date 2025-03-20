
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Layout from "@/components/layout/Layout";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center py-20">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-gradient text-9xl font-bold mb-6">404</h1>
          <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The page you are looking for doesn't exist or has been moved. 
            Please check the URL or navigate back to the home page.
          </p>
          <Button 
            onClick={() => navigate(-1)}
            variant="outline"
            className="mr-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Button asChild className="bg-accent hover:bg-accent/90 text-white">
            <Link to="/">
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
