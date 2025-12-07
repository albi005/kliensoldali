import {useAuth} from "@/components/AuthProvider.tsx";
import {Button} from "@mui/material";
import {server} from "@/Server.ts";

export default function LogOutButton() {
    const auth = useAuth();
    
    const logOut = async () => {
        await server.logOut();
        localStorage.clear();
        auth.logOut();
    };
    
    return <Button onClick={logOut} variant="contained">
        Log out
    </Button>;
}