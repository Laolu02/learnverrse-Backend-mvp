import CourseModel from '../model/course.model.js';
import { UnauthorizedException } from '../utils/appError.js';

export const deleteCourseService = async (courseId, educatorId) => {
  try {
    const deletedCourse = CourseModel.findOneAndDelete({
      _id: courseId,
      educatorId: educatorId,
    });

    if (!deletedCourse) {
      throw new UnauthorizedException(
        'You are not authorized to delete this course or course does not exist'
      );
    }

    return true;
  } catch (error) {
    throw error;
  }
};
