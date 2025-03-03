import React from 'react';

const UploadDocumentVerify = () => {
    return (
        <div>
            <div className="bg-[#2E3F6E] mx-auto w-full h-9 text-center text-white p-2 rounded-md mb-4">UPLOADED DOCUMENTS VERIFICATION</div>
            <div className="flex flex-col w-full">
                <div className="flex flex-col gap-2 mt-5 w-full">
                    <div className="w-full">
                        <label htmlFor="dropdown" className="text-md font-bold">
                            Address proof
                        </label>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="w-full flex justify-between items-center px-4 py-2 border-[#428BC1] border-2 rounded">
                            <div className="text-[#428BC1]">
                                <p>Driver’s Photo</p>
                            </div>
                            <div className="flex gap-4 items-center">
                                <div>
                                    <label className="inline-flex mb-0">
                                        <input type="checkbox" className="form-checkbox h-6 w-6" />
                                        <span className="text-base">Yes</span>
                                    </label>
                                </div>
                                <div>
                                    <label className="inline-flex mb-0">
                                        <input type="checkbox" className="form-checkbox h-6 w-6" />
                                        <span className="text-base">No</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-start">
                            <label className="w-48 h-40 flex items-center justify-center border-dashed border-2 rounded-md cursor-pointer">
                                <div className="text-center">
                                    <span className="text-gray-500">Upload Image</span>
                                    <p className="text-xs text-gray-400">5MB image note</p>
                                </div>
                                <input
                                    type="file"
                                    accept="image/png"
                                    // onChange={handleLogoChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2 mt-5 w-full">
                    <div className="w-full">
                        <label htmlFor="dropdown" className="text-md font-bold">
                            Identity Photo
                        </label>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="w-full flex justify-between items-center px-4 py-2 border-[#428BC1] border-2 rounded">
                            <div className="text-[#428BC1]">
                                <p>Aadhaar card photo</p>
                            </div>
                            <div className="flex gap-4 items-center">
                                <div>
                                    <label className="inline-flex mb-0">
                                        <input type="checkbox" className="form-checkbox h-6 w-6" />
                                        <span className="text-base">Yes</span>
                                    </label>
                                </div>
                                <div>
                                    <label className="inline-flex mb-0">
                                        <input type="checkbox" className="form-checkbox h-6 w-6" />
                                        <span className="text-base">No</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-start">
                            <div className="flex flex-col">
                                               <label className="w-48 h-40 flex items-center justify-center border-dashed border-2 rounded-md cursor-pointer">
                                    {/* {logoPreview ? ( */}

                                    <div className="text-center">
                                        <span className="text-gray-500">Upload Image</span>
                                        <p className="text-xs text-gray-400">5MB image note</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/png"
                                        // onChange={handleLogoChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <div className="flex flex-col">
                                               <label className="w-48 h-40 flex items-center justify-center border-dashed border-2 rounded-md cursor-pointer">
                                    {/* {logoPreview ? ( */}

                                    <div className="text-center">
                                        <span className="text-gray-500">Upload Image</span>
                                        <p className="text-xs text-gray-400">5MB image note</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/png"
                                        // onChange={handleLogoChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2 mt-5 w-full">
                    <div className="w-full">
                        <label htmlFor="dropdown" className="text-md font-bold">
                            Driving License Photo
                        </label>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="w-full flex justify-between items-center px-4 py-2 border-[#428BC1] border-2 rounded">
                            <div className="text-[#428BC1]">
                                <p>Driving License Photo</p>
                            </div>
                            <div className="flex gap-4 items-center">
                                <div>
                                    <label className="inline-flex mb-0">
                                        <input type="checkbox" className="form-checkbox h-6 w-6" />
                                        <span className="text-base">Yes</span>
                                    </label>
                                </div>
                                <div>
                                    <label className="inline-flex mb-0">
                                        <input type="checkbox" className="form-checkbox h-6 w-6" />
                                        <span className="text-base">No</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-start">
                            <div className="flex flex-col">
                                               <label className="w-48 h-40 flex items-center justify-center border-dashed border-2 rounded-md cursor-pointer">
                                    {/* {logoPreview ? ( */}

                                    <div className="text-center">
                                        <span className="text-gray-500">Upload Image</span>
                                        <p className="text-xs text-gray-400">5MB image note</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/png"
                                        // onChange={handleLogoChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <div className="flex flex-col">
                                               <label className="w-48 h-40 flex items-center justify-center border-dashed border-2 rounded-md cursor-pointer">
                                    {/* {logoPreview ? ( */}

                                    <div className="text-center">
                                        <span className="text-gray-500">Upload Image</span>
                                        <p className="text-xs text-gray-400">5MB image note</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/png"
                                        // onChange={handleLogoChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2 mt-5 w-full">
                    <div className="w-full">
                        <label htmlFor="dropdown" className="text-md font-bold">
                            PAN Card Photo
                        </label>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="w-full flex justify-between items-center px-4 py-2 border-[#428BC1] border-2 rounded">
                            <div className="text-[#428BC1]">
                                <p>PAN Card Photo</p>
                            </div>
                            <div className="flex gap-4 items-center">
                                <div>
                                    <label className="inline-flex mb-0">
                                        <input type="checkbox" className="form-checkbox h-6 w-6" />
                                        <span className="text-base">Yes</span>
                                    </label>
                                </div>
                                <div>
                                    <label className="inline-flex mb-0">
                                        <input type="checkbox" className="form-checkbox h-6 w-6" />
                                        <span className="text-base">No</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-start">
                            <div className="flex flex-col">
                                               <label className="w-48 h-40 flex items-center justify-center border-dashed border-2 rounded-md cursor-pointer">
                                    {/* {logoPreview ? ( */}

                                    <div className="text-center">
                                        <span className="text-gray-500">Upload Image</span>
                                        <p className="text-xs text-gray-400">5MB image note</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/png"
                                        // onChange={handleLogoChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <div className="flex flex-col">
                                               <label className="w-48 h-40 flex items-center justify-center border-dashed border-2 rounded-md cursor-pointer">
                                    {/* {logoPreview ? ( */}

                                    <div className="text-center">
                                        <span className="text-gray-500">Upload Image</span>
                                        <p className="text-xs text-gray-400">5MB image note</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/png"
                                        // onChange={handleLogoChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2 mt-5 w-full">
                    <div className="w-full">
                        <label htmlFor="dropdown" className="text-md font-bold">
                            Address proof , QR Code , Bank Passbook
                        </label>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="w-full flex justify-between items-center px-4 py-2 border-[#428BC1] border-2 rounded">
                            <div className="text-[#428BC1]">
                                <p>Address proof , QR Code , Bank Passbook</p>
                            </div>
                            <div className="flex gap-4 items-center">
                                <div>
                                    <label className="inline-flex mb-0">
                                        <input type="checkbox" className="form-checkbox h-6 w-6" />
                                        <span className="text-base">Yes</span>
                                    </label>
                                </div>
                                <div>
                                    <label className="inline-flex mb-0">
                                        <input type="checkbox" className="form-checkbox h-6 w-6" />
                                        <span className="text-base">No</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-start">
                            <div className="flex flex-col">
                                               <label className="w-48 h-40 flex items-center justify-center border-dashed border-2 rounded-md cursor-pointer">
                                    {/* {logoPreview ? ( */}

                                    <div className="text-center">
                                        <span className="text-gray-500">Upload Image</span>
                                        <p className="text-xs text-gray-400">5MB image note</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/png"
                                        // onChange={handleLogoChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <div className="flex flex-col">
                                               <label className="w-48 h-40 flex items-center justify-center border-dashed border-2 rounded-md cursor-pointer">
                                    {/* {logoPreview ? ( */}

                                    <div className="text-center">
                                        <span className="text-gray-500">Upload Image</span>
                                        <p className="text-xs text-gray-400">5MB image note</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/png"
                                        // onChange={handleLogoChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <div className="flex flex-col">
                                               <label className="w-48 h-40 flex items-center justify-center border-dashed border-2 rounded-md cursor-pointer">
                                    {/* {logoPreview ? ( */}

                                    <div className="text-center">
                                        <span className="text-gray-500">Upload Image</span>
                                        <p className="text-xs text-gray-400">5MB image note</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/png"
                                        // onChange={handleLogoChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex gap-4 justify-end">
                    <button className="w-28 h-8 bg-green-500 text-white font-semibold rounded">UPDATE</button>
                    <button className="w-28 h-8 bg-red-500 text-white font-semibold rounded">RETURN</button>
                    <button className="w-28 h-8 bg-blue-500 text-white font-semibold rounded">NEXT</button>
                </div>
            </div>
        </div>
    );
};

export default UploadDocumentVerify;
