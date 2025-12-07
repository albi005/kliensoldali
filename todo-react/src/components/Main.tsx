import {useAuth} from "@/components/AuthProvider.tsx";
import {Login} from "./Login";
import {LoggedIn} from "@/components/LoggedIn.tsx";

export default function Main() {
    const {userId} = useAuth();

    if (userId === null)
        return (
            <div>Loading...</div>
        );

    if (userId === "")
        return (
            <Login/>
        );
    
    return <>
        <LoggedIn/>
    </>;
}