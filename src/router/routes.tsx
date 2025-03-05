import { lazy } from 'react';
import DriverAttributes from '../pages/DriverAttributes';
import IDAttributes from '../pages/IDAttributes';
import Role from '../pages/Role';
import AssignRole from '../pages/AssignRole';
import InstantEmployeeSignup from '../pages/InstantEmployeeSignup';
import EmployeeUpdate from '../pages/EmployeeUpdate';
import InstantPartnerSignup from '../pages/InstantPartnerSignup';
import PartnerUpdate from '../pages/PartnerUpdate';
import InstantCareCenterSignup from '../pages/InstantCareCenterSignup';
import CareCenterUpdate from '../pages/CareCenterUpdate';
import Login from '../pages/Login';
import VehicleFeaturesDelete from '../pages/VehicleFeaturesDelete';
import DriverAttributesDelete from '../pages/DriverAttributesDelete';
import IDAttributesDelete from '../pages/IDAttributesDelete';
const VehicleFeatures = lazy(() => import('../pages/VehicleFeatures'));
const ReturnSection = lazy(() => import('../pages/ReturnSection'));
const ProfileUpdate = lazy(() => import('../pages/ProfileUpdate'));
const InstantSignup = lazy(() => import('../pages/InstantSignup'));
const VehicleSignup = lazy(() => import('../pages/VehicleSignup'));
const InstantDriverSignup = lazy(() => import('../pages/InstantDriverSignup'));
const VehicleUpdate = lazy(() => import('../pages/VehicleUpdate'));
const DriverUpdate = lazy(() => import('../pages/DriverUpdate'));
const TransferVerification = lazy(() => import('../pages/TransferVerification'));
const DriverVerification = lazy(() => import('../pages/DriverVerification'));
const VehicleVerification = lazy(() => import('../pages/VehicleVerification'));
const FairSetup = lazy(() => import('../pages/FairSetup'));
const CreateBranch = lazy(() => import('../pages/createBranch'));
const Index = lazy(() => import('../pages/Index'));
const VehicleAttributes = lazy(() => import('../pages/VehicleAttributes'));
const VehicleAttributesDelete = lazy(() => import('../pages/VehicleAttributesDelete'));
const VehicleTransferVerification = lazy(() => import('../pages/VehicleTransferVerification'));
const VehicleReturnSection = lazy(() => import('../pages/VehicleReturnSection'));
const DocUpdateReusable = lazy(() => import('../components/DocUpdate/DocUpdateDriver'));
const DeleteBranch = lazy(() => import('../pages/DeleteBranch'));
const DeleteZone = lazy(() => import('../pages/DeleteZone'));
const CreateZone = lazy(() => import('../pages/CreateZone'));

const dashHost = 'apple/hjo/login';

