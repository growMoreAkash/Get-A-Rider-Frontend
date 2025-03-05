import React from 'react';

const CommunicationDetailsVerify = () => {
    return (
        <div>
            <div>
                <div className="bg-[#2E3F6E] w-40 h-9 text-center text-white p-2 rounded-md mb-4">MANUAL ONLY</div>
                <div className="text-md mt-2 font-bold text-[#2E3F6E] ">DETAILS TO BE VERIFIED</div>
                {/* dynamic content starts here */}
                <div className="flex flex-col w-full">
                    <div className="flex gap-8 mt-5 w-full">
                        <div className="w-full">
                            <label htmlFor="" className="text-md font-semibold">
                                Building Name / Number
                            </label>
                            <input type="text" id="" className="form-input w-full" placeholder="Enter the building name / number" />
                        </div>

                        <div className="w-[30%]">
                            <label htmlFor="" className="text-md font-semibold">
                                Verification Action
                            </label>
                            <div className="flex gap-4">
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
                    </div>

                    <div className="flex gap-8 mt-5 w-full">
                        <div className="w-full">
                            <label htmlFor="" className="text-md font-semibold">
                                Landmark
                            </label>
                            <textarea id="" className="form-input w-full" placeholder="Enter the landmark" />
                        </div>

                        <div className="w-[30%]">
                            <label htmlFor="" className="text-md font-semibold">
                                Verification Action
                            </label>
                            <div className="flex gap-4">
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
                    </div>

                    <div className="flex gap-8 mt-5 w-full">
                        <div className="w-full">
                            <label htmlFor="" className="text-md font-semibold">
                                Street Address
                            </label>
                            <textarea id="" className="form-input w-full" placeholder="Enter the street address" />
                        </div>

                        <div className="w-[30%]">
                            <label htmlFor="" className="text-md font-semibold">
                                Verification Action
                            </label>
                            <div className="flex gap-4">
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
                    </div>

                    <div className="flex flex-col gap-4 mt-5 w-full ">
                        <div className="w-full">
                            <label htmlFor="" className="text-md font-semibold">
                                Address proof
                            </label>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <div className="flex flex-col">
                                <label className="w-48 h-48 flex items-center justify-center border-dashed border-2 rounded-md cursor-pointer">
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
                                <div className="text-center">AP-1</div>
                            </div>
                            <div className="flex flex-col">
                                <label className="w-48 h-48 flex items-center justify-center border-dashed border-2 rounded-md cursor-pointer">
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
                                <div className="text-center">AP-2</div>
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
        </div>
    );
};

export default CommunicationDetailsVerify;
