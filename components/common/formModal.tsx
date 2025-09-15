"use client";

import React from "react";
import Form from "./form";
import { FormModalProps } from "@/props/FormModalProps";
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/modal";

export default function FormModal<T>({
  id,
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
    <>
      <span onClick={onOpen}>{buttonContent}</span>
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
                  id={id}
                  onSubmit={onSubmit}
                  onChange={onChange}
                  onClose={onClose}
                  submitText={submitText}
                  formInputs={formInputs}
                  renderBottomContent={renderBottomContent}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
