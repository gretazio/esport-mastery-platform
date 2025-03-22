import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, AlertTriangle, Check, Trash, RefreshCw, Plus, PenSquare, LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePasswordReset } from "@/hooks/usePasswordReset";
import FAQManager from "@/components/admin/FAQManager";
import FooterResourceManager from "@/components/admin/FooterResourceManager";

interface RegisteredUser {
  id: string;
  email: string;
  created_at: string;
  is_active?: boolean;
}

interface Member {
  id: string;
  name: string;
  image: string;
  role: string;
  join_date: string | null;
  achievements: string[];
  created_at: string;
  updated_at: string;
}

interface BestGame {
  id: string;
  tournament: string;
  phase: string;
  format: string;
  players: string;
  image_url: string;
  replay_url: string;
  description_it: string;
  description_en: string;
  created_at: string;
  updated_at: string;
}

const initialMemberState: Omit<Member, "id" | "created_at" | "updated_at"> = {
  name: "",
  image: "",
  role: "",
  join_date: "",
  achievements: [],
};

const initialGameState: Omit<BestGame, "id" | "created_at" | "updated_at"> = {
  tournament: "",
  phase: "",
  format: "",
  players: "",
  image_url: "",
  replay_url: "",
  description_it: "",
  description_en: "",
};

