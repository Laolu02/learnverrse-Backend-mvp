import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import CourseModel from './model/course.model.js';
import { CourseLevelEnum } from './enums/course-level.enum.js';
import { CourseStatusEnums } from './enums/course-status.enum.js';
import { CourseSubscriptionEnum } from './enums/course-subscription.enum.js';
import { nanoid } from 'nanoid';

const seedCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    // Clear existing courses
    await CourseModel.deleteMany();

    const courseData = Array.from({ length: 15 }).map((_, index) => ({
      educatorId: nanoid(),
      educatorName: `Educator ${index + 1}`,
      title: `Course Title ${index + 1}`,
      description: `This is a sample description for course ${index + 1}`,
      category: 'Programming',
      price: Math.floor(Math.random() * 100) + 10,
      image: `https://picsum.photos/seed/course${index + 1}/400/300`,
      level: CourseLevelEnum.BEGINNER,
      status: CourseStatusEnums.PUBLISHED,
      subscription: CourseSubscriptionEnum.FREE,
      isApproved: true,
      isFeatured: index % 3 === 0,
      sections: [
        {
          sectionId: nanoid(),
          sectionTitle: 'Getting Started',
          sectionDescription: 'Introductory section',
          chapters: [
            {
              chapterId: nanoid(),
              type: 'Text',
              title: 'Introduction',
              content: 'Welcome to this course!',
            },
            {
              chapterId: nanoid(),
              type: 'Video',
              title: 'Getting Started Video',
              content: 'Video content',
              video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            },
          ],
        },
      ],
    }));

    await CourseModel.insertMany(courseData);
    console.log('Courses seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding courses:', error);
    process.exit(1);
  }
};

seedCourses();
