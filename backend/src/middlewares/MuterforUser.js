import multer, { memoryStorage } from "multer";

const storage=memoryStorage();

const uploadUserPicture=multer({storage}).single("file");

export default uploadUserPicture;