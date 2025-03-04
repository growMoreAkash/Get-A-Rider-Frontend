import React from 'react';

const SubmissionVerify = () => {
    return (
        <div className="flex flex-col gap-4 text-[#2E3F6E]">
            <div>
                <div className="text-2xl font-bold ">
                    <p>LIVE Verification Issues</p>
                </div>
                <div className="flex gap-2 items-center font-semibold mt-2">
                    <input type="checkbox" className="form-checkbox h-6 w-6" />
                    <p>Live verification is tampered</p>
                </div>
                <div className="flex gap-8 items-center font-semibold mt-2 ">
                   <textarea placeholder='please describe the issue' className='w-[80%] px-4 pt-2'/>
                    <button className='bg-[#2E3F6E] px-4 py-2 rounded text-white'>SEND COMPLAIN</button>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <div className="text-xl font-bold ">
                    <p>Final Submission</p>
                </div>
                <div className="flex gap-2 items-center font-semibold mt-2">
                    <input type="checkbox" className="form-checkbox h-6 w-6" />
                    <p>Verification percentage is 97% or above .</p>
                </div>
                <div className="flex gap-2 items-center font-semibold">
                    <input type="checkbox" className="form-checkbox h-6 w-6" />
                    <p>Live verification is done with absolute accuracy & honesty .</p>
                </div>
                <div className="flex gap-2 items-center font-semibold">
                    <input type="checkbox" className="form-checkbox h-6 w-6" />
                    <p>All the documents are checked thoroughly during verification . </p>
                </div>
                <div className="flex gap-2 items-center font-semibold">
                    <input type="checkbox" className="form-checkbox h-6 w-6" />
                    <p>The driver is ready to onboard .</p>
                </div>
            </div>

            <div className="mt-8 flex gap-4 justify-end">
                <button className="w-44 h-8 bg-green-600 text-white font-semibold rounded ">VERIFICATION PASS</button>
                <button className="w-44 h-8 bg-red-600 text-white font-semibold rounded ">VERIFICATION FAIL</button>
            </div>
        </div>
    );
};

export default SubmissionVerify;
