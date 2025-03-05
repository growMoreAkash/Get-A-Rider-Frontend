import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler, Controller, FieldValues } from 'react-hook-form';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

// 1) Define the file fields your form will handle PLUS the new `ownerPartnerStatus`:
interface UpdateFormFields {
  ownerPartnerStatus: 'SOP' | 'NOP';
  // partner docs
  aadhaarCard: FileList | null;
  photo: FileList | null;
  photoWithShop: FileList | null;
  cancelledChequeOrPassbook: FileList | null;
  qrCodeOfBank: FileList | null;
  // owner docs
  ownerShopPhotos: FileList | null;
  ownerRegistrationCertificate: FileList | null;
  ownerAadhaarCard: FileList | null;
  ownerPhoto: FileList | null;
  ownerPhotoWithShop: FileList | null;
  ownerSignature: FileList | null;
}

interface CareCenterData {
  _id: string;
  // Extend as needed if you store other careCenter properties
  partnerDetails?: {
    uploads?: {
      aadhaarCard?: string;
      photo?: string;
      photoWithShop?: string;
      cancelledChequeOrPassbook?: string;
      qrCodeOfBank?: string;
    };
  };
  ownershipDetails?: {
    shopPhotos?: string;
    registrationCertificate?: string;
    aadhaarCard?: string;
    photo?: string;
    photoWithShop?: string;
    signature?: string;
  };
}

interface DocUpdateCareCenterProps {
  careCenter: CareCenterData;
  onSave?: () => void;
  onCancel?: () => void;
}

// Optional helper to see if any partner doc was provided by the server:
function hasAnyPartnerDoc(careCenter?: CareCenterData) {
  const p = careCenter?.partnerDetails?.uploads;
  if (!p) return false;
  return (
    p.aadhaarCard ||
    p.photo ||
    p.photoWithShop ||
    p.cancelledChequeOrPassbook ||
    p.qrCodeOfBank
  );
}

