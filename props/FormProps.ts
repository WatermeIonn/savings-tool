import { FormInputInterface } from "@/interfaces/FormInputInterface";

export interface FormProps<T> {
  onSubmit: (goal: T) => void;
  submitText?: string;
  type: new () => T;
  formInputs: FormInputInterface[];
}
