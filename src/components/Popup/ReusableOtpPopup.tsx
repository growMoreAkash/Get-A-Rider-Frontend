import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '../Icon/IconX';// Update if using a different icon library

const ReusableOtpPopup = ({
    isOpen,
    onClose,
    otp,
    setOtp,
    onSubmit
}: any) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" open={isOpen} onClose={onClose} className="relative z-[51]">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-[black]/60" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center px-4 py-8">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 outline-none"
                                >
                                    <IconX />
                                </button>
                                <div className="p-5 mt-5">
                                    <h3 className="text-xl font-semibold mb-4">Enter OTP</h3>
                                    <input
                                        type="number"
                                        placeholder="Enter OTP"
                                        className="form-input mb-4 w-full"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                    <div className="flex justify-end space-x-4">
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger"
                                            onClick={onClose}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="btn bg-teal-500"
                                            onClick={() => {
                                                onClose();
                                                onSubmit();
                                            }}
                                        >
                                            Submit OTP
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ReusableOtpPopup;
