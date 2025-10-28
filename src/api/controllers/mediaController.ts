import MinioService from "../services/minioService.ts";

type uploadFiles = {
    [fieldname: string]: Express.Multer.File[] | undefined;
}
class Mediacontroller{
    minIoService : MinioService;
     constructor (){
        this.minIoService = new MinioService();
     }
     public  async uploadImages(files : uploadFiles){
        for (let image in files){
            if (!files[image] || !files[image][0]){
                return { error : "if (files[image] && files[image][0])"}
            }
            let fileName = new Date().toISOString();
            await this.minIoService.saveFile(files[image][0], fileName);
        }}
    public  async fetchImages(){
        return await this.minIoService.getFile("2025-10-27T22:02:21.998Z");
    }
}
export default Mediacontroller