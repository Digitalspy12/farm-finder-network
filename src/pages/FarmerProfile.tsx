
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "@/contexts/RoleContext";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProfileForm from "@/components/ProfileForm";

const FarmerProfile = () => {
  const { userRole } = useRole();
  const navigate = useNavigate();

  // Redirect if user is not a farmer
  useEffect(() => {
    if (userRole !== "farmer") {
      navigate("/");
    }
  }, [userRole, navigate]);

  if (userRole !== "farmer") {
    return null;
  }

  return (
    <div className="dashboard-container">
      <DashboardSidebar activePage="profile" />
      
      <div className="flex-1 p-8">
        <div className="page-container">
          <h1 className="text-3xl font-bold mb-6">Manage Your Profile</h1>
          
          <ProfileForm />
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;
