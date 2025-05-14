import mongoose from 'mongoose';

const chapterCommentSchema = new mongoose.Schema(
  {
    chapterId: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const ChapterCommentModel = mongoose.model(
  'ChapterComment',
  chapterCommentSchema
);
export default ChapterCommentModel;
