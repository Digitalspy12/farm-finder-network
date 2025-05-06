
import { useState, useEffect } from "react";
import { useRole } from "@/contexts/RoleContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, X, Edit, Check } from "lucide-react";
import { fetchData, postData, updateData } from "@/utils/apiUtils";
import { Farmer, Distributor } from "@/types";

export default function CropManagement() {
  const { userRole, userId } = useRole();
  const [userData, setUserData] = useState<Farmer | Distributor | null>(null);
  const [crops, setCrops] = useState<string[]>([]);
  const [newCrop, setNewCrop] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedCrop, setEditedCrop] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const endpoint = userRole === "farmer" ? "farmers" : "distributors";

  useEffect(() => {
    const loadUserData = async () => {
      if (userId) {
        setIsLoading(true);
        const data = await fetchData(`${endpoint}/${userId}`);
        if (data) {
          setUserData(data);
          setCrops(data.crops || []);
        }
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [userId, endpoint]);

  const handleAddCrop = async () => {
    if (!newCrop.trim()) {
      toast.error("Please enter a crop name");
      return;
    }
    
    if (crops.includes(newCrop.trim())) {
      toast.error("This crop is already in your list");
      return;
    }
    
    const updatedCrops = [...crops, newCrop.trim()];
    
    if (userId && userData) {
      const updatedUserData = {
        ...userData,
        crops: updatedCrops,
      };
      
      const response = await updateData(endpoint, userId, updatedUserData);
      
      if (response) {
        setCrops(updatedCrops);
        setNewCrop("");
        toast.success("Crop added successfully");
      }
    }
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditedCrop(crops[index]);
  };

  const handleSaveEdit = async (index: number) => {
    if (!editedCrop.trim()) {
      toast.error("Crop name cannot be empty");
      return;
    }
    
    if (crops.includes(editedCrop.trim()) && editedCrop.trim() !== crops[index]) {
      toast.error("This crop is already in your list");
      return;
    }
    
    const updatedCrops = [...crops];
    updatedCrops[index] = editedCrop.trim();
    
    if (userId && userData) {
      const updatedUserData = {
        ...userData,
        crops: updatedCrops,
      };
      
      const response = await updateData(endpoint, userId, updatedUserData);
      
      if (response) {
        setCrops(updatedCrops);
        setEditingIndex(null);
        toast.success("Crop updated successfully");
      }
    }
  };

  const handleDeleteCrop = async (index: number) => {
    const updatedCrops = crops.filter((_, i) => i !== index);
    
    if (userId && userData) {
      const updatedUserData = {
        ...userData,
        crops: updatedCrops,
      };
      
      const response = await updateData(endpoint, userId, updatedUserData);
      
      if (response) {
        setCrops(updatedCrops);
        toast.success("Crop removed successfully");
      }
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading crops...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Add New Crop</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Enter crop name"
              value={newCrop}
              onChange={(e) => setNewCrop(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleAddCrop}
              className="bg-croplink-green hover:bg-croplink-green-dark"
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {userRole === "farmer" ? "Crops I Grow" : "Crops I Distribute"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {crops.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              You haven't added any crops yet. Add your first crop above.
            </p>
          ) : (
            <ul className="space-y-2">
              {crops.map((crop, index) => (
                <li 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-md bg-muted/50 group"
                >
                  {editingIndex === index ? (
                    <Input
                      value={editedCrop}
                      onChange={(e) => setEditedCrop(e.target.value)}
                      className="flex-1 mr-2"
                      autoFocus
                    />
                  ) : (
                    <span className="flex-1">{crop}</span>
                  )}
                  <div className="flex space-x-1">
                    {editingIndex === index ? (
                      <Button 
                        size="icon" 
                        variant="outline"
                        onClick={() => handleSaveEdit(index)}
                        className="h-8 w-8"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={() => handleStartEdit(index)}
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      size="icon" 
                      variant="ghost"
                      onClick={() => handleDeleteCrop(index)}
                      className="h-8 w-8 text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
