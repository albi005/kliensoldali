import {useAuth} from "@/components/AuthProvider.tsx";
import {Button} from "@mui/material";
import {server} from "@/Server.ts";
import Logout from "@mui/icons-material/Logout";

/**
 * Handles logging out
 */
export default function LogOutButton() {
    const auth = useAuth();
    
    const logOut = async () => {
        await server.logOut();
        localStorage.clear();
        auth.logOut();
    };
    
    return <Button startIcon={<Logout/>} onClick={logOut} variant="text">
        Log out
    </Button>;
}