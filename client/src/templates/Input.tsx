import { useRef } from "preact/hooks";

/** Signature for the function that is called when the value of a input element is changed. */
export type InputTextListener = (newValue: string) => void;

export namespace Input {
    export function Text({type, design, onChange, placeholder}: {
        type?: string;
        design: "form";
        onChange?: InputTextListener;
        placeholder?: string;
    }) {
        const ref = useRef<HTMLInputElement>(null);

        return (
            <input ref={ref} type={type} className={design} placeholder={placeholder} onChange={() => {
                if (onChange) onChange(ref.current.value);
            }} />
        )
    }
}