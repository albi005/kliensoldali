import {useState} from "preact/hooks";
import "./RightPane.css";
import {TextInputAndButton} from "./TextInputAndButton";

export function RightPane() {
    let [message, setMessage] = useState("");
    return <div class="RightPane">
        <div/>
        <TextInputAndButton value={message} onChange={setMessage} buttonContent="Send"
                            placeholder="Write a message..." icon="send"/>
    </div>
}