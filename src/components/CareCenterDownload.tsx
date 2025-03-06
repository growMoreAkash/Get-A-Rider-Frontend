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
//           <p><span className="font-bold">Shop Name:</span> {shopDetails.shopName}</p>
//           <p><span className="font-bold">Owner Name:</span> {shopDetails.ownerName}</p>
//           <p><span className="font-bold">Care Of:</span> {shopDetails.careOf}</p>
//           <p><span className="font-bold">Sex:</span> {shopDetails.sex}</p>
//           <p><span className="font-bold">Marital Status:</span> {shopDetails.maritalStatus}</p>
//           <p><span className="font-bold">Age:</span> {shopDetails.age}</p>
//           <p><span className="font-bold">Highest Qualification:</span> {shopDetails.highestQualification}</p>
//           <p><span className="font-bold">Occupation:</span> {shopDetails.occupation}</p>
//           <p><span className="font-bold">Annual Income:</span> {shopDetails.annualIncome}</p>
//         </div>
//       </div>

//       {/* Address Details Section */}
//       <div className="border p-4 mb-4">
//         <h3 className="font-bold mb-2">Address Details</h3>
//         <div className="grid grid-cols-3 gap-4">
//           <p><span className="font-bold">House/Shop Number:</span> {addressDetails.houseOrShopNumber}</p>
//           <p><span className="font-bold">Ward/GP Name:</span> {addressDetails.wardOrGPName}</p>
//           <p><span className="font-bold">City/Town:</span> {addressDetails.cityOrTown}</p>
//           <p><span className="font-bold">Lane Name/Number:</span> {addressDetails.laneNameOrNumber}</p>
//           <p><span className="font-bold">Post Office:</span> {addressDetails.postOffice}</p>
//           <p><span className="font-bold">District:</span> {addressDetails.district}</p>
//           <p><span className="font-bold">State:</span> {addressDetails.state}</p>
//           <p><span className="font-bold">PIN:</span> {addressDetails.pin}</p>
//         </div>
//       </div>

//       {/* Banking Details Section */}
//       <div className="border p-4 mb-4">
//         <h3 className="font-bold mb-2">Banking Details</h3>
//         <div className="grid grid-cols-3 gap-4">
//           <p><span className="font-bold">Bank Name:</span> {bankingDetails.bankName}</p>
//           <p><span className="font-bold">Branch Name:</span> {bankingDetails.branchName}</p>
//           <p><span className="font-bold">Account Number:</span> {bankingDetails.accountNumber}</p>
//           <p><span className="font-bold">Account Holder Name:</span> {bankingDetails.accountHolderName}</p>
//           <p><span className="font-bold">IFSC Code:</span> {bankingDetails.ifscCode}</p>
//         </div>
//       </div>

//       {/* Footer Section */}
//       <div className="text-center text-sm text-gray-600 mt-4">
//         <p><span className="font-bold">Company - Get A Ride</span></p>
//         <p><span className="font-bold">Parent Company - Get Your Homes</span></p>
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
import GYH from "../assets/gyh_logo.png";

