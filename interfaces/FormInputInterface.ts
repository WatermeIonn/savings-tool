import { FormInputTypeEnum } from "@/enums/FormInputTypeEnum";
import { ReactNode } from "react";

export interface FormInputInterface {
    hasError?: boolean;
    errorMessage?: string;
    label: string;
    name: string;
    isRequired: boolean;
    startContent?: ReactNode;
    value?: string;
    type: FormInputTypeEnum;
  }