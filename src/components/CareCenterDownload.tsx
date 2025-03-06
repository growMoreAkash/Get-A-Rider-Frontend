// import React, { forwardRef } from "react";
// import barcode from "../assets/barcode1.svg";
// import icon from "../assets/icon_home.svg";

// // Define the data structure for the care center
// interface ShopDetails {
//   shopName: string;
//   ownerName: string;
//   careOf: string;
//   sex: string;
//   maritalStatus: string;
//   age: string;
//   highestQualification: string;
//   occupation: string;
//   annualIncome: string;
//   alternatePhoneNumber: string;
//   personalEmailId: string;
//   yearOfOpening: string;
//   whatsappNumber: string;
//   registrationNumber: string;
//   computersInOkCondition: string;
//   averageCustomersPerDay: string;
// }

// interface AddressDetails {
//   houseOrShopNumber: string;
//   wardOrGPName: string;
//   cityOrTown: string;
//   laneNameOrNumber: string;
//   postOffice: string;
//   policeStation: string;
//   district: string;
//   state: string;
//   pin: string;
// }

// interface BankingDetails {
//   bankName: string;
//   branchName: string;
//   accountNumber: string;
//   accountHolderName: string;
//   ifscCode: string;
//   panNumber: string;
//   aadhaarNumber: string;
//   upiId: string;
//   googlePayNumber: string;
//   phonePayNumber: string;
// }

// interface CareCenterData {
//   shopDetails: ShopDetails;
//   bankingDetails: BankingDetails;
//   addressDetails: AddressDetails;
// }

// interface CareCenterProps {
//   data?: CareCenterData; // Optional to prevent runtime errors
// }

// const CareCenterRegistration = forwardRef<HTMLDivElement, CareCenterProps>(({ data }, ref) => {
//   if (!data) {
//     return <div>No data available.</div>;
//   }

//   const { shopDetails, bankingDetails, addressDetails } = data;

//   return (
//     <div ref={ref} className="max-w-4xl mx-auto p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
//       <style>
//         {`
//           @media print {
//             body {
//               margin: 0;
//               padding: 0;
//             }

//             .max-w-4xl {
//               width: 100%;
//               max-width: 100%;
//               margin: 0;
//               padding: 0;
//               box-shadow: none;
//               border: none;
//             }

//             button {
//               display: none;
//             }

//             .border {
//               border: 1px solid #000 !important;
//             }

//             .grid {
//               display: block;
//             }

//             .grid > * {
//               display: block;
//               margin-bottom: 10px;
//             }
//           }
//         `}
//       </style>

//       {/* Header Section */}
//       <div className="flex justify-between items-center mb-4">
//         <img src={icon} alt="Icon" className="h-16" />
//         <div className="text-center">
//           <p className="text-xl font-normal">Shop Registration</p>
//           <h1 className="text-2xl font-extrabold">Get A Ride</h1>
//           <p className="text-sm italic">by Get Your Homes</p>
//         </div>
//         <img src={barcode} alt="Barcode" className="h-16" />
//       </div>

//       {/* Shop Details Section */}
//       <div className="border p-4 mb-4">
//         <h3 className="font-bold mb-2">Shop Details</h3>
//         <div className="grid grid-cols-3 gap-4">
//           <p><span className="font-semibold">Shop Name:</span> {shopDetails.shopName}</p>
//           <p><span className="font-semibold">Owner Name:</span> {shopDetails.ownerName}</p>
//           <p><span className="font-semibold">Care Of:</span> {shopDetails.careOf}</p>
//           <p><span className="font-semibold">Sex:</span> {shopDetails.sex}</p>
//           <p><span className="font-semibold">Marital Status:</span> {shopDetails.maritalStatus}</p>
//           <p><span className="font-semibold">Age:</span> {shopDetails.age}</p>
//           <p><span className="font-semibold">Highest Qualification:</span> {shopDetails.highestQualification}</p>
//           <p><span className="font-semibold">Occupation:</span> {shopDetails.occupation}</p>
//           <p><span className="font-semibold">Annual Income:</span> {shopDetails.annualIncome}</p>
//         </div>
//       </div>

//       {/* Address Details Section */}
//       <div className="border p-4 mb-4">
//         <h3 className="font-bold mb-2">Address Details</h3>
//         <div className="grid grid-cols-3 gap-4">
//           <p><span className="font-semibold">House/Shop Number:</span> {addressDetails.houseOrShopNumber}</p>
//           <p><span className="font-semibold">Ward/GP Name:</span> {addressDetails.wardOrGPName}</p>
//           <p><span className="font-semibold">City/Town:</span> {addressDetails.cityOrTown}</p>
//           <p><span className="font-semibold">Lane Name/Number:</span> {addressDetails.laneNameOrNumber}</p>
//           <p><span className="font-semibold">Post Office:</span> {addressDetails.postOffice}</p>
//           <p><span className="font-semibold">District:</span> {addressDetails.district}</p>
//           <p><span className="font-semibold">State:</span> {addressDetails.state}</p>
//           <p><span className="font-semibold">PIN:</span> {addressDetails.pin}</p>
//         </div>
//       </div>

