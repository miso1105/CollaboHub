const { asyncHandler } = require('../lib/utils/express/asyncHandler');
const { uploadSingle, uploadMany } = require('../services/uploadService');

// 이미지 1장 컨트롤러
exports.uploadImage = asyncHandler(async (req, res, next) => {
    console.log('이미지 컨트롤러 요청으로 들어온 req.file', req.file);
    const { buffer, originalname, mimetype } = req.file;
    const result = await uploadSingle(buffer, originalname, mimetype);
    res.status(200).json({
        originalKey: result.originalKey,
        resizedKey: result.resizedKey
    });
});

// 이미지 5장 컨트롤러
exports.uploadImages = asyncHandler(async (req, res, next) => {
    console.log('이미지 컨트롤러 요청으로 들어온 이미지 여러 장 req.files', req.files);
    const results = await uploadMany(req.files);
    const bucketUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com`;
    const urls = results.map(url => `${bucketUrl}/${url.resizedKey}`);
    res.status(200).json(urls); 
});