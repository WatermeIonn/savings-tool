"use client";

import React, { useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import { GoalDto } from "@/dtos/goal.dto";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { buttonClass } from "./primitives";
import AddGoalForm from "./addGoalForm";

interface AddGoalButtonProps {
  onAdd: (goal: GoalDto) => void;
  label: string;
}

export default function AddGoalButton({ onAdd }: AddGoalButtonProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="flex justify-center">
      <span onClick={onOpen} className={buttonClass.primary}>
        <IconPlus className="rounded-full border-1 border-white mr-2" />
        Add New Goal
      </span>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add New Goal
              </ModalHeader>
              <ModalBody>
                <AddGoalForm onAdd={onAdd} onClose={onClose}/>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
