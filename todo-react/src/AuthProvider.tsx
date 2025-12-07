import {createContext, type JSX, useContext} from "react";



export const useAuth = () => useContext(Context)

const Context = createContext<number>(null);

export function AuthProvider({children}: { children: JSX.Element }) {
    return <>
        <Context value={1}></Context>
        {children}
    </>
}