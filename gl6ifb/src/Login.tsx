import "./Login.css";
import {useState} from "preact/hooks";
import {TextInput} from "./TextInput";

export function Login() {
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [displayName, setDisplayName] = useState("");
    let [register, setRegister] = useState(false);

    return <div class="Login">
        <span class="logo" onClick={_ => {
            document.documentElement.classList.toggle("theme-light");
            localStorage["theme"] = localStorage["theme"] ? "" : "light";
        }}>
            🗪
        </span>
        <TextInput type="email" placeholder="Email (someone@example.com)" value={email} onChange={
            setEmail} autofocus={true}/>
        <TextInput type="password" placeholder="Password" value={password} onChange={setPassword}/>
        {register &&
            <TextInput type="text" placeholder="Display Name (Agent Smith)" value={displayName}
                       onChange={setDisplayName}/>
        }
        <button type="button">
            {register ? "Register" : "Login"}
        </button>
        <p>{register ? "Switch back to " : "Have no account yet? Go and "}
            <a href="" onClick={e => {
                e.preventDefault();
                setRegister(!register);
            }}>
                {register ? "Login" : "Register"}
            </a>
        </p>
    </div>
}