import { SVGJSX } from "../types/types";

export function Button({type, text, icon, onTap}: {
    type: "primary" | "secondary" | "tertiary"
    text: string;
    icon?: SVGJSX;
    onTap: VoidFunction;
}) {
    const Icon = icon;
    return (
        <button className={type} onClick={onTap} style={icon ? {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "5px",
        } : undefined}>
            {icon ? <Icon width="18px" /> : undefined}
            {text}
        </button>
    )
}