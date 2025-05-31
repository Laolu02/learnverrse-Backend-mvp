import AsyncHandler from '../middlewares/asyncHandler.js';
import CourseModel from '../model/course.model.js';
import { BadRequestException } from '../utils/appError.js';
import { HTTPSTATUS } from '../configs/http.config.js';
import { updateCourseService } from '../services/update.course.service.js';
import { deleteCourseService } from '../services/delete.course.service.js';
import { createCourseService } from '../services/create.course.service.js';
import { getAllCoursesService } from '../services/getAllCourses.course.service.js';
import { getUploadVideoUrlService } from '../services/get-video-upload-url.course.service.js';

/**
 * @desc    View all courses on platform with filtering options
 * @route   GET /api/educator/courses
 */
export const viewAllCourses = AsyncHandler(async (req, res) => {
  const { courses, limitNum, hasPrevPage, hasNextPage, pageNum, totalCourses } =
    await getAllCoursesService(req);
  // Return response
  res.status(HTTPSTATUS.OK).json({
    success: true,
    count: courses.length,
    totalCourses,
    pagination: {
      currentPage: pageNum,
      totalPages,
      hasNextPage,
      hasPrevPage,
      limit: limitNum,
    },
    data: courses,
  });
});

/**
 * @desc    Create a new course
 * @route   POST /api/educator/courses
 */
export const createCourse = AsyncHandler(async (req, res) => {
  const { educatorId, educatorName } = req.body;

  if (!educatorId || !educatorName) {
    throw new BadRequestException(
      'Please provide all required fields (educatorId, educatorName)'
    );
  }

  const newCourse = createCourseService(educatorId, educatorName);

  // Return response
  res.status(HTTPSTATUS.CREATED).json({
    success: true,
    message: 'Course created successfully',
    data: newCourse,
  });
});

/**
 * @desc    Update an existing course
 * @route   PUT /api/educator/courses/:courseId
 */
export const updateCourse = AsyncHandler(async (req, res) => {
  const courseId = req.params.courseId;
  const userId = req.user;
  const body = req.body;

  const updatedCourse = await updateCourseService(courseId, userId, body);

  res.status(HTTPSTATUS.OK).json({
    success: true,
    message: 'Course updated successfully',
    data: updatedCourse,
  });
});

/**
 * @desc    Delete a course
 * @route   DELETE /api/educator/courses/:courseId
 */
export const deleteCourse = AsyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const educatorId = req.user;

  await deleteCourseService(courseId, educatorId);

  res.status(HTTPSTATUS.OK).json({
    success: true,
    message: 'Course deleted successfully',
  });
});

/**
 * @desc    get video upload url
 * @route   POST /:courseId/sections/:sectionId/chapters/:chapterId/get-upload-url
 */
export const getUploadVideoUrl = AsyncHandler(async (req, res) => {
  const { fileName, fileType } = req.body;

  if (!fileName || !fileType) {
    throw new BadRequestException('File name and type are required');
  }
  const { uploadUrl, videoUrl } = await getUploadVideoUrlService(
    fileName,
    fileType
  );

  res.status(HTTPSTATUS.CREATED).json({
    success: true,
    message: 'Upload URL generated successfully',
    data: { uploadUrl, videoUrl },
  });
});
