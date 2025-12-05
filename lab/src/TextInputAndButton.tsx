import {TextInput, TextInputProps} from "./TextInput";
import "./TextInput.css";
import {IconButton} from "./IconButton";

export type TextInputAndButtonProps = TextInputProps & {
    buttonContent?: string;
    onClick?: () => void;
    icon: string;
}

export function TextInputAndButton({buttonContent, onClick, icon, ...textInputProps}: TextInputAndButtonProps) {
    return <div class="TextInputAndButton">
        <TextInput {...textInputProps} onEnter={onClick}/>
        <IconButton icon={icon} text={buttonContent} onClick={onClick} />
    </div>
}