import AsyncHandler from '../middlewares/asyncHandler.js';
import CourseModel from '../model/course.model.js';
import { BadRequestException, NotFoundException } from '../utils/appError.js';
import { HTTPSTATUS } from '../configs/http.config.js';
import { CourseStatusEnums } from '../enums/course-status.enum.js';

/**
 * @desc    View all courses on platform with filtering options
 * @route   GET /api/educator/courses
 */
export const viewAllCourses = AsyncHandler(async (req, res) => {
  const { category, search, ownCoursesOnly, page = 1, limit = 10 } = req.query;
  
  // Pagination & limits (open to further improvement)
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;
  
  // Build query filters
  const filters = {};
  
  // Add category filter if provided
  if (category) {
    filters.category = category;
  }
  
  // Add search filter if provided (search in title and description)
  if (search) {
    filters.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  
  // Filter by educator's own courses if requested
  if (ownCoursesOnly === 'true') {
    if (!req.user) {
      throw new BadRequestException('User authentication required to view own courses');
    }
    filters.educatorId = req.user.id;
  }

  // Get total count of documents matching the filters
  const totalCourses = await CourseModel.countDocuments(filters);
  
  // Execute the query with pagination
  const courses = await CourseModel.find(filters)
    .sort({ createdAt: -1 })
    .select('title description category price level status createdAt educatorName') 
    .skip(skip)
    .limit(limitNum)
    .lean();
  
  // Calculate pagination details
  const totalPages = Math.ceil(totalCourses / limitNum);
  const hasNextPage = pageNum < totalPages;
  const hasPrevPage = pageNum > 1;
  
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
      limit: limitNum
    },
    data: courses
  });
});

/**
 * @desc    Create a new course
 * @route   POST /api/educator/courses
 */
export const createCourse = AsyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    price,
    image,
    level,
    subscription,
    sections = []
  } = req.body;

  if (!title || !description || !price || !level || !subscription) {
    throw new BadRequestException(
      'Please provide all required fields (title, description, price, level, subscription)'
    );
  }
  if (price < 0) {
    throw new BadRequestException('Price cannot be negative');
  }  

  const newCourse = await CourseModel.create({
    educatorId: req.user.id,
    educatorName: req.user.name || 'Unknown Educator',
    title,
    description,
    category,
    price,
    image,
    level,
    subscription,
    status: CourseStatusEnums.DRAFT,
    isApproved: false,
    isFeatured: false,
    sections
  });

  // Return response
  res.status(HTTPSTATUS.CREATED).json({
    success: true,
    message: 'Course created successfully',
    data: newCourse
  });
});

