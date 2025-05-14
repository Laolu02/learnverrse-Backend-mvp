import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema(
  {
    courseId: {
      type: String,
      required: true,
      trim: true,
    },
    sectionTitle: {
      type: String,
      required: true,
      trim: true,
    },
    sectionDescription: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const SectionModel = mongoose.model('Section', sectionSchema);
export default SectionModel;