const CareCenterRegistration = forwardRef(({ data }, ref) => {
  if (!data) {
    return <div>No data available.</div>;
  }

  const { shopDetails, bankingDetails, addressDetails, ownershipDetails, officialDetails } = data;

  return (
    <div
      ref={ref}
      className="w-[800px] mx-auto p-6 border border-gray-300 rounded-lg shadow-lg bg-white"
    >
      <style>
        {`
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            .w-\[800px\] {
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
      <div className="flex justify-between items-center mb-4 text-center">
        <img src={icon} alt="Icon" className="h-16" />
        <div>
          <p className="text-xl font-normal">Care Centre Registration</p>
          <h1 className="text-2xl font-extrabold">Get A Ride</h1>
          <p className="text-sm italic">by Get Your Homes</p>
        </div>
        <img src={barcode} alt="Barcode" className="h-16" />
      </div>

      {/* Main Section */}
      <div className="flex justify-between mb-8 mt-8 text-center">
        <div className="flex gap-5">
          <img src={ownershipDetails.shopPhotos} alt="Icon" className="h-[8rem]" />
          <div>
            <p><span className="font-bold">Registration Number:</span> {shopDetails.registrationNumber}</p>
            <p><span className="font-bold">Computers in Ok condition:</span> {shopDetails.ownerName}</p>
            <p><span className="font-bold">Branch:</span> {officialDetails.branch}</p>
            <p><span className="font-bold">Zone:</span> {officialDetails.zone}</p>
            <p><span className="font-bold">Centre ID:</span> {officialDetails.careCenterId}</p>
          </div>
        </div>
        <img src={ownershipDetails.signature} alt="Barcode" className="h-[8rem]" />
      </div>

      {/* Shop Details Section */}
      <div className="border shadow-md rounded p-4 mb-4">
        <h3 className="font-bold mb-2 text-base">Shop Owner's Personal Details</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <p><span className="font-bold">Care Center Name:</span> {shopDetails.shopName}</p>
          <p><span className="font-bold">Owner Name:</span> {shopDetails.ownerName}</p>
          <p><span className="font-bold">Care Of:</span> {shopDetails.careOf}</p>
          <p><span className="font-bold">Sex:</span> {shopDetails.sex}</p>
          <p><span className="font-bold">Marital Status:</span> {shopDetails.maritalStatus}</p>
          <p><span className="font-bold">Age:</span> {shopDetails.age}</p>
          <p><span className="font-bold">Highest Qualification:</span> {shopDetails.highestQualification}</p>
          <p><span className="font-bold">Occupation:</span> {shopDetails.occupation}</p>
          <p><span className="font-bold">Annual Income:</span> {shopDetails.annualIncome}</p>
          <p><span className="font-bold">Alternate phone number:</span> {shopDetails.alternatePhoneNumber}</p>
          <p><span className="font-bold">Personal Email:</span> {shopDetails.personalEmailId}</p>
          <p><span className="font-bold">Year Of Opening:</span> {shopDetails.yearOfOpening}</p>
          <p><span className="font-bold">Phone Number:</span> {shopDetails.whatsappNumber}</p>
          <p><span className="font-bold">Whatsapp Number:</span> {shopDetails.alternatePhoneNumber}</p>
          <p><span className="font-bold">Computers in Ok condition:</span> {shopDetails.registrationNumber}</p>
          <p><span className="font-bold">Average customer per day:</span> {shopDetails.computersInOkCondition}</p>
          <p><span className="font-bold">Registration Number of shop:</span> {shopDetails.averageCustomersPerDay}</p>
        </div>
      </div>

      {/* Address Details Section */}
      <div className="border p-4 shadow-md rounded mb-4">
        <h3 className="font-bold mb-2 text-base">Shop Owner's Address Details</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <p><span className="font-bold">House/Shop Number:</span> {addressDetails.houseOrShopNumber}</p>
          <p><span className="font-bold">Ward/GP Name:</span> {addressDetails.wardOrGPName}</p>
          <p><span className="font-bold">City/Town (Nearest):</span> {addressDetails.cityOrTown}</p>
          <p><span className="font-bold">Lane Name/Number:</span> {addressDetails.laneNameOrNumber}</p>
          <p><span className="font-bold">Post Office:</span> {addressDetails.postOffice}</p>
          <p><span className="font-bold">Police Station:</span> {addressDetails.policeStation}</p>
          <p><span className="font-bold">District:</span> {addressDetails.district}</p>
          <p><span className="font-bold">State:</span> {addressDetails.state}</p>
          <p><span className="font-bold">PIN:</span> {addressDetails.pin}</p>
        </div>
      </div>

      {/* Banking Details Section */}
      <div className="border p-4 shadow-md rounded mb-4">
        <h3 className="font-bold mb-2 text-base">Shop Owner's Banking Details</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <p><span className="font-bold">Bank Name:</span> {bankingDetails.bankName}</p>
          <p><span className="font-bold">UPI ID:</span> {bankingDetails.upiId}</p>
          <p><span className="font-bold">Account Number:</span> {bankingDetails.accountNumber}</p>
          <p><span className="font-bold">Account Holder Name:</span> {bankingDetails.accountHolderName}</p>
          <p><span className="font-bold">IFSC Code:</span> {bankingDetails.ifscCode}</p>
          <p><span className="font-bold">Google Pay Number:</span> {bankingDetails.googlePayNumber}</p>
        </div>
      </div>

      {/* Footer Section */}
      <div className="flex justify-around">
        <div className="text-center text-sm text-gray-600 mt-4">
          <p><span className="font-bold">Company - Get A Ride</span></p>
          <p><span className="font-bold">Parent Company - Get Your Homes</span></p>
          <p>Address: Mamoni Enterprise, Opposite to Kalain HS Road, Kalain, Cachar, Assam</p>
          <p>Approved by Founder & CEO</p>
        </div>
        <div>
          <img src={GYH} alt="Icon" className="h-16" />
        </div>
      </div>
    </div>
  );
});

export default CareCenterRegistration;