//       {/* Banking Details Section */}
//       <div className="border p-4 mb-4">
//         <h3 className="font-bold mb-2">Banking Details</h3>
//         <div className="grid grid-cols-3 gap-4">
//           <p><span className="font-semibold">Bank Name:</span> {bankingDetails.bankName}</p>
//           <p><span className="font-semibold">Branch Name:</span> {bankingDetails.branchName}</p>
//           <p><span className="font-semibold">Account Number:</span> {bankingDetails.accountNumber}</p>
//           <p><span className="font-semibold">Account Holder Name:</span> {bankingDetails.accountHolderName}</p>
//           <p><span className="font-semibold">IFSC Code:</span> {bankingDetails.ifscCode}</p>
//         </div>
//       </div>

//       {/* Footer Section */}
//       <div className="text-center text-sm text-gray-600 mt-4">
//         <p><span className="font-semibold">Company - Get A Ride</span></p>
//         <p><span className="font-semibold">Parent Company - Get Your Homes</span></p>
//         <p>Address: Mamoni Enterprise, Opposite to Kalain HS Road, Kalain, Cachar, Assam</p>
//         <p>Approved by Founder & CEO</p>
//       </div>
//     </div>
//   );
// });

// export default CareCenterRegistration;

import React, { forwardRef } from "react";
import barcode from "../assets/barcode1.svg";
import icon from "../assets/icon_home.svg";

const CareCenterRegistration = forwardRef(({ data }, ref) => {
  if (!data) {
    return <div>No data available.</div>;
  }

  const { shopDetails, bankingDetails, addressDetails } = data;

  return (
    <div ref={ref} className="max-w-4xl mx-auto p-4 sm:p-6 border border-gray-300 rounded-lg shadow-lg bg-white overflow-hidden">
      <style>
        {`
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            .max-w-4xl {
              width: 100%;
              max-width: 100%;
              margin: 0;
              padding: 0;
              box-shadow: none;
              border: none;
            }
            button {
              display: none;
            }
            .border {
              border: 1px solid #000 !important;
            }
            .grid {
              display: block;
            }
            .grid > * {
              display: block;
              margin-bottom: 10px;
            }
          }
        `}
      </style>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 text-center sm:text-left">
        <img src={icon} alt="Icon" className="h-12 sm:h-16" />
        <div>
          <p className="text-lg sm:text-xl font-normal">Shop Registration</p>
          <h1 className="text-xl sm:text-2xl font-extrabold">Get A Ride</h1>
          <p className="text-xs sm:text-sm italic">by Get Your Homes</p>
        </div>
        <img src={barcode} alt="Barcode" className="h-12 sm:h-16" />
      </div>

      {/* Shop Details Section */}
      <div className="border p-4 mb-4">
        <h3 className="font-bold mb-2">Shop Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm sm:text-base">
          <p><span className="font-semibold">Shop Name:</span> {shopDetails.shopName}</p>
          <p><span className="font-semibold">Owner Name:</span> {shopDetails.ownerName}</p>
          <p><span className="font-semibold">Care Of:</span> {shopDetails.careOf}</p>
          <p><span className="font-semibold">Sex:</span> {shopDetails.sex}</p>
          <p><span className="font-semibold">Marital Status:</span> {shopDetails.maritalStatus}</p>
          <p><span className="font-semibold">Age:</span> {shopDetails.age}</p>
          <p><span className="font-semibold">Highest Qualification:</span> {shopDetails.highestQualification}</p>
          <p><span className="font-semibold">Occupation:</span> {shopDetails.occupation}</p>
          <p><span className="font-semibold">Annual Income:</span> {shopDetails.annualIncome}</p>
        </div>
      </div>

      {/* Address Details Section */}
      <div className="border p-4 mb-4">
        <h3 className="font-bold mb-2">Address Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm sm:text-base">
          <p><span className="font-semibold">House/Shop Number:</span> {addressDetails.houseOrShopNumber}</p>
          <p><span className="font-semibold">Ward/GP Name:</span> {addressDetails.wardOrGPName}</p>
          <p><span className="font-semibold">City/Town:</span> {addressDetails.cityOrTown}</p>
          <p><span className="font-semibold">Lane Name/Number:</span> {addressDetails.laneNameOrNumber}</p>
          <p><span className="font-semibold">Post Office:</span> {addressDetails.postOffice}</p>
          <p><span className="font-semibold">District:</span> {addressDetails.district}</p>
          <p><span className="font-semibold">State:</span> {addressDetails.state}</p>
          <p><span className="font-semibold">PIN:</span> {addressDetails.pin}</p>
        </div>
      </div>

      {/* Banking Details Section */}
      <div className="border p-4 mb-4">
        <h3 className="font-bold mb-2">Banking Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm sm:text-base">
          <p><span className="font-semibold">Bank Name:</span> {bankingDetails.bankName}</p>
          <p><span className="font-semibold">Branch Name:</span> {bankingDetails.branchName}</p>
          <p><span className="font-semibold">Account Number:</span> {bankingDetails.accountNumber}</p>
          <p><span className="font-semibold">Account Holder Name:</span> {bankingDetails.accountHolderName}</p>
          <p><span className="font-semibold">IFSC Code:</span> {bankingDetails.ifscCode}</p>
        </div>
      </div>

      {/* Footer Section */}
      <div className="text-center text-xs sm:text-sm text-gray-600 mt-4">
        <p><span className="font-semibold">Company - Get A Ride</span></p>
        <p><span className="font-semibold">Parent Company - Get Your Homes</span></p>
        <p>Address: Mamoni Enterprise, Opposite to Kalain HS Road, Kalain, Cachar, Assam</p>
        <p>Approved by Founder & CEO</p>
      </div>
    </div>
  );
});

export default CareCenterRegistration;
