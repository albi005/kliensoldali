import {Button} from "@mui/material";
import {requestCredential, requestRequestToken, server, signInWithCredential} from "@/Server.ts";
import {useAuth} from "@/components/AuthProvider.tsx";

export default function SignInButton() {
    const auth = useAuth();

    const logIn = async () => {
        const {headerName, requestToken} = await requestRequestToken();
        const headers = {[headerName]: requestToken,};
        try {
            const credential = await requestCredential(null, "optional", headers, undefined);
            if (!credential) return;
            await signInWithCredential(credential, headers, undefined);
            const userId = await server.me();
            auth.logIn(userId);
        }
        catch (e) {
        }
    };
    
    return <>
        <Button onClick={logIn} variant="outlined">
            Log in
        </Button>
    </>;
}