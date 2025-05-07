
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "@/contexts/RoleContext";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProfileForm from "@/components/ProfileForm";

const DistributorDashboard = () => {
  const { userRole } = useRole();
  const navigate = useNavigate();

  // Redirect if user is not a distributor
  useEffect(() => {
    if (userRole !== "distributor") {
      navigate("/");
    }
  }, [userRole, navigate]);

  if (userRole !== "distributor") return null;

  return (
    <div className="dashboard-container">
      <DashboardSidebar activePage="dashboard" />
      
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Distributor Dashboard</h1>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Welcome to CropLink!</h2>
          <p className="mb-4">
            This is your distributor dashboard where you can manage your profile, crops, and search for farmers.
          </p>
          <p>To get started, please complete your profile information below.</p>
        </div>
        
        <ProfileForm />
      </div>
    </div>
  );
};

export default DistributorDashboard;
