
import { useRole } from "@/contexts/RoleContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, TruckIcon } from "lucide-react";

export default function RoleSelector() {
  const { setUserRole } = useRole();

  const handleRoleSelect = (role: "farmer" | "distributor") => {
    setUserRole(role);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-croplink-green-light/10 to-croplink-sand/20 p-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2 text-croplink-green-dark croplink-logo">CropLink</h1>
        <p className="text-xl text-gray-600">Connecting farmers and distributors locally</p>
      </div>

      <div className="max-w-4xl w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Select your role</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card 
            className="border-2 hover:border-croplink-green cursor-pointer transform transition-all hover:scale-105"
            onClick={() => handleRoleSelect("farmer")}
          >
            <CardHeader>
              <CardTitle className="flex items-center">
                <Leaf className="mr-2 h-6 w-6 text-croplink-green" />
                Farmer
              </CardTitle>
              <CardDescription>
                I grow crops and want to find distributors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create a profile for your farm, list the crops you grow, and connect with local distributors to sell your produce.
              </p>
              <Button className="w-full mt-4 bg-croplink-green hover:bg-croplink-green-dark">
                Join as Farmer
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="border-2 hover:border-croplink-brown cursor-pointer transform transition-all hover:scale-105"
            onClick={() => handleRoleSelect("distributor")}
          >
            <CardHeader>
              <CardTitle className="flex items-center">
                <TruckIcon className="mr-2 h-6 w-6 text-croplink-brown" />
                Distributor
              </CardTitle>
              <CardDescription>
                I buy and distribute agricultural products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                List the crops you're looking to distribute, find local farmers in your area, and build your supply chain network.
              </p>
              <Button className="w-full mt-4 bg-croplink-brown hover:bg-croplink-brown-dark">
                Join as Distributor
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <footer className="mt-16 text-center text-sm text-gray-500">
        <p>CropLink — Connecting Local Agriculture</p>
      </footer>
    </div>
  );
}
