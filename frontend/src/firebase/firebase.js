import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { initializeApp } from "@firebase/app";
import { useState, useEffect, useContext, createContext } from "react";

export const firebaseApp = initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
});

export const AuthContext = createContext();

export const AuthContextProvider = (props) => {
    const [user, setUser] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(null);

    useEffect(() => {
        const auth = getAuth(firebaseApp);
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        }, (error) => {
            setError(error);
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    return <AuthContext.Provider {...props} value={{ user, error, loading }} />;
}

export const useAuthState = () => {
    const auth = useContext(AuthContext);
    return { ...auth, isAuthenticated: auth.user != null }
}
