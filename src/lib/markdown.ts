import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';
import highlight from 'remark-highlight.js';

const postsDirectory = path.join(process.cwd(), 'content');

export interface PostData {
  id: string;
  num?: string;
  title: string;
  group?: string;
  group_order?: number;
  order?: number;
  description?: string;
  date: string;
  due_date?: string;
  content: string;
  excerpt?: string;
  type?: string;
  assigned?: string;
  readings?: string[];
  optionalReadings?: string[];
  activities?: string[];
  draft?: number;
}

export function getAllPostIds(subdirectory?: string) {
  const directory = subdirectory 
    ? path.join(postsDirectory, subdirectory)
    : postsDirectory;
    
  if (!fs.existsSync(directory)) {
    return [];
  }
  
  const fileNames = fs.readdirSync(directory);
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      return {
        params: {
          id: fileName.replace(/\.md$/, '')
        }
      };
    });
}

export async function getPostData(id: string, subdirectory?: string): Promise<PostData> {
  const directory = subdirectory 
    ? path.join(postsDirectory, subdirectory)
    : postsDirectory;
  const fullPath = path.join(directory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string with GFM support and syntax highlighting
  const processedContent = await remark()
    .use(gfm)  // Add GitHub Flavored Markdown support
    // @ts-expect-error - remark-highlight.js has type conflicts but works correctly at runtime
    .use(highlight)  // Add syntax highlighting
    .use(html, { sanitize: false })  // Allow HTML without sanitization
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    id,
    content: contentHtml,
    ...matterResult.data,
  } as PostData;
}

export function getAllPosts(subdirectory?: string): PostData[] {
  const directory = subdirectory 
    ? path.join(postsDirectory, subdirectory)
    : postsDirectory;
    
  if (!fs.existsSync(directory)) {
    return [];
  }
  
  const fileNames = fs.readdirSync(directory);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      // Remove ".md" from file name to get id
      const id = fileName.replace(/\.md$/, '');

      // Read markdown file as string
      const fullPath = path.join(directory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Combine the data with the id
      return {
        id,
        ...matterResult.data,
      } as PostData;
    });

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
} 