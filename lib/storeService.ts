import {doc, setDoc} from "firebase/firestore"
import { db } from "./firebase";

export interface StoreStatus {
    sellerUid: string;
    isPinging: boolean;
    pingMessage: string;
    timestamp: string;
}

/**
 * Toggle the store's ping status and updates the promotional message.
 * @param sellerUid The UID of the seller
 * @param isPinging The new state (true to activate, false to deactivate)
 * @param message The promotional message (Will use default value if message is not set)
 */
export const toggleStorePing = async (
    sellerUid: string,
    isPinging: boolean,
    message: string,
): Promise<void> => {
    const storeStatusRef = doc(db, "storeStatuses", sellerUid);

    await setDoc(
        storeStatusRef,
        {
            sellerUid: sellerUid,
            isPinging: isPinging,
            pingMessage: isPinging ? message : "",
            timestamp: new Date().toISOString(),
        },
        {merge: true}
    )
}

