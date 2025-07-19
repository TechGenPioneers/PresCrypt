import axiosInstance from "../utils/axiosInstance";

const baseUrl = "https://localhost:7021/api/Doctor";

const DoctorProfileImageService = {
  uploadImage: async (doctorId, imageFile) => {
    const formData = new FormData();
    formData.append("doctorId", doctorId);
    formData.append("image", imageFile);

    try {
      const response = await axiosInstance.post(`${baseUrl}/upload-image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.imageUrl; // contains base64 or path depending on what backend returns
    } catch (error) {
      console.error("Image upload failed", error);
      throw error;
    }
  },
};

export default DoctorProfileImageService;
