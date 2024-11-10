
export namespace Input {
    export function Text({type, design, placeholder}: {
        type?: string;
        design: "area";
        placeholder: string;
    }) {
        return (
            <input type={type} className={design} placeholder={placeholder} />
        )
    }
}