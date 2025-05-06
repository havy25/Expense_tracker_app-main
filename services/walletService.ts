import { WalletType } from "@/types";
import { uploadFileToCloudinary } from "./imageService";
import { firestore } from "@/config/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";

export const createOrUpdateWallet = async (
  walletData: Partial<WalletType>
): Promise<ResponseType> => {
  try {
    let walletToSave = { ...walletData };

    if (walletData.image) {
      // Upload ảnh lên Cloudinary
      const imagesUploadRes = await uploadFileToCloudinary(
        walletData.image,
        "wallet"
      );

      // Kiểm tra kết quả upload
      if (!imagesUploadRes.success) {
        return {
          success: false,
          msg: imagesUploadRes.msg || "Failed To Upload wallet icon",
        };
      }

      // Cập nhật lại dữ liệu ảnh bằng link ảnh từ Cloudinary
      walletToSave.image = imagesUploadRes.data;
    } else {
      // Nếu không có ảnh hợp lệ, xóa trường image khỏi dữ liệu
      delete walletData.image;
    }

    if (!walletData?.id) {
      //new wallet
      walletToSave.amount = 0;
      walletToSave.totalIncome = 0;
      walletToSave.totalExpenses = 0;
      walletToSave.created = new Date();
    }

    const walletRef = walletData?.id
      ? doc(firestore, "wallets", walletData?.id)
      : doc(collection(firestore, "wallets"));

    await setDoc(walletRef, walletToSave, { merge: true }); //updates only the data provided
    return { success: true, data: { ...walletToSave, id: walletRef.id } };
  } catch (error: any) {
    console.log("error creating or updating wallet: ", error);
    return { success: false, msg: error.message };
  }
};

export const deleteWallet = async (walletId: string): Promise<ResponseType> => {
  try {
    const walletRef = doc(firestore, "wallets", walletId);
    await deleteDoc(walletRef);
    deleteTransactionsByWalletId(walletId);
    return { success: true, msg: "Wallet deleted successfully" };
  } catch (err: any) {
    console.log("error deleting wallet: ", err);
    return { success: false, msg: err.message };
  }
};
export const deleteTransactionsByWalletId = async (
  walletId: string
): Promise<ResponseType> => {
  try {
    let hasMoreTransactions = true;

    while (hasMoreTransactions) {
      const transactionsQuery = query(
        collection(firestore, "transactions"),
        where("walletId", "==", walletId)
      );

      const transactionsSnapshot = await getDocs(transactionsQuery);

      if (transactionsSnapshot.size == 0) {
        hasMoreTransactions = false;
        break;
      }
      const batch = writeBatch(firestore);

      transactionsSnapshot.forEach((transactionDoc) => {
        batch.delete(transactionDoc.ref);
      });

      await batch.commit();
    }
    return {
      success: true,
      msg: "All transactions deleted successfully",
    };

    return { success: true, msg: "Wallet deleted successfully" };
  } catch (err: any) {
    console.log("error deleting wallet: ", err);

    return { success: false, msg: err.message };
  }
};
