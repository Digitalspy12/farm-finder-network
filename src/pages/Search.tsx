
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "@/contexts/RoleContext";
import DashboardSidebar from "@/components/DashboardSidebar";
import SearchResults from "@/components/SearchResults";

const Search = () => {
  const { userRole } = useRole();
  const navigate = useNavigate();

  // Redirect if no role is selected
  useEffect(() => {
    if (!userRole) {
      navigate("/");
    }
  }, [userRole, navigate]);

  if (!userRole) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <DashboardSidebar activePage="search" />
      
      <div className="flex-1 p-8">
        <div className="page-container">
          <h1 className="text-3xl font-bold mb-6">
            Find {userRole === "farmer" ? "Distributors" : "Farmers"}
          </h1>
          
          <div className="mb-8">
            <p className="text-muted-foreground">
              Search for {userRole === "farmer" ? "distributors" : "farmers"} in your area. Filter by crop type and location to find the best matches.
            </p>
          </div>
          
          <SearchResults />
        </div>
      </div>
    </div>
  );
};

export default Search;
