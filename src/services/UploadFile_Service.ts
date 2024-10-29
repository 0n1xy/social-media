import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { Buffer } from "buffer";
import { v4 as uuidv4 } from "uuid";

class UploadFileService {
  private s3: S3Client;

  constructor() {
    if (!process.env.AWS_BUCKET_NAME) {
      throw new Error("AWS_BUCKET_NAME is not defined");
    }

    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      endpoint: `https://s3.${process.env.AWS_REGION}.amazonaws.com`,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  // Extend file type validation to include videos
  private getFileExtension(mimeType: string): string {
    switch (mimeType) {
      case "image/jpeg":
        return "jpg";
      case "image/png":
        return "png";
      case "image/gif":
        return "gif";
      case "video/mp4":
        return "mp4";
      case "video/avi":
        return "avi";
      case "video/mkv":
        return "mkv";
      default:
        return "bin"; // default case for unknown types
    }
  }

  private async uploadSingleFile(file: string): Promise<string> {
    // Validate base64 format and MIME type for both image and video
    if (
      typeof file !== "string" ||
      !(file.startsWith("data:image/") || file.startsWith("data:video/"))
    ) {
      throw new Error(
        "Invalid file format. Must be base64 encoded image or video."
      );
    }

    const mimeType = file.match(/data:([^;]+);/)?.[1];
    if (!mimeType) {
      throw new Error("MIME type not found.");
    }

    const fileExtension = this.getFileExtension(mimeType);
    const buffer = Buffer.from(file.split(",")[1], "base64");
    const fileName = `${uuidv4()}.${fileExtension}`; // Unique file name using UUID and extracted file extension

    const uploadParams = {
      Bucket: String(process.env.AWS_BUCKET_NAME),
      Key: fileName,
      Body: buffer,
      ContentType: mimeType,
    };

    await this.s3.send(new PutObjectCommand(uploadParams));

    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  }

  public async uploadFiles(files: string | string[]): Promise<string[]> {
    const fileArray = Array.isArray(files) ? files : [files];
    const mediaUrls: string[] = [];

    for (const file of fileArray) {
      const mediaUrl = await this.uploadSingleFile(file);
      mediaUrls.push(mediaUrl);
    }

    return mediaUrls;
  }

  public async deleteMedia(mediaUrl: string): Promise<void> {
    try {
      const mediaKey = new URL(mediaUrl).pathname.substring(1);

      const deleteParams = {
        Bucket: String(process.env.AWS_BUCKET_NAME),
        Key: mediaKey,
      };

      const deleteResult = await this.s3.send(
        new DeleteObjectCommand(deleteParams)
      );
      console.log("Delete result:", deleteResult);
    } catch (error) {
      console.error("Error deleting media:", error);
      throw new Error(
        "Failed to delete media from S3: " + (error as Error).message
      );
    }
  }
}

export default UploadFileService;
