import { firestore } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";

export const updateUser = async (
  uid: string,
  updatedData: UserDataType
): Promise<ResponseType> => {
  try {
    // Kiểm tra xem có ảnh và ảnh có uri hợp lệ không
    if (updatedData.image?.uri) {
      // Upload ảnh lên Cloudinary
      const imagesUploadRes = await uploadFileToCloudinary(updatedData.image, "users");

      // Kiểm tra kết quả upload
      if (!imagesUploadRes.success) {
        return {
          success: false,
          msg: imagesUploadRes.msg || "Failed To Upload Image",
        };
      }

      // Cập nhật lại dữ liệu ảnh bằng link ảnh từ Cloudinary
      updatedData.image = imagesUploadRes.data;
    } else {
      // Nếu không có ảnh hợp lệ, xóa trường image khỏi dữ liệu
      delete updatedData.image;
    }

    // Cập nhật thông tin người dùng trên Firestore
    const userRef = doc(firestore, "users", uid);
    await updateDoc(userRef, updatedData);

    return { success: true, msg: "Cập nhật thành công" };
  } catch (error: any) {
    // Log lỗi để dễ dàng kiểm tra
    console.error("error updating user: ", error);

    // Trả về thông báo lỗi chi tiết
    return { success: false, msg: error?.message || "Đã xảy ra lỗi khi cập nhật" };
  }
};
