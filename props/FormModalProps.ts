import { ReactNode } from "react";
import { FormProps } from "./FormProps";

export interface FormModalProps<T> extends FormProps<T> {
  modalTitle: string;
  buttonContent: ReactNode;
  size?:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "full";
}
