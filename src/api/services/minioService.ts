/// <reference types="multer" />
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
class MinioService{
  
    endpoint : string;
    accessKey : string;
    password : string;
    bucketName : string;
    s3Client : S3Client;

    constructor(){

        if (!process.env.MIN_IO_ENDPOINT || !process.env.MIN_IO_ACCESS_KEY ||  !process.env.MIN_IO_PASSWORD || !process.env.BUCKET_NAME) {
            throw new Error("MIN_IO environment variables are missing");
        }
        this.endpoint = process.env.MIN_IO_ENDPOINT;
        this.accessKey = process.env.MIN_IO_ACCESS_KEY;
        this.password = process.env.MIN_IO_PASSWORD;
        this.bucketName = process.env.BUCKET_NAME;
        this.s3Client = new S3Client({
            region: "us-east-1",
            endpoint: this.endpoint,
            forcePathStyle: true,
            credentials: {
                accessKeyId: this.accessKey,
                secretAccessKey: this.password,
            }}
        )
    }
    public async saveFile(file : Express.Multer.File | null, fileName : string){
        if(!file){
            return {error : "no file provided for MinioService function : savefile"};
        }
        const body = file.buffer
        const fileType = file.mimetype
   
        const PutObjectCommandInput= {
            Bucket : this.bucketName,
            Key : fileName,
            Body : body,
            ContentType : fileType
        }

        const putObjectCommand = new PutObjectCommand(PutObjectCommandInput);
        return await this.s3Client.send(putObjectCommand);
    }
    public async getFile(fileName : string){
        const getObjectCommandInput= {
            Bucket : this.bucketName,
            Key : fileName
        }
        const getObjectCommand = new GetObjectCommand(getObjectCommandInput);
        const url = await getSignedUrl(this.s3Client, getObjectCommand);
        return (url);
    }
}
export default MinioService;