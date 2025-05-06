
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type UserRole = "farmer" | "distributor" | null;

interface RoleContextType {
  userRole: UserRole;
  userId: number | null;
  setUserRole: (role: UserRole) => void;
  setUserId: (id: number | null) => void;
  clearUserData: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load from local storage on initial render
    const savedRole = localStorage.getItem("croplink-role");
    const savedId = localStorage.getItem("croplink-userId");
    
    if (savedRole) {
      setUserRole(savedRole as UserRole);
    }
    
    if (savedId) {
      setUserId(parseInt(savedId, 10));
    }
  }, []);

  useEffect(() => {
    // Save to local storage whenever values change
    if (userRole) {
      localStorage.setItem("croplink-role", userRole);
    } else {
      localStorage.removeItem("croplink-role");
    }
    
    if (userId !== null) {
      localStorage.setItem("croplink-userId", userId.toString());
    } else {
      localStorage.removeItem("croplink-userId");
    }
    
    // Redirect based on role if it changes
    if (userRole === "farmer") {
      navigate("/farmer/dashboard");
    } else if (userRole === "distributor") {
      navigate("/distributor/dashboard");
    } else if (userRole === null && window.location.pathname !== "/") {
      navigate("/");
    }
  }, [userRole, userId, navigate]);

  const clearUserData = () => {
    setUserRole(null);
    setUserId(null);
    localStorage.removeItem("croplink-role");
    localStorage.removeItem("croplink-userId");
  };

  return (
    <RoleContext.Provider
      value={{
        userRole,
        userId,
        setUserRole,
        setUserId,
        clearUserData,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
