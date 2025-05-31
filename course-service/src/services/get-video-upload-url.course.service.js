import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

const isMinio = process.env.STORAGE_DRIVER === 'minio'; // e.g., "minio" or "aws"

const s3 = new S3Client({
  region: 'us-east-1',
  endpoint: isMinio ? 'http://localhost:9000' : undefined,
  credentials: {
    accessKeyId: isMinio ? 'minioadmin' : process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: isMinio ? 'minioadmin' : process.env.AWS_SECRET_ACCESS_KEY,
  },
  forcePathStyle: isMinio,
});

export const getUploadVideoUrlService = async (fileName, fileType) => {
  try {
    const uniqueId = uuidv4();
    const s3Key = `videos/${uniqueId}/${fileName}`;
    const bucket = process.env.S3_BUCKET_NAME || 'learnverrse';

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: s3Key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

    const videoUrl = isMinio
      ? `http://localhost:9000/${bucket}/${s3Key}`
      : `https://${bucket}.s3.amazonaws.com/${s3Key}`;

    return { uploadUrl, videoUrl };
  } catch (error) {
    throw error;
  }
};
