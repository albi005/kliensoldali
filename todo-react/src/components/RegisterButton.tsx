import {Button} from "@mui/material";
import {createCredential, registerWithPasskey, requestRequestToken, server} from "@/Server.ts";
import {useAuth} from "@/components/AuthProvider.tsx";

/**
 * Handles registering a new user using a Passkey
 */
export default function RegisterButton() {
    const auth = useAuth();

    const register = async () => {
        const {headerName, requestToken} = await requestRequestToken();
        const headers = {[headerName]: requestToken};
        let credential;
        try {
            credential = await createCredential(headers);
            if (!credential) return;
            await registerWithPasskey(credential, headers);
            const userId = await server.me();
            auth.logIn(userId);
        }
        catch (e) {
            console.log(e);
        }
    };
    
    return <>
        <Button variant="contained" onClick={register}>
            Register
        </Button>
    </>;
}