const routes = [
    {
        path: dashHost + '/',
        element: <Login />,
        layout: 'default',
        apis: ['/loginAdmin', '/loginEmployee', '/loginPartner', '/loginCareCenter', '/getAdmin', '/getEmployee', '/getPartner', '/getCareCenter'],
    },
    {
        path: dashHost + '/features',
        element: <VehicleFeatures />,
        apis: ['/firstCreate', '/getCategory', '/getVehicleOtherData', '/getAllVehicle', '/getVehicleData', '/addType', '/addOtherData'],
    },
    {
        path: dashHost + '/featuresDelete',
        element: <VehicleFeaturesDelete />,
        apis: [
            '/firstCreate',
            '/getCategory',
            '/getVehicleOtherData',
            '/getAllVehicle',
            '/getVehicleData',
            '/deleteVehicleOtherData',
            '/deleteType',
            '/deleteBrand',
            '/deleteBrand',
            '/deleteModel',
            '/deleteCategory',
        ],
    },
    {
        path: dashHost + '/profileUpdate',
        element: <ProfileUpdate />,
        apis: ['/getUser', 'getAllUser', '/users', '/updateProfile'],
    },
    {
        path: dashHost + '/instantSignup',
        element: <InstantSignup />,
        apis: ['/signup', 'getAllUser', '/verifyOtp', '/addPassword'],
    },
    {
        path: dashHost + '/vehicleUpdate',
        element: <VehicleUpdate />,
        apis: [
            '/getVehicleOtherData',
            '/getCategory',
            '/getAllVehicle',
            '/getVehicleData',
            '/getAllDrivers',
            '/firstCreateMaster',
            '/getVehicle',
            '/updateVehicle',
            '/getVehicleAttribute',
            '/getDriverAttribute',
        ],
    },
    {
        path: dashHost + '/driverUpdate',
        element: <DriverUpdate />,
        apis: [
            '/firstCreateMaster',
            '/getDriver',
            '/getDriverAttribute',
            '/getDrives',
            '/getOwners',
            '/updateProfileDriver',
            '/addOwner',
            '/getAllDrivers',
            '/updateOwner',
            '/uploadDriverDocuments',
            '/uploadOwnerDocuments',
            '/deleteDriver',
        ],
    },
    {
        path: dashHost + '/transferVerification',
        element: <TransferVerification />,
        apis: ['/changeProcessingSection', '/getAllDrivers','/updateProfileDriver'],
    },
    {
        path: dashHost + '/vehicleTransferVerification',
        element: <VehicleTransferVerification />,
        apis: ['/changeVehicleProcessingSection', '/getAllVehicle','/vehiclePayment'],
    },
    {
        path: dashHost + '/returnSection',
        element: <ReturnSection />,
        apis: ['/changeProcessingSection', '/getAllDrivers'],
    },
    {
        path: dashHost + '/driverVerification',
        element: <DriverVerification />,
        apis: ['/getAllDrivers','/changeProcessingSection'],
    },
    // {
    //     path: dashHost + '/vehicleVerification',
    //     element: <VehicleVerification />,
    //     apis: [],
    // },
    // iske baad
    {
        path: dashHost + '/fairSetup',
        element: <FairSetup />,
        apis: ["/getZone", "/getAllZonesByBranch", "/addFareToZone",'/getIdCreation/:MasterId','/getVehicleOtherData']
    },
    {
        path: dashHost + '/branchSetup/createBranch',
        element: <CreateBranch />,
        apis: ["/createBranch", "/firstCreateMaster", "/getIdCreation"]
    },
    {
        path: dashHost + '/zoneSetup/createZone',
        element: <CreateZone />,
        apis: ["/createZone", "/firstCreateMaster", "/getIdCreation"]
    },
    {
        path: dashHost + '/zoneSetup/deleteZone',
        element: <DeleteZone />,
        apis: ["/createZone", "/firstCreateMaster", "/getIdCreation"]
    },
    {
        path: dashHost + '/branchSetup/deleteBranch',
        element: <DeleteBranch />,
        apis: ["/createZone", "/firstCreateMaster", "/getIdCreation"]
    },

    // isek phele
    {
        path: dashHost + '/instantDriverSignup',
        element: <InstantDriverSignup />,
        apis: ['/signupDriver', '/verifyOtpDriver', '/addPasswordDriver'],
    },
    {
        path: dashHost + '/vehicleSignup',
        element: <VehicleSignup />,
        apis: [
            '/getOwners',
            '/getSpecificData',
            '/createVehicle',
            '/getAllDrivers',
            '/getAllVehicle',
            '/firstCreate',
            '/getCategory',
            '/getVehicleOtherData',
            '/getVehicleData',
            '/getAllVehicle',
            '/getCategory',
            '/firstCreate',
            '/getVehicleOtherData',
            '/getVehicleData',
            '/getOwners',
        ],
    },
    {
        path: dashHost + '/vehicleAttributes',
        element: <VehicleAttributes />,
        apis: ['/addOtherData', '/addType', '/getCategory', '/getVehicleOtherData', '/getAllVehicle', '/getVehicleData', '/updateVehicleOtherData'],
    },
    {
        path: dashHost + '/vehicleAttributesDelete',
        element: <VehicleAttributesDelete />,
        apis: ['/getCategory', '/getVehicleOtherData', '/getAllVehicle', '/getVehicleData', '/deleteVehicleOtherData', '/deleteType', '/deleteBrand', '/deleteCategory'],
    },
    {
        path: dashHost + '/vehicleReturnSection',
        element: <VehicleReturnSection />,
        apis: [],
    },
    {
        path: dashHost + '/driverAttributes',
        element: <DriverAttributes />,
        apis: ['/firstCreateMaster', '/addDriverAttribute', '/getDriverAttribute'],
    },
    {
        path: dashHost + '/idAttributes',
        element: <IDAttributes />,
        apis: ['/firstCreateMaster', '/getIdCreation', '/createCountry', '/createState', '/createBranchId', '/createZoneId'],
    },
    {
        path: dashHost + '/idAttributesDelete',
        element: <IDAttributesDelete />,
        apis: ['/firstCreateMaster', '/addDriverAttribute', '/getDriverAttribute'],
    },
    {
        path: dashHost + '/driverAttributesDelete',
        element: <DriverAttributesDelete />,
        apis: ['/firstCreateMaster', '/deleteDriverAttribute', '/getDriverAttribute'],
    },
    {
        path: dashHost + '/roles',
        element: <Role />,
        apis: ['/getApiList', '/getAllRole', '/updateRole', '/createRole'],
    },
    {
        path: dashHost + '/assignRoles',
        element: <AssignRole />,
        apis: ['/getAllRole', '/getAllEmployee', '/getAllPartner', '/getAllCareCenter', '/assignCustomUserRole'],
    },
    {
        path: dashHost + '/addEmployee',
        element: <InstantEmployeeSignup />,
        apis: ['/getAllEmployee', '/signupEmployee', '/verifyOtpEmployee', '/addPasswordEmployee'],
    },
    {
        path: dashHost + '/updateEmployee',
        element: <EmployeeUpdate />,
        apis: ['/getAllEmployee', '/getEmployee', '/updateEmployeeProfile', '/uploadEmployeeDocuments'],
    },
    {
        path: dashHost + '/addPartner',
        element: <InstantPartnerSignup />,
        apis: ['/getAllPartner', '/signupPartner', '/verifyOtpPartner', '/addPasswordPartner'],
    },
    {
        path: dashHost + '/updatePartner',
        element: <PartnerUpdate />,
        apis: ['/getAllPartner', '/getPartner', '/updatePartnerProfile', '/uploadPartnerDocuments'],
    },
    {
        path: dashHost + '/addCareCenter',
        element: <InstantCareCenterSignup />,
        apis: ['/getAllCareCenter', '/signupCareCenter', '/verifyOtpCareCenter', '/addPasswordCareCenter'],
    },
    {
        path: dashHost + '/updateCareCenter',
        element: <CareCenterUpdate />,
        apis: ['/getAllCareCenter', '/getCareCenter', '/updateCareCenterProfile', '/uploadCareCenterDocuments'],
    },
];

export { routes };
