const asyncHandler = require("../middlewares/asyncHandler");
const multer = require("multer")

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{ 
        cb(null,'public/images')
    },
    filename:(req, file, cb)=>{
        // console.log(file);
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage: storage
}).single("image")

const saveImage = asyncHandler((req,res)=>{
    upload(req, res, (err) => {
        if(err) {
            console.log(err);
            res.status(400).send("Something went wrong!");
        }
        const data = {
            success: true,
            data:{
                url:`/public/images/${req.file.originalname}`
            }
        }
        res.status(200).send(data);
    });
})

module.exports = { saveImage };
