import CourseModel from '../model/course.model.js';

export const createCourseService = async (educatorId, educatorName) => {
  try {
    const newCourse = new CourseModel({
      educatorId,
      educatorName: educatorName || 'Unknown Educator',
      title: 'Untitled Course',
      description: '',
      category: 'Uncategorized',
      price: 0,
      image: '',
      level: CourseLevelEnum.BEGINNER,
      subscription: CourseSubscriptionEnum.PAID,
      status: CourseStatusEnums.DRAFT,
      isApproved: false,
      isFeatured: false,
      sections: [],
    });

    await newCourse.save();

    return newCourse;
  } catch (error) {
    throw error;
  }
};
