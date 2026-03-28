import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(base64: string): Promise<{ url: string; publicId: string }> {
  const result = await cloudinary.uploader.upload(base64, {
    folder: "wastex-ai",
    resource_type: "image",
  });
  return { url: result.secure_url, publicId: result.public_id };
}

export { cloudinary };
