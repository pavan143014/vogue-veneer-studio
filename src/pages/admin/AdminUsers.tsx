import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Search,
  Shield,
  UserPlus,
  Loader2,
  Crown,
  User,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";

interface UserRole {
  id: string;
  user_id: string;
  role: "admin" | "moderator" | "user";
  created_at: string;
}

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

const AdminUsers = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<"admin" | "moderator" | "user">("admin");
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);

    const [profilesRes, rolesRes] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("*"),
    ]);

    if (profilesRes.data) setProfiles(profilesRes.data);
    if (rolesRes.data) setUserRoles(rolesRes.data as UserRole[]);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getUserRole = (userId: string): string | null => {
    const role = userRoles.find((r) => r.user_id === userId);
    return role?.role || null;
  };

  const handleAddRole = async () => {
    if (!newAdminEmail) return;

    setSaving(true);

    // First, find user by email through profiles (we can't query auth.users directly)
    // This is a simplified approach - in production, you'd use an edge function
    toast.info(
      "To add a user as admin, they must first create an account. Then you can assign roles from this panel."
    );

    setSaving(false);
    setIsDialogOpen(false);
    setNewAdminEmail("");
  };

  const handleRemoveRole = async (roleId: string) => {
    if (!confirm("Are you sure you want to remove this role?")) return;

    const { error } = await supabase.from("user_roles").delete().eq("id", roleId);

    if (error) {
      toast.error("Failed to remove role");
    } else {
      toast.success("Role removed");
      setUserRoles((prev) => prev.filter((r) => r.id !== roleId));
    }
  };

  const handleAssignRole = async (userId: string, role: "admin" | "moderator" | "user") => {
    setSaving(true);

    // Check if user already has a role
    const existingRole = userRoles.find((r) => r.user_id === userId);

    if (existingRole) {
      // Update existing role
      const { error } = await supabase
        .from("user_roles")
        .update({ role })
        .eq("id", existingRole.id);

      if (error) {
        toast.error("Failed to update role");
      } else {
        toast.success("Role updated");
        setUserRoles((prev) =>
          prev.map((r) => (r.id === existingRole.id ? { ...r, role } : r))
        );
      }
    } else {
      // Create new role
      const { data, error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role })
        .select()
        .single();

      if (error) {
        toast.error("Failed to assign role");
      } else if (data) {
        toast.success("Role assigned");
        setUserRoles((prev) => [...prev, data as UserRole]);
      }
    }

    setSaving(false);
  };

  const filteredProfiles = profiles.filter(
    (p) =>
      p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.user_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleIcon = (role: string | null) => {
    switch (role) {
      case "admin":
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case "moderator":
        return <Shield className="h-4 w-4 text-blue-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleBadge = (role: string | null) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
            <Crown className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        );
      case "moderator":
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            <Shield className="h-3 w-3 mr-1" />
            Moderator
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground">
            <User className="h-3 w-3 mr-1" />
            User
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            User Management
          </h1>
          <p className="font-body text-muted-foreground">
            Manage user roles and permissions
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus size={18} />
              Assign Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display text-xl">
                Assign User Role
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <p className="font-body text-sm text-muted-foreground">
                Users must create an account first. Then you can assign roles to
                them from the users table below.
              </p>
              <div className="flex gap-3 pt-4">
                <Button onClick={() => setIsDialogOpen(false)} className="flex-1">
                  Got it
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          {filteredProfiles.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-lg text-foreground mb-2">
                No users found
              </h3>
              <p className="font-body text-muted-foreground">
                Users will appear here once they create accounts
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfiles.map((profile, index) => {
                  const role = getUserRole(profile.user_id);
                  return (
                    <motion.tr
                      key={profile.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="group"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-medium">
                            {profile.full_name?.[0]?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="font-body font-medium text-foreground">
                              {profile.full_name || "Unnamed User"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-xs text-muted-foreground">
                          {profile.user_id.slice(0, 8)}...
                        </span>
                      </TableCell>
                      <TableCell>{getRoleBadge(role)}</TableCell>
                      <TableCell>
                        <span className="font-body text-sm text-muted-foreground">
                          {new Date(profile.created_at).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Select
                          value={role || "user"}
                          onValueChange={(value) =>
                            handleAssignRole(
                              profile.user_id,
                              value as "admin" | "moderator" | "user"
                            )
                          }
                          disabled={saving}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
