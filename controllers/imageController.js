const asyncHandler = require("../middlewares/asyncHandler");
const multer = require("multer")
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
const ErrorResponse = require("../utils/errorResponse");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `public/images/${req.query.folder}`);
    },
    filename: (req, file, cb) => {
        if (req?.query?.name !== undefined)
            cb(null, req?.query?.name + path.extname(file.originalname));
        else
            cb(null, file.originalname);
    },
});


const upload = multer({
    storage: storage
}).single("image")

const saveImage = asyncHandler((req, res, next) => {
    upload(req, res, async (err) => {
        if (err) {
            console.log(err);
            return next(new ErrorResponse(err.message, 500));
        }
        try {
            const inputFilePath = path.join(req.file.path);
            const folderName = req?.query?.folder;
            const baseFileName = path.basename(inputFilePath, path.extname(inputFilePath));
            const outputFilePath = path.join('public', 'images', folderName, baseFileName + '.jpg');
            await sharp(inputFilePath)
                .jpeg({ quality: 80 })
                .toFile(outputFilePath);
            fs.unlink(inputFilePath, (err) => {
                if (err) {
                    console.error(err);
                }
            });
            const data = {
                success: true,
                data: {
                    url: `/public/images/${folderName}/${baseFileName}.jpg`,
                },
            };
            res.status(200).send(data);
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal server error!');
        }
    });
});

const deleteImage = asyncHandler((req, res, next) => {
    const folderName = req?.query?.folder;
    const receivedFileName = req?.query?.name;
    const fileName = path.basename(receivedFileName, path.extname(receivedFileName));
    const filePath = path.join('public', 'images', folderName, fileName + '.jpg');
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse("Cannot Delete Image", 500));
        } else {
            const data = {
                success: true,
                data: {
                    message: "File Deleted Successfully",
                },
            };
            res.status(200).send(data);
        }
    });

});

module.exports = { saveImage, deleteImage };