const Admin = () => {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const { resetPassword, isLoading: resetLoading } = usePasswordReset();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [members, setMembers] = useState<Member[]>([]);
  const [games, setGames] = useState<BestGame[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [firstAdminId, setFirstAdminId] = useState<string | null>(null);

  const [newMember, setNewMember] = useState<Omit<Member, "id" | "created_at" | "updated_at">>(initialMemberState);
  const [newGame, setNewGame] = useState<Omit<BestGame, "id" | "created_at" | "updated_at">>(initialGameState);
  
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editingGame, setEditingGame] = useState<BestGame | null>(null);
  
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [gameDialogOpen, setGameDialogOpen] = useState(false);
  const [achievementInput, setAchievementInput] = useState("");
  
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingGames, setLoadingGames] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [savingUser, setSavingUser] = useState<{ [key: string]: boolean }>({});

  const fetchAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setFirstAdminId(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      
      const { data: authUsers, error: authError } = await supabase
        .from('authenticated_users_view')
        .select('*');
      
      if (authError) throw authError;
      
      if (!authUsers) {
        setRegisteredUsers([]);
        return;
      }
      
      const { data: admins, error: adminsError } = await supabase
        .from('admins')
        .select('*');
      
      if (adminsError) throw adminsError;
      
      const usersWithAdminStatus = authUsers.map(user => {
        const isAdmin = admins?.find(admin => admin.id === user.id);
        return {
          ...user,
          is_active: isAdmin ? isAdmin.is_active : false
        };
      });
      
      setRegisteredUsers(usersWithAdminStatus);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchMembers = async () => {
    try {
      setLoadingMembers(true);
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error("Error fetching members:", error);
      toast({
        title: "Error",
        description: "Failed to load members",
        variant: "destructive",
      });
    } finally {
      setLoadingMembers(false);
    }
  };

  const fetchGames = async () => {
    try {
      setLoadingGames(true);
      const { data, error } = await supabase
        .from('best_games')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      setGames(data || []);
    } catch (error) {
      console.error("Error fetching games:", error);
      toast({
        title: "Error",
        description: "Failed to load best games",
        variant: "destructive",
      });
    } finally {
      setLoadingGames(false);
    }
  };

  const toggleAdminStatus = async (userId: string, isCurrentlyAdmin: boolean) => {
    try {
      setSavingUser(prev => ({ ...prev, [userId]: true }));
      
      if (userId === firstAdminId && isCurrentlyAdmin) {
        toast({
          title: "Cannot Remove",
          description: "Cannot remove admin status from the first admin user for security reasons.",
          variant: "destructive",
        });
        return;
      }
      
      if (isCurrentlyAdmin) {
        const { error } = await supabase
          .from('admins')
          .update({ is_active: false })
          .eq('id', userId);
        
        if (error) throw error;
      } else {
        const { data, error: checkError } = await supabase
          .from('admins')
          .select('id')
          .eq('id', userId)
          .maybeSingle();
        
        if (checkError) throw checkError;
        
        if (data) {
          const { error } = await supabase
            .from('admins')
            .update({ is_active: true })
            .eq('id', userId);
          
          if (error) throw error;
        } else {
          const userEmail = registeredUsers.find(u => u.id === userId)?.email;
          
          if (!userEmail) {
            throw new Error("User email not found");
          }
          
          const { error } = await supabase
            .from('admins')
            .insert([{ id: userId, email: userEmail, is_active: true }]);
          
          if (error) throw error;
        }
      }
      
      toast({
        title: "Success",
        description: `User ${isCurrentlyAdmin ? "removed from" : "added to"} admins`,
      });
      
      fetchUsers();
    } catch (error: any) {
      console.error("Error updating admin status:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update admin status",
        variant: "destructive",
      });
    } finally {
      setSavingUser(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handlePasswordReset = async (email: string) => {
    try {
      const result = await resetPassword(email);
      if (result.success) {
        toast({
          title: "Password Reset Email Sent",
          description: `A password reset link has been sent to ${email}`,
        });
      }
    } catch (error) {
      console.error("Error sending password reset:", error);
    }
  };

  const handleAddMember = async () => {
    try {
      if (!newMember.name || !newMember.image || !newMember.role) {
        toast({
          title: "Validation Error",
          description: "Name, image URL, and role are required fields",
          variant: "destructive",
        });
        return;
      }
      
      const { error } = await supabase
        .from('members')
        .insert([newMember]);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Member added successfully",
      });
      
      setNewMember(initialMemberState);
      setMemberDialogOpen(false);
      fetchMembers();
    } catch (error: any) {
      console.error("Error adding member:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add member",
        variant: "destructive",
      });
    }
  };

  const handleEditMember = async () => {
    try {
      if (!editingMember) return;
      
      const { id, created_at, updated_at, ...updateData } = editingMember;
      
      const { error } = await supabase
        .from('members')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Member updated successfully",
      });
      
      setEditingMember(null);
      setMemberDialogOpen(false);
      fetchMembers();
    } catch (error: any) {
      console.error("Error updating member:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update member",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Member deleted successfully",
      });
      
      fetchMembers();
    } catch (error: any) {
      console.error("Error deleting member:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete member",
        variant: "destructive",
      });
    }
  };

  const handleAddGame = async () => {
    try {
      if (!newGame.tournament || !newGame.phase || !newGame.format || !newGame.players || 
          !newGame.image_url || !newGame.replay_url || !newGame.description_it || !newGame.description_en) {
        toast({
          title: "Validation Error",
          description: "All fields are required",
          variant: "destructive",
        });
        return;
      }
      
      const { error } = await supabase
        .from('best_games')
        .insert([newGame]);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Game added successfully",
      });
      
      setNewGame(initialGameState);
      setGameDialogOpen(false);
      fetchGames();
    } catch (error: any) {
      console.error("Error adding game:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add game",
        variant: "destructive",
      });
    }
  };

  const handleEditGame = async () => {
    try {
      if (!editingGame) return;
      
      const { id, created_at, updated_at, ...updateData } = editingGame;
      
      const { error } = await supabase
        .from('best_games')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Game updated successfully",
      });
      
      setEditingGame(null);
      setGameDialogOpen(false);
      fetchGames();
    } catch (error: any) {
      console.error("Error updating game:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update game",
        variant: "destructive",
      });
    }
  };

  const handleDeleteGame = async (id: string) => {
    try {
      const { error } = await supabase
        .from('best_games')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Game deleted successfully",
      });
      
      fetchGames();
    } catch (error: any) {
      console.error("Error deleting game:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete game",
        variant: "destructive",
      });
    }
  };

  const handleAddAchievement = () => {
    if (!achievementInput.trim()) return;
    
    if (editingMember) {
      setEditingMember({
        ...editingMember,
        achievements: [...editingMember.achievements, achievementInput.trim()],
      });
    } else {
      setNewMember({
        ...newMember,
        achievements: [...newMember.achievements, achievementInput.trim()],
      });
    }
    
    setAchievementInput("");
  };

  const handleRemoveAchievement = (index: number) => {
    if (editingMember) {
      const updatedAchievements = [...editingMember.achievements];
      updatedAchievements.splice(index, 1);
      setEditingMember({
        ...editingMember,
        achievements: updatedAchievements,
      });
    } else {
      const updatedAchievements = [...newMember.achievements];
      updatedAchievements.splice(index, 1);
      setNewMember({
        ...newMember,
        achievements: updatedAchievements,
      });
    }
  };

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/");
      return;
    }
    
    if (!authLoading && user && isAdmin) {
      fetchMembers();
      fetchGames();
      fetchUsers();
      fetchAdmins();
      
      const membersSubscription = supabase
        .channel('members-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'members',
        }, () => fetchMembers())
        .subscribe();
      
      const gamesSubscription = supabase
        .channel('games-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'best_games',
        }, () => fetchGames())
        .subscribe();
      
      const adminsSubscription = supabase
        .channel('admins-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'admins',
        }, () => {
          fetchUsers();
          fetchAdmins();
        })
        .subscribe();
      
      return () => {
        membersSubscription.unsubscribe();
        gamesSubscription.unsubscribe();
        adminsSubscription.unsubscribe();
      };
    }
  }, [authLoading, user, isAdmin, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-jf-dark">
        <Loader2 className="h-8 w-8 animate-spin text-jf-blue" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-jf-dark">
        <AlertTriangle className="h-12 w-12 text-jf-gold mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-white">Access Denied</h1>
        <p className="text-center mb-4 text-jf-light">You need to be logged in as an admin to access this page.</p>
        <Button onClick={() => navigate("/")} className="bg-jf-blue hover:bg-jf-blue/80">Return to Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-jf-dark text-jf-light">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-jf-light">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/")} className="border-jf-light text-jf-light hover:bg-jf-gray/30">
              Back to Site
            </Button>
            <Button 
              variant="destructive" 
              onClick={signOut} 
              className="bg-jf-red hover:bg-jf-red/80"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
          </div>
        </div>

        <Tabs defaultValue="users" className="mt-8">
          <TabsList className="mb-8 bg-jf-gray">
            <TabsTrigger value="users" className="data-[state=active]:bg-jf-blue data-[state=active]:text-white">User Management</TabsTrigger>
            <TabsTrigger value="members" className="data-[state=active]:bg-jf-blue data-[state=active]:text-white">Team Members</TabsTrigger>
            <TabsTrigger value="games" className="data-[state=active]:bg-jf-blue data-[state=active]:text-white">Best Games</TabsTrigger>
            <TabsTrigger value="faqs" className="data-[state=active]:bg-jf-blue data-[state=active]:text-white">FAQs</TabsTrigger>
            <TabsTrigger value="footer" className="data-[state=active]:bg-jf-blue data-[state=active]:text-white">Footer Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-jf-light">User Management</h2>
              <Button variant="outline" onClick={fetchUsers} className="border-jf-light text-jf-light hover:bg-jf-gray/30">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>

            {loadingUsers ? (
              <div className="flex justify-center my-12">
                <Loader2 className="h-8 w-8 animate-spin text-jf-blue" />
              </div>
            ) : registeredUsers.length === 0 ? (
              <div className="text-center py-12 bg-jf-gray/20 rounded-lg">
                <p className="text-lg text-jf-light">No users found</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {registeredUsers.map((user) => (
                  <Card key={user.id} className="bg-jf-gray/20 border-jf-gray/50 text-jf-light">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-jf-light">{user.email}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Switch
                            id={`admin-switch-${user.id}`}
                            checked={user.is_active || false}
                            onCheckedChange={() => toggleAdminStatus(user.id, user.is_active || false)}
                            disabled={savingUser[user.id] || (user.id === firstAdminId && user.is_active)}
                            className="data-[state=checked]:bg-jf-blue"
                          />
                          <Label htmlFor={`admin-switch-${user.id}`} className="text-jf-light">
                            {user.is_active ? "Admin" : "Not Admin"}
                          </Label>
                        </div>
                      </div>
                      <CardDescription className="text-jf-light/70">
                        User ID: {user.id}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-jf-light/80">
                        Created: {new Date(user.created_at).toLocaleDateString()}
                      </p>
                      {user.id === firstAdminId && user.is_active && (
                        <p className="text-xs mt-2 text-jf-gold">
                          This is the first admin user and cannot have admin status removed for security reasons.
                        </p>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePasswordReset(user.email)}
                        disabled={resetLoading}
                        className="border-jf-light/50 text-jf-light hover:bg-jf-gray/30"
                      >
                        {resetLoading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : null}
                        Send Password Reset
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-jf-light">Team Members</h2>
              <Dialog open={memberDialogOpen} onOpenChange={setMemberDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingMember(null);
                    setNewMember(initialMemberState);
                  }} className="bg-jf-blue hover:bg-jf-blue/80 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-jf-dark border-jf-gray/50 text-jf-light">
                  <DialogHeader>
                    <DialogTitle className="text-jf-light">{editingMember ? "Edit Member" : "Add New Member"}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={editingMember ? editingMember.name : newMember.name}
                          onChange={(e) => {
                            if (editingMember) {
                              setEditingMember({ ...editingMember, name: e.target.value });
                            } else {
                              setNewMember({ ...newMember, name: e.target.value });
                            }
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input
                          id="role"
                          value={editingMember ? editingMember.role : newMember.role}
                          onChange={(e) => {
                            if (editingMember) {
                              setEditingMember({ ...editingMember, role: e.target.value });
                            } else {
                              setNewMember({ ...newMember, role: e.target.value });
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="image">Image URL</Label>
                        <Input
                          id="image"
                          value={editingMember ? editingMember.image : newMember.image}
                          onChange={(e) => {
                            if (editingMember) {
                              setEditingMember({ ...editingMember, image: e.target.value });
                            } else {
                              setNewMember({ ...newMember, image: e.target.value });
                            }
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="join_date">Join Date</Label>
                        <Input
                          id="join_date"
                          value={editingMember ? editingMember.join_date || "" : newMember.join_date || ""}
                          onChange={(e) => {
                            if (editingMember) {
                              setEditingMember({ ...editingMember, join_date: e.target.value });
                            } else {
                              setNewMember({ ...newMember, join_date: e.target.value });
                            }
                          }}
                          placeholder="e.g. September 2015"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Achievements</Label>
                      <div className="flex gap-2">
                        <Input
                          value={achievementInput}
                          onChange={(e) => setAchievementInput(e.target.value)}
                          placeholder="Add achievement"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddAchievement();
                            }
                          }}
                        />
                        <Button type="button" onClick={handleAddAchievement}>
                          Add
                        </Button>
                      </div>
                      <div className="mt-2">
                        <ul className="space-y-2">
                          {(editingMember ? editingMember.achievements : newMember.achievements).map((achievement, index) => (
                            <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                              <span>{achievement}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveAchievement(index)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setMemberDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="button" onClick={editingMember ? handleEditMember : handleAddMember}>
                      {editingMember ? "Update" : "Add"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {loadingMembers ? (
              <div className="flex justify-center my-12">
                <Loader2 className="h-8 w-8 animate-spin text-jf-blue" />
              </div>
            ) : members.length === 0 ? (
              <div className="text-center py-12 bg-jf-gray/20 rounded-lg">
                <p className="text-lg text-jf-light">No members found</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {members.map((member) => (
                  <Card key={member.id} className="bg-jf-gray/20 border-jf-gray/50 text-jf-light">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle>{member.name}</CardTitle>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setEditingMember(member);
                              setMemberDialogOpen(true);
                            }}
                          >
                            <PenSquare className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteMember(member.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Role:</p>
                          <p className="text-sm">{member.role}</p>
                          
                          {member.join_date && (
                            <>
                              <p className="text-sm font-medium mt-2">Join Date:</p>
                              <p className="text-sm">{member.join_date}</p>
                            </>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">Achievements:</p>
                          <ul className="text-sm list-disc pl-4">
                            {member.achievements.map((achievement, index) => (
                              <li key={index}>{achievement}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="games" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-jf-light">Best Games</h2>
              <Dialog open={gameDialogOpen} onOpenChange={setGameDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingGame(null);
                    setNewGame(initialGameState);
                  }} className="bg-jf-blue hover:bg-jf-blue/80 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Game
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-jf-dark border-jf-gray/50 text-jf-light">
                  <DialogHeader>
                    <DialogTitle className="text-jf-light">{editingGame ? "Edit Game" : "Add New Game"}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tournament">Tournament</Label>
                        <Input
                          id="tournament"
                          value={editingGame ? editingGame.tournament : newGame.tournament}
                          onChange={(e) => {
                            if (editingGame) {
                              setEditingGame({ ...editingGame, tournament: e.target.value });
                            } else {
                              setNewGame({ ...newGame, tournament: e.target.value });
                            }
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="players">Players</Label>
                        <Input
                          id="players"
                          value={editingGame ? editingGame.players : newGame.players}
                          onChange={(e) => {
                            if (editingGame) {
                              setEditingGame({ ...editingGame, players: e.target.value });
                            } else {
                              setNewGame({ ...newGame, players: e.target.value });
                            }
                          }}
                          placeholder="e.g. Player1 vs Player2"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phase">Phase</Label>
                        <Input
                          id="phase"
                          value={editingGame ? editingGame.phase : newGame.phase}
                          onChange={(e) => {
                            if (editingGame) {
                              setEditingGame({ ...editingGame, phase: e.target.value });
                            } else {
                              setNewGame({ ...newGame, phase: e.target.value });
                            }
                          }}
                          placeholder="e.g. Finals"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="format">Format</Label>
                        <Input
                          id="format"
                          value={editingGame ? editingGame.format : newGame.format}
                          onChange={(e) => {
                            if (editingGame) {
                              setEditingGame({ ...editingGame, format: e.target.value });
                            } else {
                              setNewGame({ ...newGame, format: e.target.value });
                            }
                          }}
                          placeholder="e.g. Gen 9 OU"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="image_url">Image URL</Label>
                        <Input
                          id="image_url"
                          value={editingGame ? editingGame.image_url : newGame.image_url}
                          onChange={(e) => {
                            if (editingGame) {
                              setEditingGame({ ...editingGame, image_url: e.target.value });
                            } else {
                              setNewGame({ ...newGame, image_url: e.target.value });
                            }
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="replay_url">Replay URL</Label>
                        <Input
                          id="replay_url"
                          value={editingGame ? editingGame.replay_url : newGame.replay_url}
                          onChange={(e) => {
                            if (editingGame) {
                              setEditingGame({ ...editingGame, replay_url: e.target.value });
                            } else {
                              setNewGame({ ...newGame, replay_url: e.target.value });
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description_it">Description (Italian)</Label>
                      <Textarea
                        id="description_it"
                        rows={3}
                        value={editingGame ? editingGame.description_it : newGame.description_it}
                        onChange={(e) => {
                          if (editingGame) {
                            setEditingGame({ ...editingGame, description_it: e.target.value });
                          } else {
                            setNewGame({ ...newGame, description_it: e.target.value });
                          }
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description_en">Description (English)</Label>
                      <Textarea
                        id="description_en"
                        rows={3}
                        value={editingGame ? editingGame.description_en : newGame.description_en}
                        onChange={(e) => {
                          if (editingGame) {
                            setEditingGame({ ...editingGame, description_en: e.target.value });
                          } else {
                            setNewGame({ ...newGame, description_en: e.target.value });
                          }
                        }}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setGameDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="button" onClick={editingGame ? handleEditGame : handleAddGame}>
                      {editingGame ? "Update" : "Add"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {loadingGames ? (
              <div className="flex justify-center my-12">
                <Loader2 className="h-8 w-8 animate-spin text-jf-blue" />
              </div>
            ) : games.length === 0 ? (
              <div className="text-center py-12 bg-jf-gray/20 rounded-lg">
                <p className="text-lg text-jf-light">No games found</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {games.map((game) => (
                  <Card key={game.id} className="bg-jf-gray/20 border-jf-gray/50 text-jf-light">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle>{game.players}</CardTitle>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setEditingGame(game);
                              setGameDialogOpen(true);
                            }}
                          >
                            <PenSquare className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteGame(game.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardDescription>
                        {game.tournament} - {game.phase} - {game.format}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">English Description:</p>
                          <p className="text-sm">{game.description_en.length > 100 ? `${game.description_en.substring(0, 100)}...` : game.description_en}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Italian Description:</p>
                          <p className="text-sm">{game.description_it.length > 100 ? `${game.description_it.substring(0, 100)}...` : game.description_it}</p>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Replay URL:</p>
                          <p className="text-sm truncate">
                            <a href={game.replay_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                              {game.replay_url}
                            </a>
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="faqs">
            <FAQManager />
          </TabsContent>

          <TabsContent value="footer">
            <FooterResourceManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
