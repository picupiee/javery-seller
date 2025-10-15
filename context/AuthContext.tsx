import { auth, db } from "@/lib/firebase";
import { AugmentedUser, SellerProfile } from "@/types/index";
import { User, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: AugmentedUser | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const loadSellerProfile = async (
  uid: string
): Promise<SellerProfile | null> => {
  try {
    const docRef = doc(db, "sellers", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as SellerProfile;
    } else {
      console.error("Seller profile not found in Firestore for UID: ", uid);
      return null;
    }
  } catch (error) {
    console.error("Error fetching seller profile:", error);
    return null;
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const logout = () => {
    auth.signOut();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const profileData = await loadSellerProfile(firebaseUser.uid);

        if (profileData) {
          const augmentedUser: AugmentedUser = {
            ...firebaseUser,
            profile: profileData,
          };
          setUser(augmentedUser);
        } else {
          console.warn("Logged in user has no profile data. Logging out");
          await auth.signOut(); // force sign out
        }
      } catch (e) {
        console.error("Error during profile augmentation:", e);
        await auth.signOut(); // logout on failure
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    isLoading,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}
