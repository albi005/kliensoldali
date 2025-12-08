import {Button} from "@mui/material";
import {requestCredential, requestRequestToken, server, signInWithCredential} from "@/Server.ts";
import {useAuth} from "@/components/AuthProvider.tsx";

/**
 * Handles signing in using a Passkey
 */
export default function SignInButton() {
    const auth = useAuth();

    const logIn = async () => {
        const {headerName, requestToken} = await requestRequestToken();
        const headers = {[headerName]: requestToken,};
        try {
            const credential = await requestCredential("optional", headers);
            if (!credential) return;
            await signInWithCredential(credential, headers);
            const userId = await server.me();
            auth.logIn(userId);
        }
        catch (e) {
        }
    };
    
    return <>
        <Button onClick={logIn} variant="outlined">
            Sign In
        </Button>
    </>;
}