"use client";

import React, { ReactNode, useState } from "react";
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

export default function FormModal<T>({
  modalTitle,
  onSubmit,
  type,
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
                  type={type}
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
