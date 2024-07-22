import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

export interface CloudinaryInterface {
  uploader: {
    upload: (path: string) => Promise<UploadApiResponse | UploadApiErrorResponse>;
    destroy: (publicId: string) => Promise<any>; // Generic response type or specific if known;
  };
}