// 2) Main Component
const DocUpdateCareCenter: React.FC<DocUpdateCareCenterProps> = ({
  careCenter,
  onSave,
  onCancel
}) => {
  var token = Cookies.get('token');

  // Replace with your actual backend URL:
  const host = 'https://api.getarider.in/api';

  // We'll store previews in an object keyed by field name
  const [filePreviews, setFilePreviews] = useState<{ [key: string]: string | null }>({});

  // 3) Initialize react-hook-form
  const {
    watch,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateFormFields>({
    defaultValues: {
      // If the careCenter already has partner documents, default to "NOP".
      // Otherwise default to "SOP".
      ownerPartnerStatus: hasAnyPartnerDoc(careCenter) ? 'NOP' : 'SOP',

      // Partner docs
      aadhaarCard: null,
      photo: null,
      photoWithShop: null,
      cancelledChequeOrPassbook: null,
      qrCodeOfBank: null,

      // Owner docs
      ownerShopPhotos: null,
      ownerRegistrationCertificate: null,
      ownerAadhaarCard: null,
      ownerPhoto: null,
      ownerPhotoWithShop: null,
      ownerSignature: null,
    },
  });

  // 4) Watch the ownerPartnerStatus so we know if we show/hide partner docs:
  const watchOwnerPartnerStatus = watch('ownerPartnerStatus');

  // 5) On mount or when careCenter changes, reset form & set file previews
  useEffect(() => {
    if (careCenter) {
      // Reset form
      reset({
        ownerPartnerStatus: hasAnyPartnerDoc(careCenter) ? 'NOP' : 'SOP',
        aadhaarCard: null,
        photo: null,
        photoWithShop: null,
        cancelledChequeOrPassbook: null,
        qrCodeOfBank: null,
        ownerShopPhotos: null,
        ownerRegistrationCertificate: null,
        ownerAadhaarCard: null,
        ownerPhoto: null,
        ownerPhotoWithShop: null,
        ownerSignature: null,
      });

      // If the backend returns existing images, set them as preview
      let newPreviews: { [key: string]: string | null } = {};

      const partnerdoc = careCenter?.partnerDetails?.uploads;
      if (partnerdoc) {
        if (partnerdoc.aadhaarCard) {
          newPreviews['aadhaarCard'] = partnerdoc.aadhaarCard;
        }
        if (partnerdoc.photo) {
          newPreviews['photo'] = partnerdoc.photo;
        }
        if (partnerdoc.photoWithShop) {
          newPreviews['photoWithShop'] = partnerdoc.photoWithShop;
        }
        if (partnerdoc.cancelledChequeOrPassbook) {
          newPreviews['cancelledChequeOrPassbook'] = partnerdoc.cancelledChequeOrPassbook;
        }
        if (partnerdoc.qrCodeOfBank) {
          newPreviews['qrCodeOfBank'] = partnerdoc.qrCodeOfBank;
        }
      }

      const doc = careCenter?.ownershipDetails;
      if (doc) {
        if (doc.shopPhotos) {
          newPreviews['ownerShopPhotos'] = doc.shopPhotos;
        }
        if (doc.registrationCertificate) {
          newPreviews['ownerRegistrationCertificate'] = doc.registrationCertificate;
        }
        if (doc.aadhaarCard) {
          newPreviews['ownerAadhaarCard'] = doc.aadhaarCard;
        }
        if (doc.photo) {
          newPreviews['ownerPhoto'] = doc.photo;
        }
        if (doc.photoWithShop) {
          newPreviews['ownerPhotoWithShop'] = doc.photoWithShop;
        }
        if (doc.signature) {
          newPreviews['ownerSignature'] = doc.signature;
        }
      }

      setFilePreviews(newPreviews);
    }
  }, [careCenter, reset]);

  // 6) Submit
  const onSubmit: SubmitHandler<UpdateFormFields> = async (data) => {
    try {
      const formData = new FormData();

      // Partner docs
      if (data.aadhaarCard && data.aadhaarCard.length > 0) {
        formData.append('aadhaarCard', data.aadhaarCard[0]);
      }
      if (data.photo && data.photo.length > 0) {
        formData.append('photo', data.photo[0]);
      }
      if (data.photoWithShop && data.photoWithShop.length > 0) {
        formData.append('photoWithShop', data.photoWithShop[0]);
      }
      if (data.cancelledChequeOrPassbook && data.cancelledChequeOrPassbook.length > 0) {
        formData.append('cancelledChequeOrPassbook', data.cancelledChequeOrPassbook[0]);
      }
      if (data.qrCodeOfBank && data.qrCodeOfBank.length > 0) {
        formData.append('qrCodeOfBank', data.qrCodeOfBank[0]);
      }

      // Owner docs
      if (data.ownerShopPhotos && data.ownerShopPhotos.length > 0) {
        formData.append('ownerShopPhotos', data.ownerShopPhotos[0]);
      }
      if (data.ownerRegistrationCertificate && data.ownerRegistrationCertificate.length > 0) {
        formData.append(
          'ownerRegistrationCertificate',
          data.ownerRegistrationCertificate[0]
        );
      }
      if (data.ownerAadhaarCard && data.ownerAadhaarCard.length > 0) {
        formData.append('ownerAadhaarCard', data.ownerAadhaarCard[0]);
      }
      if (data.ownerPhoto && data.ownerPhoto.length > 0) {
        formData.append('ownerPhoto', data.ownerPhoto[0]);
      }
      if (data.ownerPhotoWithShop && data.ownerPhotoWithShop.length > 0) {
        formData.append('ownerPhotoWithShop', data.ownerPhotoWithShop[0]);
      }
      if (data.ownerSignature && data.ownerSignature.length > 0) {
        formData.append('ownerSignature', data.ownerSignature[0]);
      }

      await axios.post(`${host}/uploadCareCenterDocuments/${careCenter._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        icon: 'success',
        title: 'CareCenter documents updated successfully',
        timer: 3000,
      });
      if (onSave) onSave();
    } catch (error: any) {
      Swal.fire('Error', 'Failed to update careCenter documents. Try again.', 'error');
    }
  };

  // 7) Generic change handler to set a local preview
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (val: FileList | null) => void
  ) => {
    const { id, files } = e.target;
    onChange(files || null); // Update react-hook-form’s state

    if (files && files[0]) {
      const localUrl = URL.createObjectURL(files[0]);
      setFilePreviews((prev) => ({ ...prev, [id]: localUrl }));
    } else {
      setFilePreviews((prev) => ({ ...prev, [id]: null }));
    }
  };

  // 8) Cleanup previews when unmounting
  useEffect(() => {
    return () => {
      Object.values(filePreviews).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [filePreviews]);

  // A small helper to check if there's any existing partner doc from server.
  // If so, we might want to disable the "SOP" option:
  const partnerDocsAlreadyExist = hasAnyPartnerDoc(careCenter);

  // 9) Render the form
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* 9a) The SOP/NOP selector */}
      <div className="mb-4">
        <label
          htmlFor="ownerPartnerStatus"
          className="block text-sm font-medium text-gray-700"
        >
          Select one
        </label>
        <Controller
          name="ownerPartnerStatus"
          control={control}
          render={({ field }) => (
            <select
              id="ownerPartnerStatus"
              className="px-4 py-2 w-full rounded-sm border"
              {...field}
            >
              {/* If partner docs already exist, disable "SOP" so user must keep NOP */}
              <option value="SOP" disabled={!!partnerDocsAlreadyExist}>
                Shop owner &amp; partner is same
              </option>
              <option value="NOP">Shop owner is not the partner</option>
            </select>
          )}
        />
      </div>

      {/* 9b) Partner Documents (show only if ownerPartnerStatus === 'NOP') */}
      {watchOwnerPartnerStatus === 'NOP' && (
        <>
          <h3 className="text-lg font-semibold text-teal-500">
            Partner Document Uploads
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Aadhaar Card */}
            <div>
              <label htmlFor="aadhaarCard" className="block text-sm font-medium text-gray-700">
                Aadhaar Card
              </label>
              <div className="relative w-[200px] h-[200px] border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
                <Controller
                  name="aadhaarCard"
                  control={control}
                  render={({ field }) => (
                    <input
                      id="aadhaarCard"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, field.onChange)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  )}
                />
                {filePreviews['aadhaarCard'] ? (
                  <img
                    src={filePreviews['aadhaarCard'] as string}
                    alt="Aadhaar Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">
                    No photo selected
                  </div>
                )}
              </div>
              {errors.aadhaarCard && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.aadhaarCard.message as string}
                </p>
              )}
            </div>

            {/* Photo */}
            <div>
              <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                Photo
              </label>
              <div className="relative w-[200px] h-[200px] border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
                <Controller
                  name="photo"
                  control={control}
                  render={({ field }) => (
                    <input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, field.onChange)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  )}
                />
                {filePreviews['photo'] ? (
                  <img
                    src={filePreviews['photo'] as string}
                    alt="Photo Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">
                    No photo selected
                  </div>
                )}
              </div>
              {errors.photo && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.photo.message as string}
                </p>
              )}
            </div>

            {/* Photo with Shop */}
            <div>
              <label htmlFor="photoWithShop" className="block text-sm font-medium text-gray-700">
                Photo with Shop
              </label>
              <div className="relative w-[200px] h-[200px] border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
                <Controller
                  name="photoWithShop"
                  control={control}
                  render={({ field }) => (
                    <input
                      id="photoWithShop"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, field.onChange)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  )}
                />
                {filePreviews['photoWithShop'] ? (
                  <img
                    src={filePreviews['photoWithShop'] as string}
                    alt="Photo with Shop Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">
                    No photo selected
                  </div>
                )}
              </div>
              {errors.photoWithShop && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.photoWithShop.message as string}
                </p>
              )}
            </div>

            {/* Cancelled Cheque or Passbook */}
            <div>
              <label
                htmlFor="cancelledChequeOrPassbook"
                className="block text-sm font-medium text-gray-700"
              >
                Cancelled Cheque or Passbook
              </label>
              <div className="relative w-[200px] h-[200px] border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
                <Controller
                  name="cancelledChequeOrPassbook"
                  control={control}
                  render={({ field }) => (
                    <input
                      id="cancelledChequeOrPassbook"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, field.onChange)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  )}
                />
                {filePreviews['cancelledChequeOrPassbook'] ? (
                  <img
                    src={filePreviews['cancelledChequeOrPassbook'] as string}
                    alt="Cancelled Cheque or Passbook Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">
                    No photo selected
                  </div>
                )}
              </div>
              {errors.cancelledChequeOrPassbook && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.cancelledChequeOrPassbook.message as string}
                </p>
              )}
            </div>

            {/* QR Code of Bank */}
            <div>
              <label htmlFor="qrCodeOfBank" className="block text-sm font-medium text-gray-700">
                QR Code of Bank
              </label>
              <div className="relative w-[200px] h-[200px] border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
                <Controller
                  name="qrCodeOfBank"
                  control={control}
                  render={({ field }) => (
                    <input
                      id="qrCodeOfBank"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, field.onChange)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  )}
                />
                {filePreviews['qrCodeOfBank'] ? (
                  <img
                    src={filePreviews['qrCodeOfBank'] as string}
                    alt="QR Code of Bank Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">
                    No photo selected
                  </div>
                )}
              </div>
              {errors.qrCodeOfBank && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.qrCodeOfBank.message as string}
                </p>
              )}
            </div>
          </div>
          <div className="w-full h-px bg-gray-300 my-4"></div>
        </>
      )}

      {/* 9c) Owner Documents */}
      <h3 className="text-lg font-semibold text-teal-500 mt-8">
        Owner Document Uploads
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Shop Photos */}
        <div>
          <label htmlFor="ownerShopPhotos" className="block text-sm font-medium text-gray-700">
            Shop Photos
          </label>
          <div className="relative w-[200px] h-[200px] border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
            <Controller
              name="ownerShopPhotos"
              control={control}
              render={({ field }) => (
                <input
                  id="ownerShopPhotos"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, field.onChange)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              )}
            />
            {filePreviews['ownerShopPhotos'] ? (
              <img
                src={filePreviews['ownerShopPhotos'] as string}
                alt="Shop Photos Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">
                No photo selected
              </div>
            )}
          </div>
          {errors.ownerShopPhotos && (
            <p className="text-red-500 text-sm mt-1">
              {errors.ownerShopPhotos.message as string}
            </p>
          )}
        </div>

        {/* Registration Certificate */}
        <div>
          <label
            htmlFor="ownerRegistrationCertificate"
            className="block text-sm font-medium text-gray-700"
          >
            Registration Certificate
          </label>
          <div className="relative w-[200px] h-[200px] border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
            <Controller
              name="ownerRegistrationCertificate"
              control={control}
              render={({ field }) => (
                <input
                  id="ownerRegistrationCertificate"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, field.onChange)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              )}
            />
            {filePreviews['ownerRegistrationCertificate'] ? (
              <img
                src={filePreviews['ownerRegistrationCertificate'] as string}
                alt="Registration Certificate Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">
                No photo selected
              </div>
            )}
          </div>
          {errors.ownerRegistrationCertificate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.ownerRegistrationCertificate.message as string}
            </p>
          )}
        </div>

        {/* Aadhaar Card */}
        <div>
          <label htmlFor="ownerAadhaarCard" className="block text-sm font-medium text-gray-700">
            Aadhaar Card
          </label>
          <div className="relative w-[200px] h-[200px] border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
            <Controller
              name="ownerAadhaarCard"
              control={control}
              render={({ field }) => (
                <input
                  id="ownerAadhaarCard"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, field.onChange)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              )}
            />
            {filePreviews['ownerAadhaarCard'] ? (
              <img
                src={filePreviews['ownerAadhaarCard'] as string}
                alt="Aadhaar Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">
                No photo selected
              </div>
            )}
          </div>
          {errors.ownerAadhaarCard && (
            <p className="text-red-500 text-sm mt-1">
              {errors.ownerAadhaarCard.message as string}
            </p>
          )}
        </div>

        {/* Photo */}
        <div>
          <label htmlFor="ownerPhoto" className="block text-sm font-medium text-gray-700">
            Photo
          </label>
          <div className="relative w-[200px] h-[200px] border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
            <Controller
              name="ownerPhoto"
              control={control}
              render={({ field }) => (
                <input
                  id="ownerPhoto"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, field.onChange)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              )}
            />
            {filePreviews['ownerPhoto'] ? (
              <img
                src={filePreviews['ownerPhoto'] as string}
                alt="Owner Photo Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">
                No photo selected
              </div>
            )}
          </div>
          {errors.ownerPhoto && (
            <p className="text-red-500 text-sm mt-1">{errors.ownerPhoto.message as string}</p>
          )}
        </div>

        {/* Photo with Shop */}
        <div>
          <label htmlFor="ownerPhotoWithShop" className="block text-sm font-medium text-gray-700">
            Photo with Shop
          </label>
          <div className="relative w-[200px] h-[200px] border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
            <Controller
              name="ownerPhotoWithShop"
              control={control}
              render={({ field }) => (
                <input
                  id="ownerPhotoWithShop"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, field.onChange)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              )}
            />
            {filePreviews['ownerPhotoWithShop'] ? (
              <img
                src={filePreviews['ownerPhotoWithShop'] as string}
                alt="Owner Photo with Shop Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">
                No photo selected
              </div>
            )}
          </div>
          {errors.ownerPhotoWithShop && (
            <p className="text-red-500 text-sm mt-1">
              {errors.ownerPhotoWithShop.message as string}
            </p>
          )}
        </div>

        {/* Signature */}
        <div>
          <label htmlFor="ownerSignature" className="block text-sm font-medium text-gray-700">
            Signature
          </label>
          <div className="relative w-[200px] h-[200px] border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
            <Controller
              name="ownerSignature"
              control={control}
              render={({ field }) => (
                <input
                  id="ownerSignature"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, field.onChange)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              )}
            />
            {filePreviews['ownerSignature'] ? (
              <img
                src={filePreviews['ownerSignature'] as string}
                alt="Signature Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">
                No photo selected
              </div>
            )}
          </div>
          {errors.ownerSignature && (
            <p className="text-red-500 text-sm mt-1">
              {errors.ownerSignature.message as string}
            </p>
          )}
        </div>
      </div>

      {/* 9d) Submit Button */}
      <div className="flex justify-center mt-8">
        <button
          type="submit"
          className="bg-teal-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-teal-600"
        >
          Update CareCenter
        </button>
      </div>
    </form>
  );
};

export default DocUpdateCareCenter;
