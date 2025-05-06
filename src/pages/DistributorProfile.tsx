
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "@/contexts/RoleContext";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProfileForm from "@/components/ProfileForm";

const DistributorProfile = () => {
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

export default DistributorProfile;
