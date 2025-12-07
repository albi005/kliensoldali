import {useAuth} from "@/components/AuthProvider.tsx";
import {Login} from "./Login";
import LogOutButton from "@/components/LogOutButton.tsx";
import {TodoList} from "@/components/TodoList.tsx";

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
        <LogOutButton/>
        <TodoList/>
    </>;
}