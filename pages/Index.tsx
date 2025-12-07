import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { Truck, TrendingUp, FileText, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-16 md:py-28">
          <div className="text-center space-y-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="p-4 bg-primary/10 rounded-2xl">
                <Truck className="h-14 w-14 text-primary" />
              </div>
              <h1 className="text-6xl md:text-7xl font-bold font-heading bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
                Fextrio
              </h1>
            </div>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Professional vehicle trip management made simple. Track trips, monitor
              earnings, and generate statements with ease.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center pt-6">
              {user ? (
                <Button asChild size="lg" className="text-lg h-14 px-10 rounded-xl shadow-lg hover:shadow-xl transition-all">
                  <Link to="/vehicles">Go to Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="text-lg h-14 px-10 rounded-xl shadow-lg hover:shadow-xl transition-all">
                    <Link to="/auth">Get Started</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="text-lg h-14 px-10 rounded-xl border-2 hover:bg-primary/5">
                    <Link to="/auth">Sign In</Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-24 animate-fade-in">
            <div className="group text-center p-8 rounded-2xl border-2 bg-card hover:border-primary/50 hover:shadow-xl transition-all duration-300">
              <div className="inline-flex p-4 bg-primary/10 rounded-xl mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold font-heading mb-3">Track Earnings</h3>
              <p className="text-muted-foreground leading-relaxed">
                Monitor cash and earnings for each trip with automatic
                calculations and real-time summaries.
              </p>
            </div>

            <div className="group text-center p-8 rounded-2xl border-2 bg-card hover:border-primary/50 hover:shadow-xl transition-all duration-300">
              <div className="inline-flex p-4 bg-primary/10 rounded-xl mb-6 group-hover:scale-110 transition-transform">
                <FileText className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold font-heading mb-3">Generate Statements</h3>
              <p className="text-muted-foreground leading-relaxed">
                Create professional statements with date filters, export to CSV,
                and print-ready layouts.
              </p>
            </div>

            <div className="group text-center p-8 rounded-2xl border-2 bg-card hover:border-primary/50 hover:shadow-xl transition-all duration-300">
              <div className="inline-flex p-4 bg-primary/10 rounded-xl mb-6 group-hover:scale-110 transition-transform">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold font-heading mb-3">Secure & Reliable</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your data is protected with enterprise-grade authentication and
                encrypted cloud storage.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
