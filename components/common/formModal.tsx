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

export default function FormModal<T>({
  modalTitle,
  onSubmit,
  onChange,
  submitText,
  formInputs,
  buttonContent,
  size,
  renderBottomContent,
}: FormModalProps<T>) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="flex justify-center">
      <span onClick={onOpen} className={buttonClass.primary}>
        {buttonContent}
      </span>
      <Modal
        size={size ?? "lg"}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {modalTitle}
              </ModalHeader>
              <ModalBody>
                <Form
                  onSubmit={onSubmit}
                  onChange={onChange}
                  onClose={onClose}
                  submitText={submitText}
                  formInputs={formInputs}
                />
                {renderBottomContent && renderBottomContent()}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
