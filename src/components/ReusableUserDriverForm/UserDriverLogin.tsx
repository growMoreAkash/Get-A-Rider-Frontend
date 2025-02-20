import React from 'react';
import ReusableOtpPopup from '../Popup/ReusableOtpPopup'; // Import your reusable OTP popup

const UserDriverLogin = ({ title, fields, onSubmit, buttonText, isSubmitDisabled, extraActions = [], showOtpPopup, onCloseOtpPopup, otp, setOtp, handleOtpSubmit, isOtpVerified }: any) => {
    return (
        <div className="w-full flex justify-center">
            <div className="panel w-full sm:w-[50%]">
                {title && <h2 className="text-center text-3xl p-5 text-teal-500 font-bold">{title}</h2>}
                <form className="space-y-5" onSubmit={onSubmit}>
                    {fields.map((field: any) => (
                        <div key={field.id}>
                            <label htmlFor={field.id} className="text-sm font-medium">
                                {field.label}
                            </label>
                            <input id={field.id} type={field.type} placeholder={field.placeholder} className="form-input w-full" value={field.value} onChange={field.onChange} />
                            {field.extraAction && (
                                <p className="text-teal-500 pt-2 font-bold cursor-pointer text-md" onClick={field.extraAction.onClick}>
                                    {field.extraAction.text}
                                </p>
                            )}
                        </div>
                    ))}

                    {extraActions.map((action: any, index: any) => (
                        <p key={index} className="text-teal-500 pt-2 font-bold cursor-pointer text-md" onClick={action.onClick}>
                            {action.text}
                        </p>
                    ))}

                    <button
                        type="submit"
                        className={
                            isOtpVerified
                                ? `bg-teal-500 px-4 py-2 rounded-md text-white font-bold !mt-6 w-full sm:w-auto cursor-pointer`
                                : ` bg-teal-200 px-4 py-2 rounded-md text-white font-bold !mt-6 w-full sm:w-auto`
                        }
                        disabled={!isOtpVerified}
                    >
                        {buttonText || 'Submit'}
                    </button>
                </form>

                {/* Reusable OTP Popup */}
                <ReusableOtpPopup isOpen={showOtpPopup} onClose={onCloseOtpPopup} otp={otp} setOtp={setOtp} onSubmit={handleOtpSubmit} />
            </div>
        </div>
    );
};

export default UserDriverLogin;
