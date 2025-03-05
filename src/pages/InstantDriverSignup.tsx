import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '../components/Icon/IconX';
import axios from 'axios';
import { host } from '../secret';
import Swal from 'sweetalert2';
import { useDriver } from '../context/DriverContext';
import ReusableUserDriverList from '../components/ReusableUserDriverList';
import TypeBrandCategoryList from '../components/TypeBrandCategoryList';
import ReusableOtpPopup from '../components/Popup/ReusableOtpPopup';
import UserDriverLogin from '../components/ReusableUserDriverForm/UserDriverLogin';
import Cookies from 'js-cookie';

const InstantDriverSignup = () => {
    const host = "https://api.getarider.in/api"
    const [showOtpPopup, setShowOtpPopup] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const { driverId, setDriverId, getAllDrivers, drivers } = useDriver();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isOtpVerified, setIsOtpVerified] = useState(false);

    const [isPhoneVerified, setIsPhoneVerified] = useState(false); // Track phone verification status

    const handleVerifyNumber = async () => {
        const fullPhoneNumber = '+91' + phoneNumber;
        if (!phoneNumber) {
            Swal.fire('Error', 'Number missing', 'error');
            return;
        }

        const driver = drivers.find((driver: any) => driver.phone === fullPhoneNumber);

        //////.log(driver, 'driver ka test');

        if (driver) {
            // If phone is found and phoneVerified is true, skip OTP verification and proceed to password setup
            if (driver.phoneVerified) {
                setDriverId(driver.id); // Set driver ID for the signup
                setIsPhoneVerified(true); // Mark phone as verified
                setIsOtpVerified(true);
                Swal.fire('Success', 'Phone number is verified, please set a password.', 'success');
                return;
            } else {
                // If phone is found but phoneVerified is false, proceed with OTP verification
                try {
                    var token = Cookies.get("token");

                    await axios.post(`${host}/signupDriver`, { phone: fullPhoneNumber }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                    });
                    setShowOtpPopup(true);
                } catch (error) {
                    //.error('Error sending OTP:', error);
                    Swal.fire('Error', 'Error sending OTP:', 'error');
                }
            }
        } else {
            try {
                var token = Cookies.get("token");
                await axios.post(`${host}/signupDriver`, { phone: fullPhoneNumber }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                setShowOtpPopup(true);
            } catch (error) {
                //.error('Error sending OTP:', error);
                setShowOtpPopup(true);
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
            const response = await axios.post(`${host}/verifyOtpDriver`, {
                phone: '+91' + phoneNumber,
                otp: otp,
            }, {
                headers: {
                    'Content-Type': 'application/json',

                    'Authorization': `Bearer ${Cookies.get("token")}`
                },
            });
            setDriverId(response?.data?.driverId);
            Swal.fire('Success', 'OTP Verified Successfully', 'success');
            getAllDrivers();
            setShowOtpPopup(false);
            setIsOtpVerified(true);
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
            const response = await axios.post(`${host}/addPasswordDriver`, {
                password: password,
                phone: '+91' + phoneNumber,
                driverId: driverId,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get("token")}`
                },
            });
            Swal.fire('Success', 'Password set successfully', 'success');
            getAllDrivers();
        } catch (error) {
            //.error('Error setting password:', error);
            Swal.fire('Error', 'Failed to set password. Please try again.', 'error');
        }
    };

    // now i will write the code for reusable card component --------------------(TypeBrandComponentList)

    const driverColumns = [
        { header: 'Index', key: 'index' },
        { header: 'Date', key: 'date' },
        { header: 'Time', key: 'time' },
        { header: 'Phone', key: 'phone' },
        { header: 'Registration Number', key: 'registrationNumber' },
    ];

    const onRefresh = () => {
        getAllDrivers();
    };

    const onViewLog = () => { };

    const onTrashed = () => { };

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

            <div className="mt-6">
                <TypeBrandCategoryList columns={driverColumns} actions={null} data={drivers} onRefresh={onRefresh} onViewLog={onViewLog} onTrashed={onTrashed} />
            </div>
        </div>
    );
};

export default InstantDriverSignup;
