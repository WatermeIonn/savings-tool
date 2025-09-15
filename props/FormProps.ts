import { Input } from "@/classes/Input";
import { ReactNode } from "react";

export interface FormProps<T> {
  id?: string;
  onSubmit: (data: T, customVars?: { [key: string]: string }) => void;
  onChange?: (data: T, customVars?: { [key: string]: string }) => void;
  renderBottomContent?: () => ReactNode;
  submitText?: string;
  formInputs: Input[];
}
