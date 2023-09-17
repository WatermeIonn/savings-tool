import { FormInputInterface } from "@/interfaces/FormInputInterface";

export interface FormProps<T> {
  onSubmit: (goal: T) => void;
  submitText?: string;
  formInputs: FormInputInterface[];
}
