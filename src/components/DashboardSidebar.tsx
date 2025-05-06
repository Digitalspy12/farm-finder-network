
import { useNavigate } from "react-router-dom";
import { useRole } from "@/contexts/RoleContext";
import { Home, Leaf, Search, User, X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SidebarProps {
  activePage: string;
}

export default function DashboardSidebar({ activePage }: SidebarProps) {
  const { userRole, clearUserData } = useRole();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    clearUserData();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isFarmer = userRole === "farmer";
  const baseUrl = isFarmer ? "/farmer" : "/distributor";

  const navItems = [
    {
      name: "Dashboard",
      icon: Home,
      path: `${baseUrl}/dashboard`,
    },
    {
      name: "Profile",
      icon: User,
      path: `${baseUrl}/profile`,
    },
    {
      name: "My Crops",
      icon: Leaf,
      path: `${baseUrl}/crops`,
    },
    {
      name: "Search",
      icon: Search,
      path: "/search",
    },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleSidebar}
      >
        {sidebarOpen ? <X /> : <Menu />}
      </Button>

      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 z-40 ${
          sidebarOpen ? "w-64" : "w-0 md:w-20"
        } md:relative md:block`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6">
            <div className="flex items-center space-x-2">
              <Leaf className={`h-8 w-8 text-croplink-green ${!sidebarOpen && "md:mx-auto"}`} />
              {(sidebarOpen || window.innerWidth >= 768) && (
                <h2 className={`text-xl font-bold croplink-logo ${!sidebarOpen && "md:hidden"}`}>
                  CropLink
                </h2>
              )}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {(sidebarOpen || window.innerWidth >= 768) && (
                <p className={!sidebarOpen ? "md:hidden" : ""}>
                  Logged in as {isFarmer ? "Farmer" : "Distributor"}
                </p>
              )}
            </div>
          </div>

          <nav className="flex-1 px-4 mt-6">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Button
                    variant={activePage === item.name.toLowerCase() ? "secondary" : "ghost"}
                    className={`w-full justify-start ${
                      !sidebarOpen && "md:justify-center"
                    } ${
                      activePage === item.name.toLowerCase()
                        ? "bg-croplink-green/10 hover:bg-croplink-green/20 text-croplink-green-dark"
                        : ""
                    }`}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className={`h-5 w-5 ${!sidebarOpen && "md:mx-auto"}`} />
                    {(sidebarOpen || window.innerWidth >= 768) && (
                      <span className={`ml-2 ${!sidebarOpen && "md:hidden"}`}>{item.name}</span>
                    )}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 mt-auto">
            <Button
              variant="outline"
              className="w-full text-gray-700 hover:text-red-600"
              onClick={handleLogout}
            >
              {(sidebarOpen || window.innerWidth >= 768) ? (
                <span className={!sidebarOpen ? "md:hidden" : ""}>Log Out</span>
              ) : (
                <X className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
