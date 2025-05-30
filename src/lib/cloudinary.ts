import { Cloudinary } from '@cloudinary/url-gen';

// Cloudinary configuration constants
const CLOUDINARY_CLOUD_NAME = "diuvt6wty";
const CLOUDINARY_UPLOAD_PRESET = "thesis_upload";
const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

// Initialize Cloudinary instance
export const cld = new Cloudinary({
  cloud: {
    cloudName: CLOUDINARY_CLOUD_NAME,
  },
});

// Function to upload file to Cloudinary
export const uploadToCloudinary = async (file: File, folder: string = "default") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", folder);
  formData.append("asset_folder", "thesis_upload");

  try {
    const response = await fetch(CLOUDINARY_API_URL, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
}; 