import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';
import highlight from 'remark-highlight.js';
import smartypants from 'remark-smartypants';
import { preprocessCheckboxes, postprocessCheckboxes } from './markdown-checkboxes';

const postsDirectory = path.join(process.cwd(), 'content');
const quizzesDirectory = path.join(process.cwd(), 'content', 'quizzes');

export interface PostData {
  id: string;
  num?: string;
  title: string;
  group?: string;
  group_order?: number;
  order?: number;
  description?: string;
  date: string;
  start_date?: string;
  assigned_date?: string;
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
  quicklink?: number;
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
  
  // Pre-process markdown to fix tables without headers
  // If a table starts with a separator row (| -- | -- |), add an empty header row before it
  let markdownContent = matterResult.content;
  const lines = markdownContent.split('\n');
  const processedLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if this line is a separator row (| -- | -- |)
    const isSeparatorRow = line.match(/^\s*\|(\s*--\s*\|)+\s*$/);
    
    if (isSeparatorRow && i > 0) {
      const prevLine = lines[i - 1];
      // Check if previous line is a table row with content (not a separator)
      const prevIsTableRow = prevLine.match(/^\s*\|.*\|.*\|\s*$/);
      const prevIsSeparator = prevLine.match(/^\s*\|(\s*--\s*\|)+\s*$/);
      
      // If previous line is not a table row, or is also a separator, we need to add a header
      if (!prevIsTableRow || prevIsSeparator) {
        // Count columns from the separator row (number of | minus 1)
        const columnCount = (line.match(/\|/g) || []).length - 1;
        // Create empty header row with same number of columns
        const emptyHeaderRow = '|' + ' |'.repeat(columnCount) + ' |';
        processedLines.push(emptyHeaderRow);
      }
    }
    
    processedLines.push(line);
  }
  
  markdownContent = processedLines.join('\n');
  
  // Pre-process checkboxes: replace [ ] patterns with placeholders
  // This prevents GFM from converting them into disabled task list items
  const { processedMarkdown: markdownWithCheckboxPlaceholders } = preprocessCheckboxes(markdownContent);
  markdownContent = markdownWithCheckboxPlaceholders;

  // Use remark to convert markdown into HTML string with GFM support and syntax highlighting
  const processedContent = await remark()
    .use(gfm)  // Add GitHub Flavored Markdown support
    // @ts-expect-error - remark-highlight.js has type conflicts but works correctly at runtime
    .use(highlight)  // Add syntax highlighting
    .use(smartypants, { dashes: 'oldschool' })  // Convert -- to en-dash (–) and --- to em-dash (—)
    .use(html, { sanitize: false })  // Allow HTML without sanitization
    .process(markdownContent);
  let contentHtml = processedContent.toString();

  // Post-process HTML to convert checkbox placeholders to stateful checkboxes
  // The placeholders were inserted before GFM processing to avoid disabled checkboxes
  contentHtml = await postprocessCheckboxes(contentHtml, id);

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

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

export interface QuizData {
  quizName?: string;
  start_date?: string;
  questions: QuizQuestion[];
}

export interface QuizMetadata {
  slug: string;
  quizName: string;
  start_date?: string;
}

export function getQuizData(slug: string): QuizData | null {
  const quizPath = path.join(quizzesDirectory, `${slug}.json`);
  
  if (!fs.existsSync(quizPath)) {
    return null;
  }
  
  try {
    const fileContents = fs.readFileSync(quizPath, 'utf8');
    const quizData: QuizData = JSON.parse(fileContents);
    return quizData;
  } catch (error) {
    console.error(`Error reading quiz data for ${slug}:`, error);
    return null;
  }
}

export function getAllQuizMetadata(): QuizMetadata[] {
  if (!fs.existsSync(quizzesDirectory)) {
    return [];
  }
  
  const fileNames = fs.readdirSync(quizzesDirectory);
  const allQuizzes: QuizMetadata[] = [];
  
  fileNames
    .filter(fileName => fileName.endsWith('.json'))
    .forEach(fileName => {
      // Remove ".json" from file name to get slug
      const slug = fileName.replace(/\.json$/, '');
      
      try {
        // Read quiz file
        const fullPath = path.join(quizzesDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const quizData: QuizData = JSON.parse(fileContents);
        
        allQuizzes.push({
          slug,
          quizName: quizData.quizName || slug,
          start_date: quizData.start_date,
        });
      } catch (error) {
        console.error(`Error reading quiz metadata for ${fileName}:`, error);
      }
    });
  
  return allQuizzes;
} 