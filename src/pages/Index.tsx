
import RoleSelector from "@/components/RoleSelector";
import { useRole } from "@/contexts/RoleContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Index = () => {
  const { userRole } = useRole();
  const navigate = useNavigate();

  // Redirect if user already has a role
  useEffect(() => {
    if (userRole === "farmer") {
      navigate("/farmer/dashboard");
    } else if (userRole === "distributor") {
      navigate("/distributor/dashboard");
    }
  }, [userRole, navigate]);

  return <RoleSelector />;
};

export default Index;
