import courseConfig from '../../content/config/course.json';

export interface CourseConfig {
  courseNumber: string;
  courseName: string;
  semester: string;
  year: number;
  title: string;
  description: string;
}

export function getCourseConfig(): CourseConfig {
  return courseConfig as CourseConfig;
}
