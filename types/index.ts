import { User } from "firebase/auth";

export interface SellerProfile {
    uid: string;
    email: string;
    storeName: string;
    createdAt: string;
}

export interface AugmentedUser extends User {
    profile: SellerProfile
}