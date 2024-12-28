import { FunctionComponent } from "preact";

export type SVGJSX = FunctionComponent<preact.JSX.SVGAttributes>;

/** Signature for the function that is conventional status listener. */
export type StatusListener<T> = (status: T) => void;