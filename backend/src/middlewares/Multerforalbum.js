import multer, { memoryStorage } from "multer";

const storage=memoryStorage();

const uploadAlbumPicture=multer({storage}).single("albumPic");

export default uploadAlbumPicture;

