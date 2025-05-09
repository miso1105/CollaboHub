const sharp = require('sharp');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { s3 } = require('../config/s3');
const { withTransaction } = require('../lib/utils/service/withTransaction');

// 단일 이미지 업로드 
async function uploadSingle(fileBuffer, fileName, mimeType) {
    return withTransaction(async (connection) => {
        const originalKey = `original/${Date.now()}_${fileName}`;
        const resizedKey = `resized/${Date.now()}_${fileName}`;

        // 원본 이미지 s3에 업로드
        await s3.send(new PutObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: originalKey,
            Body: fileBuffer,
            ContentType: mimeType,
        }));

        // Sharp로 원본 이미지 리사이징
        const resizedBuffer = await sharp(fileBuffer) 
            .toFormat('jpeg')
            .resize({ width: 200 })
            .withMetadata({ exif: false })
            .jpeg({ quality: 80 })
            .toBuffer();

          // 리사이징된 이미지 s3에 업로드
        await s3.send(new PutObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: resizedKey,
            Body: resizedBuffer,
            ContentType: 'image/jpeg',
        }))

        return { originalKey, resizedKey };
    });
};

// [POST] 멀티 이미지 업로드   
async function uploadMany(files) {
    return withTransaction(async (connection) => {
        return Promise.all(
            files.map(file => 
                uploadSingle(file.buffer, file.originalname, file.mimetype)
            )
        );
    });
};

module.exports = { uploadSingle, uploadMany };