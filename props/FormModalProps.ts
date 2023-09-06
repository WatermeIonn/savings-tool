import { ReactNode } from "react";
import { FormProps } from "./FormProps";

export interface FormModalProps<T> extends FormProps<T> {
  modalTitle: string;
  buttonContent: ReactNode;
}
