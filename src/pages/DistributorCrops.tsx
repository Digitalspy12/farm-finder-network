
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "@/contexts/RoleContext";
import DashboardSidebar from "@/components/DashboardSidebar";
import CropManagement from "@/components/CropManagement";

const DistributorCrops = () => {
  const { userRole } = useRole();
  const navigate = useNavigate();

  // Redirect if user is not a distributor
  useEffect(() => {
    if (userRole !== "distributor") {
      navigate("/");
    }
  }, [userRole, navigate]);

  if (userRole !== "distributor") {
    return null;
  }

  return (
    <div className="dashboard-container">
      <DashboardSidebar activePage="my crops" />
      
      <div className="flex-1 p-8">
        <div className="page-container">
          <h1 className="text-3xl font-bold mb-6">Manage Your Crops</h1>
          
          <div className="mb-8">
            <p className="text-muted-foreground">
              Add, edit, or remove the crops you distribute. This information will be visible to farmers searching for distributors.
            </p>
          </div>
          
          <CropManagement />
        </div>
      </div>
    </div>
  );
};

export default DistributorCrops;
