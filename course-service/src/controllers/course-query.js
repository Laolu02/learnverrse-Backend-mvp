import AsyncHandler from "../../../auth-service/src/middlewares/asyncHandler";
import { HTTPSTATUS } from "../../../auth-service/src/configs/http.config";
import CourseModel from "../model/course.model";
import logger from "../../../auth-service/src/utils/logger";

export const get_course_query = AsyncHandler(async (req, res) => {
  const {search, category, page=1, limit= 20} = req.query; 
  
  try{
    const currentPage = parseInt(page, 10) || 1;
    const itemsPerPage = parseInt(limit, 10) || 10;
    const skip = parseInt((currentPage - 1) * itemsPerPage, 10);
    
    if (category) {
        filters.category= category;
    }
    if (!search) {
        return res.status(HTTPSTATUS.NO_CONTENT)
    } 
    const searched = search.split('')
    const querySearch ={
        $or: searched.map(eachword =>({
            content:{regex: search, $options: 'i'}
        }))
    };
    const result = await Promise.all([
        CourseModel.find(querySearch || category)
        .skip(skip)
        .limit(itemsPerPage)
    ])
    return res.status(HTTPSTATUS.OK).json({
        success: true,
        metadata: {page: currentPage, limit: itemsPerPage,},
        data: courses
    });
    } catch (error){
        logger.error(HTTPSTATUS.INTERNAL_SERVER_ERROR)
        throw error;
        }
    }
);

export const query_by_category = AsyncHandler(async (req,res) => {
    const {category} = req.params;
    try {
        const courses = await CourseModel.findById(category)
        return res.status(HTTPSTATUS.OK).json(courses) 
    } catch (error) {
        logger.error(HTTPSTATUS.INTERNAL_SERVER_ERROR)
        throw error;
    };   
}
);

export const get_A_course = AsyncHandler(async (req,res) => {
    const {courseid} = req.params;
    try {
        const course = await CourseModel.findById(courseid)
        if (!course) {
            return res.status(HTTPSTATUS.NOT_FOUND)
        } res.status(HTTPSTATUS.OK).json({
           "id": course.id,
           "title": course.title,
           "sections": course.sections.select('-sectionDescription'),
        })
    } catch (error) {
        logger.error(HTTPSTATUS.INTERNAL_SERVER_ERROR)
        throw error;
    }
}
);

export const query_by_featured = AsyncHandler(async (req,res) => {
    const {isFeatured} = req.params;
    try {
        const courses = await CourseModel.findById(isFeatured)
        return res.status(HTTPSTATUS.OK).json({
            "id": courses.id,
           "title": courses.title,
           "price":courses.price,
           "category":courses.category,
           "isFeatured": courses.isFeatured,
        }) 
    } catch (error) {
        logger.error(HTTPSTATUS.INTERNAL_SERVER_ERROR)
        throw error;
    };   
}
);