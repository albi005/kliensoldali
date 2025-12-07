import {useAuth} from "@/components/AuthProvider.tsx";
import {Button} from "@mui/material";
import {server} from "@/Server.ts";
import Logout from "@mui/icons-material/Logout";

export default function LogOutButton() {
    const auth = useAuth();
    
    const logOut = async () => {
        await server.logOut();
        localStorage.clear();
        auth.logOut();
    };
    
    return <Button endIcon={<Logout/>} onClick={logOut} variant="text">
        Log out
    </Button>;
}