import mongoose from 'mongoose';
import { CourseLevelEnum } from '../enums/course-level.enum.js';
import { CourseStatusEnums } from '../enums/course-status.enum.js';
import { CourseSubscriptionEnum } from '../enums/course-subscription.enum.js';

const courseSchema = new mongoose.Schema(
  {
    educatorId: {
      type: String,
      required: true,
      trim: true,
    },
    educatorName: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    image: {
      type: String,
    },
    level: {
      type: String,
      required: true,
      enum: Object.values(CourseLevelEnum),
    },
    status: {
      type: String,
      enum: Object.values(CourseStatusEnums),
      default: 'DRAFT',
      required: true,
    },
    subscription: {
      type: String,
      enum: Object.values(CourseSubscriptionEnum),
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps }
);

const CourseModel = mongoose.model('Course', courseSchema);
export default CourseModel;
