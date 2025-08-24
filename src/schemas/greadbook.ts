interface IGradeBook {
  totalCompletedContentRatio?: number;
  totalCompletedNumber?: number;
  lesson: string;
  module: string;
  milestone: string;
  course: string;
  category: string;
  author: string;
  status?: 'active' | 'inActive' | 'pending'; // Assuming STATUS_ARRAY values
  isDelete?: 'yes' | 'no';
}
