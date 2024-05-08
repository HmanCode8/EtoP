import request from "@/untils/request";

interface Wallpaper {
  page: number;
  pageSize: number;
  photoVal?: string;
  imgType?: string;
  category?: string;
}
/**
 * 获取壁纸分类
 * @param params
 * @returns
 */
const getWallpaperCategory = () => {
  return request.get("/api/wallpapercategory");
};

/**
 * 入库更新壁纸分类
 * @param params
 * @returns
 */
const insertwallpapercategory = () => {
  return request.post("/api/insertwallpapercategory");
};
/**
 * 获取壁纸列表
 * @param params
 * @returns
 */
const getWallpaper = (params: Wallpaper) => {
  return request.post("/api/wallpaper", params);
};
/**
 * 获取壁纸列表
 * @param params
 * @returns
 */
const getRandomLoginImg = () => {
  return request.get("/api/randomLoginImg");
};

export { getWallpaperCategory, insertwallpapercategory, getWallpaper,getRandomLoginImg };
