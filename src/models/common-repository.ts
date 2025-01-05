import { ImageLibrary, PrismaClient } from "@prisma/client";

class CommonRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    createImageResource= async(image_url:string):Promise<ImageLibrary>=>{
        return this.prisma.imageLibrary.create({
            data:{
                icon_name:'generic',
                image_path:image_url
            },
          });
    }
}
const commonRepository = new CommonRepository()
export {commonRepository}
