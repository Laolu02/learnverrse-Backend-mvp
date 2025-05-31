import { Router } from "express";
import { query_by_featured, query_by_category,get_A_course,get_course_query } from "../controllers/course-query";

export const router = Router()
    .get("/courses/featured",query_by_featured)
    .get("/courses", get_course_query)
    .get("/courses/:courseId", get_A_course)
    .get("/courses/category", query_by_category)