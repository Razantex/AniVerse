import classNames from "classnames";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import Button from "./Button";
import Input from "./Input";
import Modal, { ModalRef } from "./Modal";

interface DeleteConfirmationProps extends React.HTMLAttributes<HTMLDivElement> {
  confirmString?: string;
  onConfirm?: () => void;
  isLoading?: boolean;
  reference?: React.ReactNode;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = (props) => {
  const modalRef = useRef<ModalRef>(null);
  const [inputValue, setInputValue] = useState("");

  const {
    children,
    confirmString = "delete",
    onConfirm,
    isLoading = false,
    reference = (
      <Button
        LeftIcon={AiFillDelete}
        isLoading={isLoading}
        className="text-red-500 bg-red-500/20 hover:text-white hover:bg-red-500/80"
      >
        Delete
      </Button>
    ),
    className,
    ...restProps
  } = props;

  const isButtonDisable = useMemo(
    () => inputValue.toLowerCase() !== confirmString.toLowerCase(),
    [inputValue, confirmString]
  );

  const handleInputChange: React.FormEventHandler<HTMLInputElement> =
    useCallback((e) => {
      const target = e.target as HTMLInputElement;

      setInputValue(target.value);
    }, []);

  const handleConfirm = useCallback(() => {
    if (isButtonDisable) return;

    onConfirm?.();

    modalRef.current?.close();
  }, [isButtonDisable, onConfirm]);

  return (
    <Modal ref={modalRef} className="md:w-1/3 w-11/12" reference={reference}>
      <div className={classNames("space-y-4", className)} {...restProps}>
        {children}

        <b>{`Enter "${confirmString}" to confirm deletion.`}</b>

        <Input
          onChange={handleInputChange}
          className="px-2 py-1 focus:ring focus:ring-primary-500/60"
        />

        <Button
          className={classNames(
            "w-full text-red-500 bg-red-500/20 flex items-center justify-center",
            !isButtonDisable && "hover:text-white hover:bg-red-500/80",
            isButtonDisable && "opacity-60"
          )}
          disabled={isButtonDisable}
          onClick={handleConfirm}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmation;
