import "./index.css";

import {CssBaseline} from "@mui/material";
import {AuthProvider} from "@/components/AuthProvider.tsx";
import Main from "@/components/Main.tsx";

export function App() {
    return <>
        <CssBaseline/>
        <AuthProvider>
            <Main/>
        </AuthProvider>
    </>;
}
