import AsyncHandler from '../middlewares/asyncHandler.js';
import CourseModel from '../model/course.model.js';
import { BadRequestException, NotFoundException, UnauthorizedException } from '../utils/appError.js';
import { HTTPSTATUS } from '../configs/http.config.js';
import { CourseStatusEnums } from '../enums/course-status.enum.js';
import mongoose from 'mongoose';

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

/**
 * @desc    Update an existing course
 * @route   PUT /api/educator/courses/:courseId
 */
export const updateCourse = AsyncHandler(async (req, res) => {
  const { courseId } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    throw new BadRequestException('Invalid course ID format');
  }
  
  const course = await CourseModel.findById(courseId)
    .select('educatorId status')
    .lean();
  
  if (!course) {
    throw new NotFoundException('Course not found');
  }
  
  // Check if the user is the owner of the course
  if (course.educatorId !== req.user.id) {
    throw new UnauthorizedException('You are not authorized to edit this course');
  }
  
  const {
    title,
    description,
    category,
    price,
    image,
    level,
    subscription,
    status,
    sections = []
  } = req.body;
  
  // Validate required fields
  if (title !== undefined && !title) {
    throw new BadRequestException('Title cannot be empty');
  }
  
  if (description !== undefined && !description) {
    throw new BadRequestException('Description cannot be empty');
  }
  
  if (price !== undefined && price < 0) {
    throw new BadRequestException('Price cannot be negative');
  }
  
  // Create update object with only provided fields
  const courseUpdates = {};
  
  if (title) courseUpdates.title = title;
  if (description) courseUpdates.description = description;
  if (category) courseUpdates.category = category;
  if (price !== undefined) courseUpdates.price = price;
  if (image) courseUpdates.image = image;
  if (level) courseUpdates.level = level;
  if (subscription) courseUpdates.subscription = subscription;
  if (status) {
    // Educators can only set status to DRAFT or PUBLISHED
    if (!Object.values(CourseStatusEnums).includes(status)) {
      throw new BadRequestException('Invalid course status');
    }
    courseUpdates.status = status;
  }
  
  // Handle sections updates if provided
  if (sections && sections.length > 0) {
    // Validate sections
    for (const section of sections) {
      // Ensure each section has the required fields
      if (!section.sectionId) {
        throw new BadRequestException('Each section must have a sectionId');
      }
      if (!section.sectionTitle) {
        throw new BadRequestException('Each section must have a sectionTitle');
      }
      
      // Validate chapters if provided
      if (section.chapters && section.chapters.length > 0) {
        for (const chapter of section.chapters) {
          if (!chapter.chapterId) {
            throw new BadRequestException('Each chapter must have a chapterId');
          }
          if (!chapter.title) {
            throw new BadRequestException('Each chapter must have a title');
          }
          if (!chapter.type) {
            throw new BadRequestException('Each chapter must have a type');
          }
          if (!chapter.content) {
            throw new BadRequestException('Each chapter must have content');
          }
          if (chapter.type === 'Video' && !chapter.video) {
            throw new BadRequestException('Video chapters must have a video URL');
          }
        }
      }
    }
    
    courseUpdates.sections = sections;
  }
  
  // Update the course
  const updatedCourse = await CourseModel.findByIdAndUpdate(
    courseId,
    courseUpdates,
    { new: true, runValidators: true }
  );
  
  res.status(HTTPSTATUS.OK).json({
    success: true,
    message: 'Course updated successfully',
    data: updatedCourse
  });
});

/**
 * @desc    Delete a course
 * @route   DELETE /api/educator/courses/:courseId
 */
export const deleteCourse = AsyncHandler(async (req, res) => {
  const { courseId } = req.params;
 
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    throw new BadRequestException('Invalid course ID format');
  }
 
  const course = await CourseModel.findById(courseId);
  
  if (!course) {
    throw new NotFoundException('Course not found');
  }
  
  if (course.educatorId !== req.user.id) {
    throw new UnauthorizedException('You are not authorized to delete this course');
  }
  
  await CourseModel.findByIdAndDelete(courseId);
  
  res.status(HTTPSTATUS.OK).json({
    success: true,
    message: 'Course deleted successfully',
    data: null
  });
});
