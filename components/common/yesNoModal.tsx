"use client";

import { buttonClass } from "@/components/primitives";
import { YesNoModalProps } from "@/props/YesNoModalProps";
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/modal";

export default function YesNoModal({
  buttonContent,
  message,
  noText,
  yesText,
  onYes,
}: YesNoModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <span onClick={onOpen} className="cursor-pointer">
        {buttonContent}
      </span>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{message}</ModalHeader>
              <ModalBody>
                <div className="flex-row">
                  <span
                    onClick={onClose}
                    className={`${buttonClass.primary} w-24 flex-col`}
                  >
                    {noText}
                  </span>
                  <span
                    onClick={() => {
                      onClose();
                      onYes();
                    }}
                    className={`${buttonClass.danger} w-24 flex-col float-right`}
                  >
                    {yesText}
                  </span>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
