import { ReactNode } from "react";

export interface YesNoModalProps {
    message: string;
    noText: string;
    yesText: string;
    onYes: () => void;
    buttonContent: ReactNode;
}