import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '../../store';
import { useState, useEffect } from 'react';
import IconCaretsDown from '../Icon/IconCaretsDown';
import IconCaretDown from '../Icon/IconCaretDown';
import Cookies from 'js-cookie';
import axios from 'axios';
import { set } from 'react-hook-form';
import { routes as allRoutes } from '../../router/routes';

type User = {
    _id: string | null;
    phone: string;
};

const Sidebar = () => {
    const host = 'https://api.getarider.in/api';
    const dashHost = '/apple/hjo/login';
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const [subMenu, setSubMenu] = useState<string>('');
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const location = useLocation();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [user, setUser] = useState<User>({ _id: null, phone: '' });
    const [type, setType] = useState('');
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState<Array<string>>([]);
    const [apis, setApis] = useState<Array<string>>([]);
    const [routes, setRoutes] = useState<Array<string>>([]);

    const getUser = async () => {
        var id = Cookies.get('id');
        var token = Cookies.get('token');
        var type = Cookies.get('type');
        setLoading(true);
        setRoles([]);
        setType('');
        try {
            var response = await axios.post(
                `${host}/get${type}/${id}`,
                {
                    apiUrl: `/get${type}/:id`,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.statusText === 'OK') {
                setUser(response.data);
                setType(type ?? '');
                var rls = response.data.roleId;
                if (rls === undefined) setRoles([]);
                else setRoles(rls);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => (oldValue === value ? '' : value));
    };

    const toggleSubMenu = (value: string) => {
        setSubMenu((oldValue) => (oldValue === value ? '' : value));
    };

    const getRole = async (id: string) => {
        var response;
        try {
            response = await axios.post(
                `${host}/getRole/`,
                {
                    roleId: id,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('token')}`,
                    },
                }
            );
            return response.data.role;
        } catch (error) {
            console.log(error);
        }
    };

    const getApi = async () => {
        setApis([]);
        for (let i = 0; i < roles.length; i++) {
            var role = await getRole(roles[i]);
            for (let j = 0; j < role.assignFunction.length; j++) {
                for (let k = 0; k < role.assignFunction[j].apis.length; k++) setApis((oldArray) => [...oldArray, role.assignFunction[j].apis[k]]);
            }
        }
    };

    useEffect(() => {
        getUser();
        const selector = document.querySelector(`.sidebar ul a[href="${window.location.pathname}"]`);
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);

    useEffect(() => {
        setRoutes([]);
        var arr = [];
        for (let i = 0; i < allRoutes.length; i++) {
            if (type === 'Admin' || (allRoutes[i].apis.every((v) => apis.includes(v)) && apis.length)) {
                arr.push(allRoutes[i].path);
            }
            setRoutes(arr);
        }
    }, [type, apis]);

    useEffect(() => {
        getApi();
    }, [roles]);

    useEffect(() => {
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
    }, [location]);

    useEffect(() => {
        console.log(roles);
        console.log(routes);
        console.log(apis);
    }, [routes, apis, roles]);

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="bg-white dark:bg-black h-full">
                    <div className="flex justify-between items-center px-4 py-3">
                        <NavLink to="/apple/hjo/login" className="main-logo flex items-center shrink-0">
                            <img className="w-[200px] ml-[5px] flex-none" src="/assets/images/logo.png" alt="logo" />
                            {/* <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle lg:inline dark:text-white-light">{t('GET-A-RIDE')}</span> */}
                        </NavLink>

                        <button
                            type="button"
                            className="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 rtl:rotate-180"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90" />
                        </button>
                    </div>
                    <PerfectScrollbar className="h-[calc(100vh-80px)] relative">
                        <ul className="relative font-semibold space-y-0.5 p-4 py-0">
                            {/* Vehicle Section */}
                            {(routes.some((v) => v.includes('/vehicleAttributes')) ||
                                routes.some((v) => v.includes('/vehicleFeatures')) ||
                                routes.some((v) => v.includes('/vehicleFeaturesDelete')) ||
                                routes.some((v) => v.includes('/vehicleAttributesDelete'))) && (
                                <li className="menu nav-item">
                                    <button
                                        type="button"
                                        className={`${currentMenu === 'vehicle' ? 'active' : ''} nav-link group w-full text-black dark:text-[#506690]`}
                                        onClick={() => toggleMenu('vehicle')}
                                    >
                                        <div className="flex items-center">
                                            <span className="ltr:pl-3 rtl:pr-3">{t('Vehicle')}</span>
                                        </div>
                                        <div className={currentMenu !== 'vehicle' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                            <IconCaretDown />
                                        </div>
                                    </button>
                                    <AnimateHeight duration={300} height={currentMenu === 'vehicle' ? 'auto' : 0}>
                                        <ul className="sub-menu text-gray-500">
                                            {routes.some((v) => v.includes('/vehicleAttributes')) && (
                                                <li>
                                                    <NavLink to="/apple/hjo/login/vehicleAttributes">{t('Vehicle Attributes')}</NavLink>
                                                </li>
                                            )}
                                            {routes.some((v) => v.includes('/vehicleAttributesDelete')) && (
                                                <li>
                                                    <NavLink to="/apple/hjo/login/vehicleAttributesDelete">{t('Delete Vehicle Attributes')}</NavLink>
                                                </li>
                                            )}
                                            {routes.some((v) => v.includes('/features')) && (
                                                <li>
                                                    <NavLink to="/apple/hjo/login/features">{t('Vehicle features')}</NavLink>
                                                </li>
                                            )}
                                            {routes.some((v) => v.includes('/featuresDelete')) && (
                                                <li>
                                                    <NavLink to="/apple/hjo/login/featuresDelete">{t('Delete Vehicle features')}</NavLink>
                                                </li>
                                            )}
                                        </ul>
                                    </AnimateHeight>
                                </li>
                            )}

                            {/* Master Section */}
                            {(routes.some((v) => v.includes('/driverAttributes')) ||
                                routes.some((v) => v.includes('/driverAttributesDelete')) ||
                                routes.some((v) => v.includes('/idAttributes')) ||
                                routes.some((v) => v.includes('/idAttributesDelete'))) && (
                                <li className="menu nav-item">
                                    <button
                                        type="button"
                                        className={`${currentMenu === 'master' ? 'active' : ''} nav-link group w-full text-black dark:text-[#506690]`}
                                        onClick={() => toggleMenu('master')}
                                    >
                                        <div className="flex items-center">
                                            <span className="ltr:pl-3 rtl:pr-3">{t('Master')}</span>
                                        </div>
                                        <div className={currentMenu !== 'master' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                            <IconCaretDown />
                                        </div>
                                    </button>
                                    <AnimateHeight duration={300} height={currentMenu === 'master' ? 'auto' : 0}>
                                        <ul className="sub-menu text-gray-500">
                                            {(routes.some((v) => v.includes('/driverAttributes')) || routes.some((v) => v.includes('/driverAttributesDelete'))) && (
                                                <li>
                                                    <button
                                                        type="button"
                                                        className={`${subMenu === 'masterDriver' ? 'active' : ''} nav-link group w-full text-gray-700`}
                                                        onClick={() => toggleSubMenu('masterDriver')}
                                                    >
                                                        {t('Driver')}
                                                        <div className={subMenu !== 'masterDriver' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                                            <IconCaretDown />
                                                        </div>
                                                    </button>
                                                    <AnimateHeight duration={300} height={subMenu === 'masterDriver' ? 'auto' : 0}>
                                                        <ul className="sub-menu text-gray-500 pl-4">
                                                            {routes.some((v) => v.includes('/driverAttributes')) && (
                                                                <li>
                                                                    <NavLink to="/apple/hjo/login/driverAttributes">{t('Driver Attributes')}</NavLink>
                                                                </li>
                                                            )}
                                                            {routes.some((v) => v.includes('/driverAttributesDelete')) && (
                                                                <li>
                                                                    <NavLink to="/apple/hjo/login/driverAttributesDelete">{t('Delete Driver Attributes')}</NavLink>
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </AnimateHeight>
                                                </li>
                                            )}
                                            {(routes.some((v) => v.includes('/idAttributes')) || routes.some((v) => v.includes('/idAttributesDelete'))) && (
                                                <li>
                                                    <button
                                                        type="button"
                                                        className={`${subMenu === 'masterId' ? 'active' : ''} nav-link group w-full text-gray-700`}
                                                        onClick={() => toggleSubMenu('masterId')}
                                                    >
                                                        {t('ID Creation')}
                                                        <div className={subMenu !== 'masterId' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                                            <IconCaretDown />
                                                        </div>
                                                    </button>
                                                    <AnimateHeight duration={300} height={subMenu === 'masterId' ? 'auto' : 0}>
                                                        <ul className="sub-menu text-gray-500 pl-4">
                                                            {routes.some((v) => v.includes('/idAttributes')) && (
                                                                <li>
                                                                    <NavLink to="/apple/hjo/login/idAttributes">{t('ID Attributes')}</NavLink>
                                                                </li>
                                                            )}
                                                            {routes.some((v) => v.includes('/idAttributesDelete')) && (
                                                                <li>
                                                                    <NavLink to="/apple/hjo/login/idAttributesDelete">{t('Delete ID Attributes')}</NavLink>
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </AnimateHeight>
                                                </li>
                                            )}
                                        </ul>
                                    </AnimateHeight>
                                </li>
                            )}

                            {/* Registration Section */}
                            {(routes.some((v) => v.includes('/instantSignup')) ||
                                routes.some((v) => v.includes('/profileUpdate')) ||
                                routes.some((v) => v.includes('/instantDriverSignup')) ||
                                routes.some((v) => v.includes('/driverUpdate')) ||
                                routes.some((v) => v.includes('/transferVerification')) ||
                                routes.some((v) => v.includes('/returnSection')) ||
                                routes.some((v) => v.includes('/vehicleSignup')) ||
                                routes.some((v) => v.includes('/vehicleUpdate')) ||
                                routes.some((v) => v.includes('/vehicleTransferVerification')) ||
                                routes.some((v) => v.includes('/returnSection')) ||
                                routes.some((v) => v.includes('/partnerSignup')) ||
                                routes.some((v) => v.includes('/partnerUpdate'))) && (
                                <li className="menu nav-item">
                                    <button
                                        type="button"
                                        className={`${currentMenu === 'registration' ? 'active' : ''} nav-link group w-full text-black dark:text-[#506690]`}
                                        onClick={() => toggleMenu('registration')}
                                    >
                                        <div className="flex items-center">
                                            <span className="ltr:pl-3 rtl:pr-3">{t('Registration')}</span>
                                        </div>
                                        <div className={currentMenu !== 'registration' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                            <IconCaretDown />
                                        </div>
                                    </button>

                                    <AnimateHeight duration={300} height={currentMenu === 'registration' ? 'auto' : 0}>
                                        <ul className="sub-menu text-gray-500">
                                            {/* User Registration */}
                                            {/* {(routes.some((v) => v.includes('/instantSignup')) || routes.some((v) => v.includes('/profileUpdate'))) && (
                                                <li>
                                                    <button
                                                        type="button"
                                                        className={`${subMenu === 'userRegistration' ? 'active' : ''} nav-link group w-full text-gray-700`}
                                                        onClick={() => toggleSubMenu('userRegistration')}
                                                    >
                                                        {t('User Registration')}
                                                        <div className={subMenu !== 'userRegistration' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                                            <IconCaretDown />
                                                        </div>
                                                    </button>
                                                    <AnimateHeight duration={300} height={subMenu === 'userRegistration' ? 'auto' : 0}>
                                                        <ul className="sub-menu text-gray-500 pl-4">
                                                            {routes.some((v) => v.includes('/instantSignup')) && (
                                                                <li>
                                                                    <NavLink to="/apple/hjo/login/instantSignup">{t('Instant Signup')}</NavLink>
                                                                </li>
                                                            )}
                                                            {routes.some((v) => v.includes('/profileUpdate')) && (
                                                                <li>
                                                                    <NavLink to="/apple/hjo/login/profileUpdate">{t('Profile Update')}</NavLink>
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </AnimateHeight>
                                                </li>
                                            )}*/}

                                            {/* Driver Registration */}
                                            {(routes.some((v) => v.includes('/instantDriverSignup')) ||
                                                routes.some((v) => v.includes('/driverUpdate')) ||
                                                routes.some((v) => v.includes('/transferVerification')) ||
                                                routes.some((v) => v.includes('/returnSection'))) && (
                                                <li>
                                                    <button
                                                        type="button"
                                                        className={`${subMenu === 'driverRegistration' ? 'active' : ''} nav-link group w-full text-gray-700`}
                                                        onClick={() => toggleSubMenu('driverRegistration')}
                                                    >
                                                        {t('Driver Registration')}
                                                        <div className={subMenu !== 'driverRegistration' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                                            <IconCaretDown />
                                                        </div>
                                                    </button>
                                                    <AnimateHeight duration={300} height={subMenu === 'driverRegistration' ? 'auto' : 0}>
                                                        <ul className="sub-menu text-gray-500 pl-4">
                                                            {routes.some((v) => v.includes('/instantDriverSignup')) && (
                                                                <li>
                                                                    <NavLink to="/apple/hjo/login/instantDriverSignup">{t('Driver Signup')}</NavLink>
                                                                </li>
                                                            )}
                                                            {routes.some((v) => v.includes('/driverUpdate')) && (
                                                                <li>
                                                                    <NavLink to="/apple/hjo/login/driverUpdate">{t('Driver Update')}</NavLink>
                                                                </li>
                                                            )}
                                                            {routes.some((v) => v.includes('/transferVerification')) && (
                                                                <li>
                                                                    <NavLink to="/apple/hjo/login/transferVerification">{t('Transfer Verification')}</NavLink>
                                                                </li>
                                                            )}
                                                            {routes.some((v) => v.includes('/returnSection')) && (
                                                                <li>
                                                                    <NavLink to="/apple/hjo/login/returnSection">{t('Return Section')}</NavLink>
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </AnimateHeight>
                                                </li>
                                            )}

                                            {/* Vehicle Registration */}
                                            {(routes.some((v) => v.includes('/vehicleSignup')) ||
                                                routes.some((v) => v.includes('/vehicleUpdate')) ||
                                                routes.some((v) => v.includes('/vehicleTransferVerification')) ||
                                                routes.some((v) => v.includes('/returnSection'))) && (
                                                <li>
                                                    <button
                                                        type="button"
                                                        className={`${subMenu === 'vehicleRegistration' ? 'active' : ''} nav-link group w-full text-gray-700`}
                                                        onClick={() => toggleSubMenu('vehicleRegistration')}
                                                    >
                                                        {t('Vehicle Registration')}
                                                        <div className={subMenu !== 'vehicleRegistration' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                                            <IconCaretDown />
                                                        </div>
                                                    </button>
                                                    <AnimateHeight duration={300} height={subMenu === 'vehicleRegistration' ? 'auto' : 0}>
                                                        <ul className="sub-menu text-gray-500 pl-4">
                                                            {routes.some((v) => v.includes('/vehicleSignup')) && (
                                                                <li>
                                                                    <NavLink to="/apple/hjo/login/vehicleSignup">{t('Create Vehicle')}</NavLink>
                                                                </li>
                                                            )}
                                                            {routes.some((v) => v.includes('/vehicleUpdate')) && (
                                                                <li>
                                                                    <NavLink to="/apple/hjo/login/vehicleUpdate">{t('Vehicle Update')}</NavLink>
                                                                </li>
                                                            )}
                                                            {routes.some((v) => v.includes('/vehicleTransferVerification')) && (
                                                                <li>
                                                                    <NavLink to="/apple/hjo/login/vehicleTransferVerification">{t('Transfer Verification')}</NavLink>
                                                                </li>
                                                            )}
                                                            {routes.some((v) => v.includes('/returnSection')) && (
                                                                <li>
                                                                    <NavLink to="/vehicleReturnSection">{t('Return Section')}</NavLink>
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </AnimateHeight>
                                                </li>
                                            )}

                                            {/* Partner Registration */}
                                            {(routes.some((v) => v.includes('/partnerSignup')) || routes.some((v) => v.includes('/partnerUpdate'))) && (
                                                <li>
                                                    <button
                                                        type="button"
                                                        className={`${subMenu === 'partnerRegistration' ? 'active' : ''} nav-link group w-full text-gray-700`}
                                                        onClick={() => toggleSubMenu('partnerRegistration')}
                                                    >
                                                        {t('Partner Registration')}
                                                        <div className={subMenu !== 'partnerRegistration' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                                            <IconCaretDown />
                                                        </div>
                                                    </button>
                                                    <AnimateHeight duration={300} height={subMenu === 'partnerRegistration' ? 'auto' : 0}>
                                                        <ul className="sub-menu text-gray-500 pl-4">
                                                            {routes.some((v) => v.includes('/partnerSignup')) && (
                                                                <li>
                                                                    <NavLink to="/apple/hjo/login/instantSignup">{t('Instant Signup')}</NavLink>
                                                                </li>
                                                            )}
                                                            {routes.some((v) => v.includes('/partnerUpdate')) && (
                                                                <li>
                                                                    <NavLink to="/apple/hjo/login/partnerUpdate">{t('Partner Update')}</NavLink>
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </AnimateHeight>
                                                </li>
                                            )}
                                        </ul>
                                    </AnimateHeight>
                                </li>
                            )}

                            {/* Verification Section */}
                            {(routes.some((v) => v.includes('/driverVerification')) ||
                                routes.some((v) => v.includes('/vehicleVerification')) ||
                                routes.some((v) => v.includes('/partnerVerification'))) && (
                                <li className="menu nav-item">
                                    <button
                                        type="button"
                                        className={`${currentMenu === 'verification' ? 'active' : ''} nav-link group w-full text-black dark:text-[#506690]`}
                                        onClick={() => toggleMenu('verification')}
                                    >
                                        <div className="flex items-center">
                                            <span className="ltr:pl-3 rtl:pr-3">{t('Verification')}</span>
                                        </div>
                                        <div className={currentMenu !== 'verification' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                            <IconCaretDown />
                                        </div>
                                    </button>
                                    <AnimateHeight duration={300} height={currentMenu === 'verification' ? 'auto' : 0}>
                                        <ul className="sub-menu text-gray-500">
                                            {routes.some((v) => v.includes('/driverVerification')) && (
                                                <li>
                                                    <NavLink to="/apple/hjo/login/driverVerification">{t('Driver Verification')}</NavLink>
                                                </li>
                                            )}
                                            {routes.some((v) => v.includes('/vehicleVerification')) && (
                                                <li>
                                                    <NavLink to="/apple/hjo/login/vehicleVerification">{t('Vehicle Verification')}</NavLink>
                                                </li>
                                            )}
                                            {routes.some((v) => v.includes('/partnerVerification')) && (
                                                <li>
                                                    <NavLink to="/apple/hjo/login/partnerVerification">{t('Partner Verification')}</NavLink>
                                                </li>
                                            )}
                                        </ul>
                                    </AnimateHeight>
                                </li>
                            )}

                            {/* Fair System Section */}
                            {(routes.some((v) => v.includes('/fairSetup')) || routes.some((v) => v.includes('/zoneSetup'))) && (
                                <li className="menu nav-item">
                                    <button
                                        type="button"
                                        className={`${currentMenu === 'fairSystem' ? 'active' : ''} nav-link group w-full text-black dark:text-[#506690]`}
                                        onClick={() => toggleMenu('fairSystem')}
                                    >
                                        <div className="flex items-center">
                                            <span className="ltr:pl-3 rtl:pr-3">{t('Fair System')}</span>
                                        </div>
                                        <div className={currentMenu !== 'fairSystem' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                            <IconCaretDown />
                                        </div>
                                    </button>
                                    <AnimateHeight duration={300} height={currentMenu === 'fairSystem' ? 'auto' : 0}>
                                        <ul className="sub-menu text-gray-500">
                                            {routes.some((v) => v.includes('/fairSetup')) && (
                                                <li>
                                                    <NavLink to="/apple/hjo/login/fairSetup">{t('Fair Setup')}</NavLink>
                                                </li>
                                            )}
                                            {routes.some((v) => v.includes('/zoneSetup')) && (
                                                <li>
                                                    <button
                                                        type="button"
                                                        className={`${subMenu === 'zoneSetup' ? 'active' : ''} nav-link group w-full text-gray-700`}
                                                        onClick={() => toggleSubMenu('zoneSetup')}
                                                    >
                                                        {t('Zone Setup')}
                                                        <div className={subMenu !== 'zoneSetup' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                                            <IconCaretDown />
                                                        </div>
                                                    </button>
                                                    <AnimateHeight duration={300} height={subMenu === 'zoneSetup' ? 'auto' : 0}>
                                                        <ul className="sub-menu text-gray-500 pl-4">
                                                            {routes.some((v) => v.includes('/zoneSetup')) && (
                                                                <li>
                                                                    <NavLink to="/apple/hjo/login/zoneSetup/createZone">{t('Create Zone')}</NavLink>
                                                                </li>
                                                            )}
                                                            {routes.some((v) => v.includes('/zoneSetup')) && (
                                                                <li>
                                                                    <NavLink to="/apple/hjo/login/zoneSetup/deleteZone">{t('Delete Zone')}</NavLink>
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </AnimateHeight>
                                                </li>
                                            )}

                                            <li>
                                                <button
                                                    type="button"
                                                    className={`${subMenu === 'branchSetup' ? 'active' : ''} nav-link group w-full text-gray-700`}
                                                    onClick={() => toggleSubMenu('branchSetup')}
                                                >
                                                    {t('Branch Setup')}
                                                    <div className={subMenu !== 'branchSetup' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                                        <IconCaretDown />
                                                    </div>
                                                </button>
                                                <AnimateHeight duration={300} height={subMenu === 'branchSetup' ? 'auto' : 0}>
                                                    <ul className="sub-menu text-gray-500 pl-4">
                                                        {routes.some((v) => v.includes('/branchSetup')) && (
                                                            <li>
                                                                <NavLink to="/apple/hjo/login/branchSetup/createBranch">{t('Create Branch')}</NavLink>
                                                            </li>
                                                        )}
                                                        {routes.some((v) => v.includes('/branchSetup')) && (
                                                            <li>
                                                                <NavLink to="/apple/hjo/login/branchSetup/deleteBranch">{t('Delete Branch')}</NavLink>
                                                            </li>
                                                        )}
                                                    </ul>
                                                </AnimateHeight>
                                            </li>
                                        </ul>
                                    </AnimateHeight>
                                </li>
                            )}

                            {/* Client Section */}
                            {routes.some((v) => v.includes('/clientAttributes')) && (
                                <li className="menu nav-item">
                                    <button
                                        type="button"
                                        className={`${currentMenu === 'client' ? 'active' : ''} nav-link group w-full text-black dark:text-[#506690]`}
                                        onClick={() => toggleMenu('client')}
                                    >
                                        <div className="flex items-center">
                                            <span className="ltr:pl-3 rtl:pr-3">{t('Client')}</span>
                                        </div>
                                        <div className={currentMenu !== 'client' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                            <IconCaretDown />
                                        </div>
                                    </button>

                                    <AnimateHeight duration={300} height={currentMenu === 'client' ? 'auto' : 0}>
                                        <ul className="sub-menu text-gray-500">
                                            {routes.some((v) => v.includes('/clientAttributes')) && (
                                                <li>
                                                    <button
                                                        type="button"
                                                        className={`${subMenu === 'clientDriver' ? 'active' : ''} nav-link group w-full text-gray-700`}
                                                        onClick={() => toggleSubMenu('clientDriver')}
                                                    >
                                                        {t('Driver')}
                                                        <div className={subMenu !== 'clientDriver' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                                            <IconCaretDown />
                                                        </div>
                                                    </button>

                                                    <AnimateHeight duration={300} height={subMenu === 'clientDriver' ? 'auto' : 0}>
                                                        <ul className="sub-menu text-gray-500 pl-4">
                                                            {routes.some((v) => v.includes('/driverAttributes')) && (
                                                                <li>
                                                                    <NavLink to="/apple/hjo/login/driverAttributes">{t('Driver Attributes')}</NavLink>
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </AnimateHeight>
                                                </li>
                                            )}
                                        </ul>
                                    </AnimateHeight>
                                </li>
                            )}

                            {/* Roles Section */}
                            {(routes.some((v) => v.includes('/roles')) || routes.some((v) => v.includes('/assignRoles'))) && (
                                <li className="menu nav-item">
                                    <button
                                        type="button"
                                        className={`${currentMenu === 'role' ? 'active' : ''} nav-link group w-full text-black dark:text-[#506690]`}
                                        onClick={() => toggleMenu('role')}
                                    >
                                        <div className="flex items-center">
                                            <span className="ltr:pl-3 rtl:pr-3">{t('Roles')}</span>
                                        </div>
                                        <div className={currentMenu !== 'role' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                            <IconCaretDown />
                                        </div>
                                    </button>
                                    <AnimateHeight duration={300} height={currentMenu === 'role' ? 'auto' : 0}>
                                        <ul className="sub-menu text-gray-500">
                                            {routes.some((v) => v.includes('/roles')) && (
                                                <li>
                                                    <NavLink to="/apple/hjo/login/roles">{t('Add/Update')}</NavLink>
                                                </li>
                                            )}
                                            {routes.some((v) => v.includes('/assignRoles')) && (
                                                <li>
                                                    <NavLink to="/apple/hjo/login/assignRoles">{t('Assign Users')}</NavLink>
                                                </li>
                                            )}
                                        </ul>
                                    </AnimateHeight>
                                </li>
                            )}

                            {/* CustomUser Section */}
                            {(routes.some((v) => v.includes('/addEmployee')) ||
                                routes.some((v) => v.includes('/updateEmployee')) ||
                                routes.some((v) => v.includes('/addPartner')) ||
                                routes.some((v) => v.includes('/updatePartner')) ||
                                routes.some((v) => v.includes('/addCareCenter')) ||
                                routes.some((v) => v.includes('/updateCareCenter'))) && (
                                <li className="menu nav-item">
                                    <button
                                        type="button"
                                        className={`${currentMenu === 'customUser' ? 'active' : ''} nav-link group w-full text-black dark:text-[#506690]`}
                                        onClick={() => toggleMenu('customUser')}
                                    >
                                        <div className="flex items-center">
                                            <span className="ltr:pl-3 rtl:pr-3">{t('CustomUser')}</span>
                                        </div>
                                        <div className={currentMenu !== 'customUser' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                            <IconCaretDown />
                                        </div>
                                    </button>
                                    <AnimateHeight duration={300} height={currentMenu === 'customUser' ? 'auto' : 0}>
                                        <ul className="sub-menu text-gray-500">
                                            {routes.some((v) => v.includes('/addEmployee')) && (
                                                <li>
                                                    <NavLink to="/apple/hjo/login/addEmployee">{t('addEmployee')}</NavLink>
                                                </li>
                                            )}
                                            {routes.some((v) => v.includes('/updateEmployee')) && (
                                                <li>
                                                    <NavLink to="/apple/hjo/login/updateEmployee">{t('updateEmployee')}</NavLink>
                                                </li>
                                            )}
                                            {routes.some((v) => v.includes('/addPartner')) && (
                                                <li>
                                                    <NavLink to="/apple/hjo/login/addPartner">{t('addPartner')}</NavLink>
                                                </li>
                                            )}
                                            {routes.some((v) => v.includes('/updatePartner')) && (
                                                <li>
                                                    <NavLink to="/apple/hjo/login/updatePartner">{t('updatePartner')}</NavLink>
                                                </li>
                                            )}
                                            {routes.some((v) => v.includes('/addCareCenter')) && (
                                                <li>
                                                    <NavLink to="/apple/hjo/login/addCareCenter">{t('addCareCenter')}</NavLink>
                                                </li>
                                            )}
                                            {routes.some((v) => v.includes('/updateCareCenter')) && (
                                                <li>
                                                    <NavLink to="/apple/hjo/login/updateCareCenter">{t('updateCareCenter')}</NavLink>
                                                </li>
                                            )}
                                        </ul>
                                    </AnimateHeight>
                                </li>
                            )}
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
