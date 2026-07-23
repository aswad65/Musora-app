import multer, { memoryStorage } from "multer";

const storage=memoryStorage();

const uploadFile=multer({storage}).fields([
    {name:"audio",maxCount:1},
    {name:"bgPic",maxCount:1}
]);

export default uploadFile;


