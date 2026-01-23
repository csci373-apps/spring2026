import courseConfig from '../../content/config/course.json';
import navConfig from '../../content/config/nav.json';

export interface CourseConfig {
  courseNumber: string;
  courseName: string;
  semester: string;
  year: number;
  title: string;
  description: string;
}

export interface NavItem {
  href: string;
  label: string;
  external?: boolean;
}

export function getCourseConfig(): CourseConfig {
  return courseConfig as CourseConfig;
}

export function getNavConfig(): NavItem[] {
  return navConfig as NavItem[];
}
