import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '../components/Icon/IconX';
import axios from 'axios';
import { host } from '../secret';
import { useAuth } from '../context/UserContext';
import Swal from 'sweetalert2';
import ReusableUserDriverList from '../components/ReusableUserDriverList';
import TypeBrandCategoryList from '../components/TypeBrandCategoryList';
import ReusableOtpPopup from '../components/Popup/ReusableOtpPopup';
import TypeReusableForm from '../components/TypeReusableForm';
import UserDriverLogin from '../components/ReusableUserDriverForm/UserDriverLogin';

interface User {
    id: string;
    username: string;
    phone: string;
    phoneVerified: boolean;
    registrationNumber: string;
}

const InstantSignup = () => {
    const host = "http://localhost:8000/api"
    const [showOtpPopup, setShowOtpPopup] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const { setUserId, userId, getAllUsers, users } = useAuth();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [isPhoneVerified, setIsPhoneVerified] = useState(false); // Track phone verification status

    // const apiUrl = import.meta.env.VITE_API_URL;

    const handleVerifyNumber = async () => {
        const fullPhoneNumber = '+91' + phoneNumber;
        if (!phoneNumber) {
            Swal.fire('Error', 'Number missing', 'error');
            return;
        }

        // Check if phone exists in the Users list
        const user = users.find((user: User) => user.phone === fullPhoneNumber);
        if (user) {
            // If phone is found and phoneVerified is true, skip OTP verification and proceed to password setup
            if (user.phoneVerified) {
                setUserId(user.id); // Set user ID for the signup
                setIsPhoneVerified(true); // Mark phone as verified
                setIsOtpVerified(true);
                Swal.fire('Success', 'Phone number is verified, please set a password.', 'success');
                return;
            } else {
                // If phone is found but phoneVerified is false, proceed with OTP verification
                try {
                    await axios.post(`${host}/signup`, { phone: fullPhoneNumber });
                    setShowOtpPopup(true);
                } catch (error) {
                    //.error('Error sending OTP:', error);
                    Swal.fire('Error', 'Failed to send otp', 'error');
                }
            }
        } else {
            // If phone number is not found, proceed with normal OTP verification flow
            try {
                await axios.post(`${host}/signup`, { phone: fullPhoneNumber });
                setShowOtpPopup(true);
            } catch (error) {
                //.error('Error sending OTP:', error);
                Swal.fire('Error', 'Failed to send otp', 'error');
            }
        }
    };

    const handleOtpSubmit = async () => {
        if (!otp) {
            alert('Please enter the OTP.');
            return;
        }

        try {
            const response = await axios.post(`${host}/verifyOtp`, {
                phone: '+91' + phoneNumber,
                otp: otp,
            });
            setUserId(response?.data?.userId);
            Swal.fire('Success', 'OTP Verified Successfully', 'success');
            getAllUsers();
            setShowOtpPopup(false);
            setIsOtpVerified(true); // Mark OTP as verified
            setOtp('');
        } catch (error) {
            setOtp('');
            //.error('Error verifying OTP:', error);
            Swal.fire('Error', 'Failed to verify OTP', 'error');
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password || !confirmPassword) {
            alert('Please fill in both password fields.');
            return;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }
        try {
            const response = await axios.post(`${host}/addPassword`, {
                password: password,
                phone: '+91' + phoneNumber,
                userId: userId,
            });
            getAllUsers();
            Swal.fire('Success', 'Password set successfully', 'success');
        } catch (error) {
            //.error('Error setting password:', error);
            Swal.fire('Error', 'Failed to set password. Please try again.', 'error');
        }
    };

    // now i will write the code for reusable card component --------------------(TypeBrandComponentList)
    const userActions = [
        { icon: 'bi-pencil-fill', title: 'Edit', onClick: (row: any) => alert(`Edit ${row.name}`), className: 'text-teal-400' },
        { icon: 'bi-trash-fill', title: 'Delete', onClick: (row: any) => alert(`Delete ${row.name}`), className: 'text-red-400' },
    ];

    const userColumns = [
        { header: 'Id', key: '_id' },
        { header: 'Username', key: 'username' },
        { header: 'Phone', key: 'phone' },
        { header: 'Registration Number', key: 'registrationNumber' },
    ];

    const onRefresh = () => {
        getAllUsers();
    };

    const onViewLog = () => { };

    const onTrashed = () => { };

    // now i have writen the code for reusable card component --------------------(TypeBrandComponentList) (above)

    return (
        <div className="flex justify-center flex-col">
            <UserDriverLogin
                title="Sign Up"
                fields={[
                    {
                        id: 'phone',
                        label: 'Phone Number',
                        type: 'text',
                        placeholder: 'Enter your phone number',
                        value: phoneNumber,
                        onChange: (e: any) => setPhoneNumber(e.target?.value),
                        extraAction: {
                            text: 'Verify Number',
                            onClick: handleVerifyNumber,
                        },
                    },
                    {
                        id: 'password',
                        label: 'Password',
                        type: 'password',
                        placeholder: 'Enter your password',
                        value: password,
                        onChange: (e: any) => setPassword(e.target.value),
                    },
                    {
                        id: 'confirmPassword',
                        label: 'Confirm Password',
                        type: 'password',
                        placeholder: 'Confirm your password',
                        value: confirmPassword,
                        onChange: (e: any) => setConfirmPassword(e.target.value),
                    },
                ]}
                onSubmit={handlePasswordSubmit}
                buttonText="Set Password"
                isSubmitDisabled={!isOtpVerified}
                showOtpPopup={showOtpPopup}
                onCloseOtpPopup={() => setShowOtpPopup(false)}
                otp={otp}
                setOtp={setOtp}
                handleOtpSubmit={handleOtpSubmit}
                isOtpVerified={isOtpVerified}
            />

            {/* <ReusableOtpPopup isOpen={showOtpPopup} onClose={() => setShowOtpPopup(false)} otp={otp} setOtp={setOtp} onSubmit={handleOtpSubmit} /> */}

            <div className="mt-8">
                <TypeBrandCategoryList columns={userColumns} actions={userActions} data={users} onRefresh={onRefresh} onViewLog={onViewLog} onTrashed={onTrashed} />
            </div>
        </div>
    );
};

export default InstantSignup;
