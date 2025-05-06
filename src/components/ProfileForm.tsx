
import { useState, useEffect } from "react";
import { useRole } from "@/contexts/RoleContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { fetchData, postData, updateData } from "@/utils/apiUtils";
import { Farmer, Distributor } from "@/types";

export default function ProfileForm() {
  const { userRole, userId, setUserId } = useRole();
  const [formData, setFormData] = useState(
    userRole === "farmer"
      ? {
          name: "",
          farmName: "",
          contact: "",
          location: "",
          crops: [] as string[],
        }
      : {
          name: "",
          companyName: "",
          contact: "",
          location: "",
          crops: [] as string[],
        }
  );
  const [isLoading, setIsLoading] = useState(false);

  const endpoint = userRole === "farmer" ? "farmers" : "distributors";

  useEffect(() => {
    const loadUserData = async () => {
      if (userId) {
        setIsLoading(true);
        const data = await fetchData(`${endpoint}/${userId}`);
        if (data) {
          setFormData(data);
        }
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [userId, endpoint]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.name || !formData.contact || !formData.location) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsLoading(true);
    
    try {
      // If user has an ID, update their profile, otherwise create a new one
      let response;
      
      if (userId) {
        response = await updateData(endpoint, userId, formData);
      } else {
        response = await postData(endpoint, formData);
        if (response && response.id) {
          setUserId(response.id);
        }
      }
      
      if (response) {
        toast.success("Profile saved successfully");
      }
    } catch (error) {
      console.error("Profile save error:", error);
      toast.error("Failed to save profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {userRole === "farmer" ? "Farmer Profile" : "Distributor Profile"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name*</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor={userRole === "farmer" ? "farmName" : "companyName"}>
                {userRole === "farmer" ? "Farm Name*" : "Company Name*"}
              </Label>
              <Input
                id={userRole === "farmer" ? "farmName" : "companyName"}
                name={userRole === "farmer" ? "farmName" : "companyName"}
                value={
                  userRole === "farmer"
                    ? (formData as Farmer).farmName
                    : (formData as Distributor).companyName
                }
                onChange={handleInputChange}
                placeholder={
                  userRole === "farmer"
                    ? "Enter your farm's name"
                    : "Enter your company's name"
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="contact">Contact Number*</Label>
              <Input
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                placeholder="Enter your contact number"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location*</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="City, State"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-croplink-green hover:bg-croplink-green-dark"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
