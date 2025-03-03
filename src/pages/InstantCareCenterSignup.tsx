import { useState, Fragment } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import TypeBrandCategoryList from '../components/TypeBrandCategoryList';
import UserDriverLogin from '../components/ReusableUserDriverForm/UserDriverLogin';
import Cookies from 'js-cookie';

type CareCenter = {
    _id: string;
    phone: string;
    phoneVerified: boolean;
};

const InstantCareCenterSignup = () => {
    const host = 'http://localhost:8000/api';
    const [showOtpPopup, setShowOtpPopup] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [careCenterId, setCareCenterId] = useState('');
    const [careCenters, setCareCenters] = useState<CareCenter[]>([]);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isOtpVerified, setIsOtpVerified] = useState(false);

    const [isPhoneVerified, setIsPhoneVerified] = useState(false); // Track phone verification status

    var token = Cookies.get('token');

    const getAllCareCenters = async () => {
        try {
            const response = await axios.post(`${host}/getAllCareCenter`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCareCenters(response?.data?.entity);
        } catch (error) {
            //.error('Error fetching careCenters:', error);
            Swal.fire('Error', 'Failed to fetch careCenters', 'error');
        }
    };

    const handleVerifyNumber = async () => {
        const fullPhoneNumber = '+91' + phoneNumber;
        if (!phoneNumber) {
            Swal.fire('Error', 'Number missing', 'error');
            return;
        }

        const careCenter = careCenters.find((careCenter: any) => careCenter.phone === fullPhoneNumber);

        //////.log(careCenter, 'careCenter ka test');

        if (careCenter) {
            // If phone is found and phoneVerified is true, skip OTP verification and proceed to password setup
            if (careCenter.phoneVerified) {
                setCareCenterId(careCenter._id); // Set careCenter ID for the signup
                setIsPhoneVerified(true); // Mark phone as verified
                setIsOtpVerified(true);
                Swal.fire('Success', 'Phone number is verified, please set a password.', 'success');
                return;
            } else {
                // If phone is found but phoneVerified is false, proceed with OTP verification
                try {
                    await axios.post(`${host}/signupCareCenter`, { phone: fullPhoneNumber }, { headers: { Authorization: `Bearer ${token}` } });
                    setShowOtpPopup(true);
                } catch (error) {
                    //.error('Error sending OTP:', error);
                    Swal.fire('Error', 'Error sending OTP:', 'error');
                }
            }
        } else {
            try {
                await axios.post(`${host}/signupCareCenter`, { phone: fullPhoneNumber }, { headers: { Authorization: `Bearer ${token}` } });
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
            const response = await axios.post(`${host}/verifyOtpCareCenter`, {
                phone: '+91' + phoneNumber,
                otp: otp,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCareCenterId(response?.data?.CareCenterId);
            Swal.fire('Success', 'OTP Verified Successfully', 'success');
            getAllCareCenters();
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
            const response = await axios.post(`${host}/addPasswordCareCenter`, {
                password: password,
                phone: '+91' + phoneNumber,
                entityId: careCenterId,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            Swal.fire('Success', 'Password set successfully', 'success');
            getAllCareCenters();
        } catch (error) {
            //.error('Error setting password:', error);
            Swal.fire('Error', 'Failed to set password. Please try again.', 'error');
        }
    };

    // now i will write the code for reusable card component --------------------(TypeBrandComponentList)

    const careCenterColumns = [
        { header: 'Index', key: 'index' },
        { header: 'Date', key: 'date' },
        { header: 'Time', key: 'time' },
        { header: 'Phone', key: 'phone' },
        { header: 'Registration Number', key: 'registrationNumber' },
    ];

    const onRefresh = () => {
        getAllCareCenters();
    };

    const onViewLog = () => {};

    const onTrashed = () => {};

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
                <TypeBrandCategoryList columns={careCenterColumns} actions={null} data={careCenters} onRefresh={onRefresh} onViewLog={onViewLog} onTrashed={onTrashed} />
            </div>
        </div>
    );
};

export default InstantCareCenterSignup;
