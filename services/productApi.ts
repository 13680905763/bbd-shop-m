import { request } from "./request";

export const productApi = {
    /** 智能搜索（链接解析、标题、关键词） */
    smartSearch: (data: any) => request.post("/product/search/convertLink", data),

    /** 关键字搜索 */
    searchByKeyword: (data: any) => request.post("/product/search/keyword", data),

    /** 图片搜索（根据已有的图片链接或ID搜索） */
    searchByImage: (data: any) => request.post("/product/search/image", data),

    /** 上传图片并搜索（识图搜索） */
    searchByUpload: (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return request.post("/product/search/upload", formData);
    },
    /** 获取商品详情 */
    getDetail: (data: any) => request.post("/product/search/id", data),
};