import "./IconButton.css";

type IconButtonProps = {
    icon: string
    text: string
    onClick: () => void
}

export function IconButton({icon, onClick, text, ...props}: IconButtonProps) {

    return <button type="button" onClick={onClick} {...props} class="IconButton">
        <span className="material-symbols-outlined">
            {icon}
        </span>
        {text}
    </button>;
}