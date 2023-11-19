import { BaseInput } from "@/classes/BaseInput";
import { ReactNode } from "react";

export interface FormProps<T> {
  id?: string;
  onSubmit: (data: T) => void;
  onChange?: (data: T) => void;
  renderBottomContent?: () => ReactNode;
  submitText?: string;
  formInputs: BaseInput[];
}
