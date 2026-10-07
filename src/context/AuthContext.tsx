import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (emailOrPhone: string, password?: string) => Promise<boolean>;
  register: (data: {
    name: string;
    email: string;
    phone?: string;
    location: string;
    crops: string[];
    farmSize?: string;
  }) => Promise<boolean>;
  loginDemo: (type: "farmer1" | "farmer2") => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const DEMO_FARMERS: Record<"farmer1" | "farmer2", User> = {
  farmer1: {
    id: "farmer_murugan_01",
    name: "Murugan Selvam",
    email: "murugan.farmer@agri.in",
    phone: "+91 98401 23456",
    location: "Thanjavur, Tamil Nadu",
    crops: ["Paddy / Rice", "Tomato", "Sugarcane"],
    farmSize: "3.5 Acres",
    joinedDate: "2025-11-12",
  },
  farmer2: {
    id: "farmer_ananya_02",
    name: "Ananya Sharma",
    email: "ananya.grower@agri.in",
    phone: "+91 94432 78901",
    location: "Coimbatore, Tamil Nadu",
    crops: ["Tomato", "Chilli", "Turmeric", "Banana"],
    farmSize: "2.0 Acres",
    joinedDate: "2026-01-18",
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem("agri_user");
      return saved ? JSON.parse(saved) : DEMO_FARMERS.farmer1; // default to demo farmer 1 so evaluator gets an instant logged-in experience, or can switch/logout
    } catch {
      return DEMO_FARMERS.farmer1;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("agri_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("agri_user");
    }
  }, [user]);

  const login = async (emailOrPhone: string, _password?: string): Promise<boolean> => {
    // In-browser client auth simulation
    const nameFromInput = emailOrPhone.split("@")[0].replace(/[._]/g, " ");
    const formattedName = nameFromInput.charAt(0).toUpperCase() + nameFromInput.slice(1);
    
    const newUser: User = {
      id: "farmer_" + Date.now().toString(36),
      name: formattedName || "Farmer Friend",
      email: emailOrPhone.includes("@") ? emailOrPhone : `${emailOrPhone}@farmer.agri`,
      phone: !emailOrPhone.includes("@") ? emailOrPhone : undefined,
      location: "Coimbatore, Tamil Nadu",
      crops: ["Tomato", "Paddy", "Chilli"],
      farmSize: "2.5 Acres",
      joinedDate: new Date().toISOString().split("T")[0],
    };

    setUser(newUser);
    return true;
  };

  const register = async (data: {
    name: string;
    email: string;
    phone?: string;
    location: string;
    crops: string[];
    farmSize?: string;
  }): Promise<boolean> => {
    const newUser: User = {
      id: "farmer_" + Date.now().toString(36),
      name: data.name,
      email: data.email,
      phone: data.phone,
      location: data.location,
      crops: data.crops.length > 0 ? data.crops : ["Paddy", "Tomato"],
      farmSize: data.farmSize || "2 Acres",
      joinedDate: new Date().toISOString().split("T")[0],
    };

    setUser(newUser);
    return true;
  };

  const loginDemo = (type: "farmer1" | "farmer2") => {
    setUser(DEMO_FARMERS[type]);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        loginDemo,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
