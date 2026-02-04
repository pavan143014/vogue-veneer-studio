import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2, Shield } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

function useRedirectPath() {
  const location = useLocation();

  return useMemo(() => {
    const params = new URLSearchParams(location.search);
    const redirect = params.get("redirect");

    // Only allow in-app relative redirects.
    if (redirect && redirect.startsWith("/")) return redirect;
    return "/admin";
  }, [location.search]);
}

const AdminLogin = () => {
  const navigate = useNavigate();
  const redirectTo = useRedirectPath();
  const { user, loading: authLoading, signIn, signOut } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // If already signed in, try to go to redirect target.
    if (!authLoading && user) {
      navigate(redirectTo, { replace: true });
    }
  }, [authLoading, user, navigate, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error("Sign in failed", { description: error.message });
        return;
      }

      // Confirm admin privileges immediately after sign-in.
      const {
        data: { user: signedInUser },
        error: userErr,
      } = await supabase.auth.getUser();

      if (userErr || !signedInUser) {
        toast.error("Sign in failed", { description: "Unable to read session." });
        return;
      }

      const { data: isAdmin, error: roleErr } = await supabase.rpc("has_role", {
        _user_id: signedInUser.id,
        _role: "admin",
      });

      if (roleErr || !isAdmin) {
        await signOut();
        toast.error("You don't have admin access");
        return;
      }

      toast.success("Signed in as admin");
      navigate(redirectTo, { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center">
            <Shield className="h-6 w-6" />
          </div>
          <CardTitle className="font-display text-2xl">Admin Sign In</CardTitle>
          <p className="font-body text-sm text-muted-foreground mt-2">
            Use your admin credentials to access the dashboard.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email" className="font-body text-sm">
                Email
              </Label>
              <Input
                id="admin-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password" className="font-body text-sm">
                Password
              </Label>
              <Input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <Button type="submit" className="w-full font-body" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
