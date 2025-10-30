import React, { createContext, useContext, useState, useEffect } from "react";

type UserRole = "hr" | "candidate" | null;

interface UserContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isHR: boolean;
  isCandidate: boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [role, setRoleState] = useState<UserRole>(null);

  useEffect(() => {
    // Load role from localStorage on mount
    const savedRole = localStorage.getItem("userRole") as UserRole;
    if (savedRole) {
      setRoleState(savedRole);
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole) {
      localStorage.setItem("userRole", newRole);
    } else {
      localStorage.removeItem("userRole");
    }
  };

  const logout = () => {
    setRole(null);
    localStorage.clear();
  };

  return (
    <UserContext.Provider
      value={{
        role,
        setRole,
        isHR: role === "hr",
        isCandidate: role === "candidate",
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};
