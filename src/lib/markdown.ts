import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';
import highlight from 'remark-highlight.js';
import smartypants from 'remark-smartypants';
import { remarkImageGrid } from './remark-imagegrid';

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
  excluded?: boolean;
  notes?: string;
  toc?: boolean;
  heading_max_level?: number;
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
    .use(remarkImageGrid)  // Add custom ImageGrid tag support
    .use(smartypants, { dashes: 'oldschool' })  // Convert -- to en-dash (–) and --- to em-dash (—)
    .use(html, { sanitize: false })  // Allow HTML without sanitization
    .process(matterResult.content);
  let contentHtml = processedContent.toString();
  
  // Wrap each instructor notes section with data attribute for conditional rendering
  // Find all "## Instructor Notes" headings and wrap each section individually
  // Each section includes the heading and everything until the next h2 heading (or end of document)
  const instructorNotesRegex = /<h2[^>]*>Instructor Notes<\/h2>/g;
  const matches: Array<number> = [];
  let match;
  
  // Find all "Instructor Notes" heading positions
  while ((match = instructorNotesRegex.exec(contentHtml)) !== null) {
    matches.push(match.index);
  }
  
  if (matches.length > 0) {
    // Process from end to beginning to avoid index shifting issues
    for (let i = matches.length - 1; i >= 0; i--) {
      const sectionStart = matches[i];
      
      // Find the next h2 heading after this one (or end of document)
      const afterStart = contentHtml.substring(sectionStart);
      const nextH2Match = afterStart.substring(afterStart.indexOf('</h2>') + 5).match(/<h2[^>]*>/);
      
      let sectionEnd: number;
      if (nextH2Match && nextH2Match.index !== undefined) {
        sectionEnd = sectionStart + afterStart.indexOf('</h2>') + 5 + nextH2Match.index;
      } else {
        sectionEnd = contentHtml.length;
      }
      
      // Extract and wrap this instructor notes section
      const sectionContent = contentHtml.substring(sectionStart, sectionEnd);
      const wrappedContent = `<div data-instructor-notes="true">${sectionContent}</div>`;
      contentHtml = contentHtml.substring(0, sectionStart) + wrappedContent + contentHtml.substring(sectionEnd);
    }
  }

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