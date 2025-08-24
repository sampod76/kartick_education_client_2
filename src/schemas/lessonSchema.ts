import * as yup from 'yup';

const LessonSchema = yup.object().shape({
  title: yup.string().required(),
  img: yup.string(),
  video: yup.string(),
  status: yup.string<'active' | 'deactivate' | 'save' | 'disable' | 'block'>().optional(),
  milestones: yup.string(),
  details: yup.string().optional(),
  short_description: yup.string().optional(),
  author: yup.string().optional(),
  module: yup.string().optional(),
  lesson_number: yup.number().optional(),
  lecture: yup.number().optional(),
  demo_video: yup.object().shape({
    video: yup.string(),
    platformat: yup.string(),
  }),
});

export { LessonSchema };

import { IFileAfterUpload } from '@/types/globalType';

interface IFile {
  url: string;
  mimetype: string;
  filename: string;
  path: string;
  cdn: string;
  platform: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IModule {
  _id: string;
  title: string;
  imgs: any[]; // You may want to define a more specific type for images
  author: string;
  course: string;
  category: string;
  milestone: string;
  status: 'active' | 'inActive' | 'pending';
  isDelete: 'yes' | 'no';
  module_number: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface ILesson {
  _id: string;
  title: string;
  author: string;
  category: string;
  course: string;
  milestone: string;
  module: IModule;
  status: 'active' | 'inActive' | 'pending';
  isDelete: 'yes' | 'no';
  lesson_number: number;
  price_type: 'paid' | 'free'; // Assuming this is an enum
  videos: any[]; // You may want to define a more specific type for videos
  files: IFileAfterUpload[];
  tags: string[];
  imgs: any[]; // You may want to define a more specific type for images
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
