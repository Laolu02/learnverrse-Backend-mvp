import mongoose from 'mongoose';
import { ChapterTypeEnum } from '../enums/chapter-type.enum.js';

const chapterSchema = new mongoose.Schema(
  {
    courseId: {
      type: String,
      required: true,
      trim: true,
    },
    sectionId: {
      type: String,
      required: true,
      trim: true,
    },
    chapterTitle: {
      type: String,
      required: true,
      trim: true,
    },
    chapterType: {
      type: String,
      enum: Object.values(ChapterTypeEnum),
      required: true,
    },
    chapterContent: {
      type: String,
    },
    video: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const ChapterModel = mongoose.model('Chapter', chapterSchema);
export default ChapterModel;
