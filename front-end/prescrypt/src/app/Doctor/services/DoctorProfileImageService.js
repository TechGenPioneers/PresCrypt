import axiosInstance from "../utils/axiosInstance";

const baseUrl = "https://localhost:7021/api/Doctor";

const DoctorProfileImageService = {
  uploadImage: async (doctorId, imageFile, onUploadProgress) => {
    const formData = new FormData();
    formData.append("DoctorId", doctorId);
    formData.append("DoctorImage", imageFile);

    try {
      const response = await axiosInstance.post(
        `${baseUrl}/upload-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (onUploadProgress) {
              onUploadProgress(progressEvent);
            }
          },
        }
      );
      return response.data.image;
    } catch (error) {
      console.error("Image upload failed", error);
      throw error;
    }
  },
};

export default DoctorProfileImageService;
