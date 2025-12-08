import * as React from "react";
import {createContext, useContext, useEffect, useMemo, useState} from "react";
import {server} from "@/Server.ts";

export const useAuth = () => useContext(AuthContext)

export type Auth = {
    /**
     * null when the auth state is unknown, an empty string when logged out, and the user's ID otherwise.
     */
    userId: "" | string | null
    /**
     * Sets the user ID.
     * @param userId the user ID to set
     */
    logIn: (userId: string) => void
    /**
     * Clears the user ID.
     */
    logOut: () => void
}

const AuthContext = createContext<Auth>(null!);

/**
 * Provides authentication state to child components.
 * @param children the children to render
 */
export function AuthProvider({children}: { children: React.ReactNode }) {
    const [userId, setUserId] = useState<"" | string | null>(null);
    
    const value = useMemo<Auth>(() => ({
        userId,
        logIn: (userId: string) => setUserId(userId),
        logOut: () => setUserId(""),
    }), [userId]);

    useEffect(() => {
        server.me().then(userId => {
            setUserId(userId);
        });
    }, []);
    
    return <>
        <AuthContext value={value}>
            {children}
        </AuthContext>
    </>
}