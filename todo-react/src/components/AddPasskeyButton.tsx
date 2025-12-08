import {useAuth} from "@/components/AuthProvider.tsx";
import {addPasskey, createCredential, requestRequestToken} from "@/Server.ts";
import {Button, type SnackbarCloseReason} from "@mui/material";
import Add from "@mui/icons-material/Add";
import {type JSX, type SyntheticEvent, useState} from "react";
import Snackbar from '@mui/material/Snackbar';

/**
 * Allows adding a new Passkey to the current user's account.
 */
export default function AddPasskeyButton(): JSX.Element {
    const auth = useAuth();
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const register = async () => {
        const {headerName, requestToken} = await requestRequestToken();
        const headers = {[headerName]: requestToken};
        let credential;
        try {
            credential = await createCredential(headers);
            if (!credential) return;
            await addPasskey(credential, headers);
            setSnackbarOpen(true);
        }
        catch (e) {
        }
    };

    const handleClose = (
        event: SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarOpen(false);
    };

    return <>
        <Button startIcon={<Add/>} onClick={register}>
            Add passkey
        </Button>
        <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={handleClose}
            message="Passkey added successfully"
        />
    </>;
}