import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface ConfirmModalProps {
    title: string;
    children: React.ReactNode;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmModal = ({ title, children, onConfirm, onCancel }: ConfirmModalProps) => {
    return (
        <Transition appear show as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onCancel}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30" />
                </Transition.Child>

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-150"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg">
                            <Dialog.Title className="text-lg font-medium">{title}</Dialog.Title>
                            <div className="mt-4 text-sm text-gray-700">{children}</div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={onCancel}
                                    className="px-4 py-2 bg-gray-200 text-sm rounded hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                                >
                                    Confirm
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};
