import {Button} from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import PersonAdd from '@mui/icons-material/PersonAdd';
import {registerCredential, requestRequestToken, signInWithCredential} from "@/Server.ts";

export function Login({onLoginSuccess}: {onLoginSuccess: () => void}) {
    return <>
        <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", gap: "1rem"}}>
            <Button startIcon={<PersonAdd/>} variant="contained" onClick={async () => {
                const {headerName, requestToken} = await requestRequestToken();
                const headers = {[headerName]: requestToken,};
                let credential;
                try {
                    credential = await createCredential(headers, undefined);
                    await registerCredential(credential, headers, undefined);
                    onLoginSuccess();
                }
                catch (e) {
                }

                console.log(credential);
            }}>
                Register
            </Button>
            <Button startIcon={<LoginIcon/>} variant="outlined" onClick={async () => {
                const {headerName, requestToken} = await requestRequestToken();
                const headers = {[headerName]: requestToken,};
                let credential;
                try {
                    credential = await requestCredential(null, "optional", headers, undefined);
                    await signInWithCredential(credential, headers, undefined);
                    onLoginSuccess();
                }
                catch (e) {
                }
            }}>
                Sign In
            </Button>
        </div>
    </>
}