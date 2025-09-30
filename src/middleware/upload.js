import multer from "multer";
import path from "path";
import fs from "fs";
const uploadDir=path.join(process.cwd(),"/src/upload");
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
      if(!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir);
      }
      cb(null,uploadDir);
    },
    filename:(req,file,cb)=>{
        const timestamp=Date.now();
        const ext=path.extname(file.originalname);
        cb(null,`${timestamp}${ext}`);
    }
});

const fileFilter=async(req,file,cb)=>{
    const allowType = /jpg|png|jpeg|gif/;
    const mimeType=allowType.test(file.originalname);
    if(!mimeType){
        cb(Error("Only Images file allowed"),false);
    }
    cb(null,true);
};

const upload=multer({storage:storage,fileFilter,limits:50*1024*1024});
export default upload;