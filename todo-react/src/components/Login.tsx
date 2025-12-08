import SignInButton from "@/components/SignInButton.tsx";
import RegisterButton from "@/components/RegisterButton.tsx";

/**
 * The page shown when the user is logged out.
 */
export function Login() {
    return <>
        <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", gap: "1rem"}}>
            <RegisterButton/>
            <SignInButton/>
        </div>
    </>
}