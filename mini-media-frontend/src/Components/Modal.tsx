import React, {
  cloneElement,
  forwardRef,
  isValidElement,
  MouseEvent,
  ReactElement,
  ReactNode,
  useImperativeHandle,
  useState,
} from "react";

interface CustomModalProps {
  modalTitle?: string;
  children: ReactNode;
  ModalTrigger?: ReactNode;
}

export interface ModalRef {
  toggleModal: () => void;
}

const Modal = forwardRef<ModalRef, CustomModalProps>(
  ({ ModalTrigger, children }, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => {
      setIsOpen(!isOpen);
    };

    const closeModal = (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        setIsOpen(false);
      }
    };

    useImperativeHandle(ref, () => ({
      toggleModal,
    }));

    return (
      <>
        {ModalTrigger && <div onClick={toggleModal}>{ModalTrigger}</div>}

        <div
          className={`fixed top-0 left-0 right-0 bottom-0 z-[999999999999999999999999] inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={closeModal}
        >
          <div
            className={`bg-white rounded-lg shadow-lg max-w-lg w-full p-6 transform transition-transform duration-300 ease-out ${
              isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-[-10%]"
            }`}
          >
            {isValidElement(children) && React.isValidElement(children)
              ? cloneElement(children as ReactElement<any>, {
                  closeModal: toggleModal,
                })
              : children}
          </div>
        </div>
      </>
    );
  }
);

export default Modal;
