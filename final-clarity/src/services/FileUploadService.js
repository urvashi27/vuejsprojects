import axios from "axios";

class FileUploadService {
    uploadFiles(data) {
        return axios({
            url: "http://localhost:9090/clarity",
            method: "POST",
            data,
            headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
            },
        });
    }
}
export default new FileUploadService();
