import {CssBaseline} from "@mui/material";
import {AuthProvider} from "@/components/AuthProvider.tsx";
import Main from "@/components/Main.tsx";

/**
 * Wires up the authentication state and renders the MUI CSS reset and Main.
 * @constructor
 */
export function App() {
    return <>
        <CssBaseline/>
        <AuthProvider>
            <Main/>
        </AuthProvider>
    </>;
}
