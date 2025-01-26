import * as React from "react";
import { cn } from "src/lib/utils";
import { Button } from "./button";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
                className="fixed inset-0 bg-black opacity-50"
                onClick={onClose}
            ></div>
            <div className="bg-white rounded-lg shadow-lg p-6 z-10 max-w-lg w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <Button
                        size="sm"
                        onClick={onClose}
                        className="bg-red-500 text-white hover:bg-red-600"
                    >
                        Close
                    </Button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
};

export { Modal };
