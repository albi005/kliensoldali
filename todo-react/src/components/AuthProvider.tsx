import * as React from "react";
import {createContext, useContext, useEffect, useMemo, useState} from "react";
import {server} from "@/Server.ts";

export const useAuth = () => useContext(AuthContext)

export type Auth = {
    userId: string | null
    logIn: (userId: string) => void
    logOut: () => void
}

const AuthContext = createContext<Auth>(null!);

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [userId, setUserId] = useState<"" | string | null>(null);
    
    const value = useMemo<Auth>(() => ({
        userId,
        logIn: (userId: string) => setUserId(userId),
        logOut: () => setUserId(null),
    }), [userId]);

    useEffect(() => {
        server.me().then(userId => {
            if (userId) {
                setUserId(userId);
            }
        });
    }, []);
    
    return <>
        <AuthContext value={value}>
            {children}
        </AuthContext>
    </>
}