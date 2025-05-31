import { v4 as uuidv4 } from 'uuid';
import CourseModel from '../model/course.model.js';
import {
  BadRequestException,
  InternalServerException,
  NotFoundException,
  UnauthorizedException,
} from '../utils/appError.js';

export const updateCourseService = async (courseId, userId, body) => {
  const updateData = body;

  try {
    const course = await CourseModel.findById(courseId);
    if (!course) {
      throw new NotFoundException('Course does not exist');
    }

    if (course.educatorId !== userId) {
      throw new UnauthorizedException('Not allowed to edit selected course');
    }

    if (updateData.price) {
      const price = parseInt(updateData.price);
      if (isNaN(price)) {
        throw new BadRequestException(
          'Invalid price format, Price must  be a number'
        );
      }
      updateData.price = price * 100; // this is for test, will be changed later
    }

    if (updateData.sections) {
      const sectionsData =
        typeof updateData.sections === 'string'
          ? JSON.parse(updateData.sections)
          : updateData.sections;

      updateData.sections = sectionsData.map((section) => ({
        ...section,
        sectionId: section.sectionId || uuidv4(),
        chapters: section.chapters.map((chapter) => ({
          ...chapter,
          chapterId: chapter.chapterId || uuidv4(),
        })),
      }));
    }

    Object.assign(course, updateData);
    await course.save();

    return course;
  } catch (error) {
    throw new InternalServerException(`'Error updating course', ${error}`);
  }
};
