import { useState, Fragment } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import TypeBrandCategoryList from '../components/TypeBrandCategoryList';
import UserDriverLogin from '../components/ReusableUserDriverForm/UserDriverLogin';
import Cookies from 'js-cookie';

type Partner = {
    _id: string;
    phone: string;
    phoneVerified: boolean;
};

const InstantPartnerSignup = () => {
    const host = 'https://api.getarider.in/api';
    const [showOtpPopup, setShowOtpPopup] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [partnerId, setPartnerId] = useState('');
    const [partners, setPartners] = useState<Partner[]>([]);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isOtpVerified, setIsOtpVerified] = useState(false);

    const [isPhoneVerified, setIsPhoneVerified] = useState(false); // Track phone verification status

    var token = Cookies.get('token');

    const getAllPartners = async () => {
        try {
            const response = await axios.post(`${host}/getAllPartner`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPartners(response?.data?.entity);
        } catch (error) {
            //.error('Error fetching partners:', error);
            Swal.fire('Error', 'Failed to fetch partners', 'error');
        }
    };

    const handleVerifyNumber = async () => {
        const fullPhoneNumber = '+91' + phoneNumber;
        if (!phoneNumber) {
            Swal.fire('Error', 'Number missing', 'error');
            return;
        }

        const partner = partners.find((partner: any) => partner.phone === fullPhoneNumber);

        //////.log(partner, 'partner ka test');

        if (partner) {
            // If phone is found and phoneVerified is true, skip OTP verification and proceed to password setup
            if (partner.phoneVerified) {
                setPartnerId(partner._id); // Set partner ID for the signup
                setIsPhoneVerified(true); // Mark phone as verified
                setIsOtpVerified(true);
                Swal.fire('Success', 'Phone number is verified, please set a password.', 'success');
                return;
            } else {
                // If phone is found but phoneVerified is false, proceed with OTP verification
                try {
                    await axios.post(`${host}/signupPartner`, { phone: fullPhoneNumber }, {
                        headers: {
                            Authorization: `Bearer ${token}`,
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
                await axios.post(`${host}/signupPartner`, { phone: fullPhoneNumber }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
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
            const response = await axios.post(`${host}/verifyOtpPartner`, {
                phone: '+91' + phoneNumber,
                otp: otp,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPartnerId(response?.data?.PartnerId);
            Swal.fire('Success', 'OTP Verified Successfully', 'success');
            getAllPartners();
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
            const response = await axios.post(`${host}/addPasswordPartner`, {
                password: password,
                phone: '+91' + phoneNumber,
                entityId: partnerId,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            Swal.fire('Success', 'Password set successfully', 'success');
            getAllPartners();
        } catch (error) {
            //.error('Error setting password:', error);
            Swal.fire('Error', 'Failed to set password. Please try again.', 'error');
        }
    };

    // now i will write the code for reusable card component --------------------(TypeBrandComponentList)

    const partnerColumns = [
        { header: 'Index', key: 'index' },
        { header: 'Date', key: 'date' },
        { header: 'Time', key: 'time' },
        { header: 'Phone', key: 'phone' },
        { header: 'Registration Number', key: 'registrationNumber' },
    ];

    const onRefresh = () => {
        getAllPartners();
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
                <TypeBrandCategoryList columns={partnerColumns} actions={null} data={partners} onRefresh={onRefresh} onViewLog={onViewLog} onTrashed={onTrashed} />
            </div>
        </div>
    );
};

export default InstantPartnerSignup;
