import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthModalOpen: boolean;
  authModalView: "signin" | "signup";
  openAuthModal: (view?: "signin" | "signup") => void;
  closeAuthModal: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<"signin" | "signup">("signin");

  const openAuthModal = (view: "signin" | "signup" = "signin") => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  const signIn = async (email: string, _password: string) => {
    // Mock sign in
    setUser({ id: "1", name: email.split("@")[0], email });
    closeAuthModal();
  };

  const signUp = async (name: string, email: string, _password: string) => {
    // Mock sign up
    setUser({ id: "1", name, email });
    closeAuthModal();
  };

  const signOut = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{ user, isAuthModalOpen, authModalView, openAuthModal, closeAuthModal, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
