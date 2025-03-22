
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FooterResource {
  id: string;
  title_it: string;
  title_en: string;
  url: string;
  icon: string | null;
  category: string;
  position: number;
  is_active: boolean;
}

const CATEGORIES = ["links", "social", "legal", "support"];

const FooterResourceManager = () => {
  const [resources, setResources] = useState<FooterResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [newResource, setNewResource] = useState<Omit<FooterResource, "id" | "created_at" | "updated_at">>({
    title_it: "",
    title_en: "",
    url: "",
    icon: "",
    category: "links",
    position: 0,
    is_active: true,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<FooterResource | null>(null);
  const { toast } = useToast();

  const fetchResources = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("footer_resources")
        .select("*")
        .order("category", { ascending: true })
        .order("position", { ascending: true });

      if (error) throw error;
      setResources(data || []);
    } catch (error: any) {
      console.error("Error fetching footer resources:", error);
      toast({
        title: "Error",
        description: "Failed to load footer resources",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();

    // Set up real-time listener
    const subscription = supabase
      .channel("footer-resources-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "footer_resources" },
        () => {
          fetchResources();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAddResource = async () => {
    try {
      if (!newResource.title_it || !newResource.title_en || !newResource.url || !newResource.category) {
        toast({
          title: "Validation Error",
          description: "Title, URL, and category are required",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("footer_resources").insert([newResource]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Resource added successfully",
      });
      
      setNewResource({
        title_it: "",
        title_en: "",
        url: "",
        icon: "",
        category: "links",
        position: 0,
        is_active: true,
      });
      
      setDialogOpen(false);
      fetchResources();
    } catch (error: any) {
      console.error("Error adding resource:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add resource",
        variant: "destructive",
      });
    }
  };

  const handleEditResource = async () => {
    try {
      if (!editingResource) return;
      
      const { error } = await supabase
        .from("footer_resources")
        .update({
          title_it: editingResource.title_it,
          title_en: editingResource.title_en,
          url: editingResource.url,
          icon: editingResource.icon,
          category: editingResource.category,
          position: editingResource.position,
          is_active: editingResource.is_active,
        })
        .eq("id", editingResource.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Resource updated successfully",
      });
      
      setEditingResource(null);
      setDialogOpen(false);
      fetchResources();
    } catch (error: any) {
      console.error("Error updating resource:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update resource",
        variant: "destructive",
      });
    }
  };

  const handleDeleteResource = async (id: string) => {
    try {
      const { error } = await supabase.from("footer_resources").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Resource deleted successfully",
      });
      
      fetchResources();
    } catch (error: any) {
      console.error("Error deleting resource:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete resource",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (id: string, is_active: boolean) => {
    try {
      const { error } = await supabase
        .from("footer_resources")
        .update({ is_active: !is_active })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Resource ${is_active ? "deactivated" : "activated"} successfully`,
      });
      
      fetchResources();
    } catch (error: any) {
      console.error("Error toggling resource:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update resource",
        variant: "destructive",
      });
    }
  };

  // Group resources by category
  const groupedResources = resources.reduce((acc, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = [];
    }
    acc[resource.category].push(resource);
    return acc;
  }, {} as Record<string, FooterResource[]>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Footer Resources Management</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingResource(null);
              setNewResource({
                title_it: "",
                title_en: "",
                url: "",
                icon: "",
                category: "links",
                position: resources.length,
                is_active: true,
              });
            }} className="bg-[#D946EF] hover:bg-[#D946EF]/80 text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-jf-dark border-[#D946EF]/30 text-jf-light">
            <DialogHeader>
              <DialogTitle className="text-jf-light">{editingResource ? "Edit Resource" : "Add Resource"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title_it" className="text-jf-light">Title (Italian)</Label>
                  <Input
                    id="title_it"
                    value={editingResource ? editingResource.title_it : newResource.title_it}
                    onChange={(e) => editingResource 
                      ? setEditingResource({...editingResource, title_it: e.target.value})
                      : setNewResource({...newResource, title_it: e.target.value})
                    }
                    className="bg-jf-gray/30 border-[#D946EF]/30 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title_en" className="text-jf-light">Title (English)</Label>
                  <Input
                    id="title_en"
                    value={editingResource ? editingResource.title_en : newResource.title_en}
                    onChange={(e) => editingResource
                      ? setEditingResource({...editingResource, title_en: e.target.value})
                      : setNewResource({...newResource, title_en: e.target.value})
                    }
                    className="bg-jf-gray/30 border-[#D946EF]/30 text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="url" className="text-jf-light">URL</Label>
                <Input
                  id="url"
                  value={editingResource ? editingResource.url : newResource.url}
                  onChange={(e) => editingResource
                    ? setEditingResource({...editingResource, url: e.target.value})
                    : setNewResource({...newResource, url: e.target.value})
                  }
                  className="bg-jf-gray/30 border-[#D946EF]/30 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="icon" className="text-jf-light">Icon (optional Lucide icon name)</Label>
                <Input
                  id="icon"
                  value={editingResource ? editingResource.icon || "" : newResource.icon || ""}
                  onChange={(e) => {
                    const value = e.target.value || null;
                    editingResource
                      ? setEditingResource({...editingResource, icon: value})
                      : setNewResource({...newResource, icon: value});
                  }}
                  placeholder="e.g. 'Github', 'Twitter', 'Facebook', etc."
                  className="bg-jf-gray/30 border-[#D946EF]/30 text-white placeholder:text-gray-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-jf-light">Category</Label>
                  <Select
                    value={editingResource ? editingResource.category : newResource.category}
                    onValueChange={(value) => editingResource
                      ? setEditingResource({...editingResource, category: value})
                      : setNewResource({...newResource, category: value})
                    }
                  >
                    <SelectTrigger id="category" className="bg-jf-gray/30 border-[#D946EF]/30 text-white">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-jf-dark border-[#D946EF]/30 text-jf-light">
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category} className="focus:bg-[#D946EF]/20 focus:text-white">
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position" className="text-jf-light">Position</Label>
                  <Input
                    id="position"
                    type="number"
                    value={editingResource ? editingResource.position : newResource.position}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      editingResource
                        ? setEditingResource({...editingResource, position: value})
                        : setNewResource({...newResource, position: value});
                    }}
                    className="bg-jf-gray/30 border-[#D946EF]/30 text-white"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={editingResource ? editingResource.is_active : newResource.is_active}
                  onCheckedChange={(checked) => editingResource
                    ? setEditingResource({...editingResource, is_active: checked})
                    : setNewResource({...newResource, is_active: checked})
                  }
                  className="data-[state=checked]:bg-[#D946EF]"
                />
                <Label htmlFor="is_active" className="text-jf-light">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}
                className="border-[#D946EF]/50 text-[#D946EF] hover:bg-[#D946EF]/10">
                Cancel
              </Button>
              <Button type="button" onClick={editingResource ? handleEditResource : handleAddResource}
                className="bg-[#D946EF] hover:bg-[#D946EF]/80">
                {editingResource ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center my-8">
          <Loader2 className="h-8 w-8 animate-spin text-[#D946EF]" />
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No resources found. Add your first resource using the button above.
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedResources).map(([category, categoryResources]) => (
            <div key={category}>
              <h3 className="text-xl font-semibold mb-4 capitalize">{category}</h3>
              <div className="grid gap-4">
                {categoryResources.map((resource) => (
                  <Card key={resource.id} className={`${!resource.is_active ? "opacity-60" : ""} bg-jf-gray/30 border-[#D946EF]/30 text-jf-light`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-lg text-jf-light">{resource.title_en}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`active-${resource.id}`}
                            checked={resource.is_active}
                            onCheckedChange={() => handleToggleActive(resource.id, resource.is_active)}
                            className="data-[state=checked]:bg-[#D946EF]"
                          />
                          <Label htmlFor={`active-${resource.id}`} className="sr-only">
                            Active
                          </Label>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingResource(resource);
                              setDialogOpen(true);
                            }}
                            className="hover:bg-[#D946EF]/10 hover:text-[#D946EF]"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                              <path d="m15 5 4 4" />
                            </svg>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteResource(resource.id)}
                            className="hover:bg-[#D946EF]/10 hover:text-[#D946EF]"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-[#D946EF]">Italian: {resource.title_it}</div>
                          <div className="text-sm text-[#D946EF]">Position: {resource.position}</div>
                        </div>
                        <div>
                          <div className="text-sm text-[#D946EF]">URL: {resource.url}</div>
                          <div className="text-sm text-[#D946EF]">
                            Icon: {resource.icon || "None"}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FooterResourceManager;
