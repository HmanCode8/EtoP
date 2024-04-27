export interface Category {
  cate_key: string;
  name: string;
}

export interface PixabayImage {
  collections: number;
  comments: number;
  downloads: number;
  id: number;
  imageHeight: number;
  imageSize: number;
  imageWidth: number;
  largeImageURL: string;
  likes: number;
  pageURL: string;
  previewHeight: number;
  previewURL: string;
  previewWidth: number;
  tags: string;
  type: string;
  user: string;
  userImageURL: string;
  user_id: number;
  views: number;
  webformatHeight: number;
  webformatURL: string;
  webformatWidth: number;
}

interface VideoSize {
  url: string;
  width: number;
  height: number;
  size: number;
  thumbnail: string;
}
export interface Video {
  comments: number;
  downloads: number;
  duration: number;
  id: number;
  likes: number;
  pageURL: string;
  tags: string;
  type: string;
  user: string;
  userImageURL: string;
  user_id: number;
  videos: {
    large: VideoSize;
    medium: VideoSize;
    small: VideoSize;
    tiny: VideoSize;
  };
  views: number;
}
