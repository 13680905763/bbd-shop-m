import { request } from "./request";

export const messageApi = {
    /** 获取消息列表 */
    listMessage(params: any): Promise<any> {
        return request.get(`/system-notice/list`, { params });
    },
    /** 已读消息 */
    readMessage(id: string): Promise<any> {
        return request.put("/system-notice/" + id);
    },
    /** 批量删除消息 */
    deleteMessage(ids: number[]): Promise<any> {
        return request.delete("/system-notice/batch", {
            data: ids,
        });
    },
};
