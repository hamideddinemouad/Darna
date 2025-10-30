import MinioService from "../services/minioService.ts";

type uploadFiles = {
    [fieldname: string]: Express.Multer.File[] | undefined;
}
class Mediacontroller{
    minIoService : MinioService;
     constructor (){
        this.minIoService = new MinioService();
     }
     public  async uploadImages(files : uploadFiles, fileName = ""){
        for (let image in files){
            if (!files[image] || !files[image][0]){
                return { error : "if (files[image] && files[image][0])"}
            }
            fileName = fileName || new Date().toISOString();
            await this.minIoService.saveFile(files[image][0], fileName);
        }};
    public  async fetchImages(imageNames : string[]){
        
        let urls  : string[] = [];
        for (let imageName of imageNames){
            urls.push(await this.minIoService.getFile(imageName));
        }
        return urls;
    }
}

export default Mediacontroller