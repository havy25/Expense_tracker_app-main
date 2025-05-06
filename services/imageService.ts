import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_CLOUD_NAME } from "@/constants";
import { ResponseType } from "@/types";

const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Tải tệp lên Cloudinary
 * @param file - Tệp ảnh (hoặc URL ảnh đã có)
 * @param folderName - Tên thư mục trên Cloudinary
 */
export const uploadFileToCloudinary = async (
  file: { uri?: string } | string,
  folderName: string
): Promise<ResponseType> => {
  try {
    if(!file) return {success: true, data: null};
    // Nếu file là string (đã là URL), trả về luôn
    if (typeof file === "string") {
      return { success: true, data: file };
    }

    if (file && file.uri) {
      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        type: "image/jpeg",
        name: file.uri.split("/").pop() || "file.jpg",
      } as any);

      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("folder", folderName);

      console.log("Đang tải ảnh với đường dẫn:", file.uri);

      // Dùng fetch thay vì axios cho phù hợp với React Native
      const response = await fetch(CLOUDINARY_API_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message || "Tải lên thất bại");
      }

      console.log("Kết quả upload ảnh:", data);

      return { success: true, data: data.secure_url };
    }

    return { success: true };
  } catch (error: any) {
    console.log("Lỗi khi tải tệp lên Cloudinary:", error);
    return { success: false, msg: error.message || "Không thể tải tệp lên" };
  }
};

/**
 * Lấy ảnh đại diện (nếu có), nếu không thì trả về ảnh mặc định
 */
export const getProfileImage = (file: any) => {
  if (file && typeof file === "string") return file;
  if (file && typeof file === "object") return file.url;
  return require("../assets/images/defaultAvatar.png");
};
export const getFilePath = (file: any) => {
  if (file && typeof file === "string") return file;
  if (file && typeof file === "object") return file.url;
  return null;
};