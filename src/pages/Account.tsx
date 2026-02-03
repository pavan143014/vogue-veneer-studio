import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Package, Heart, Settings, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Account = () => {
  const navigate = useNavigate();
  const { user, profile, isAuthenticated, loading, updateProfile } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/");
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const { error } = await updateProfile({
      full_name: fullName,
      phone,
    });

    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated successfully");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 font-body text-sm">
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground">Account</span>
        </nav>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Card>
              <CardContent className="p-4 space-y-1">
                <Link
                  to="/account"
                  className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 text-primary font-body"
                >
                  <Settings className="h-4 w-4" />
                  Account Settings
                </Link>
                <Link
                  to="/account/orders"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors font-body text-muted-foreground"
                >
                  <Package className="h-4 w-4" />
                  My Orders
                </Link>
                <Link
                  to="/account/wishlist"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors font-body text-muted-foreground"
                >
                  <Heart className="h-4 w-4" />
                  Wishlist
                </Link>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-2xl flex items-center gap-2">
                  <User className="h-6 w-6 text-primary" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-body">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="font-body bg-muted"
                      />
                      <p className="text-xs text-muted-foreground font-body">
                        Email cannot be changed
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="font-body">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                        className="font-body"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-body">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 1234567890"
                      className="font-body"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 font-body"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Account;
