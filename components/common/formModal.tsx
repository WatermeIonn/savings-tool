"use client";

import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { buttonClass } from "@/components/primitives";
import Form from "./form";
import { FormModalProps } from "@/props/FormModalProps";

// TODO: this modal is very similar to yes no modal, can they be refactored to remove the duplication?
export default function FormModal<T>({
  modalTitle,
  onSubmit,
  submitText,
  formInputs,
  buttonContent,
}: FormModalProps<T>) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="flex justify-center">
      <span onClick={onOpen} className={buttonClass.primary}>
        {buttonContent}
      </span>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {modalTitle}
              </ModalHeader>
              <ModalBody>
                <Form
                  onSubmit={onSubmit}
                  onClose={onClose}
                  submitText={submitText}
                  formInputs={formInputs}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
