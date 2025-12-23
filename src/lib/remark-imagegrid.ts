import { visit } from 'unist-util-visit';
import type { Node } from 'unist';
import type { Html } from 'mdast';

// Define different image sets that can be used
export const IMAGE_SETS = {
  // Default set for vis01 activity
  'vis01': [
    '/fall2025/images/student-work/first-graph/2025-09-11-0001.jpg',
    '/fall2025/images/student-work/first-graph/2025-09-11-0002.jpg',
    '/fall2025/images/student-work/first-graph/2025-09-11-0003.jpg',
    '/fall2025/images/student-work/first-graph/2025-09-11-0004.jpg',
    '/fall2025/images/student-work/first-graph/2025-09-11-0005.jpg',
    '/fall2025/images/student-work/first-graph/2025-09-11-0006.jpg',
    '/fall2025/images/student-work/first-graph/2025-09-11-0007.jpg',
    '/fall2025/images/student-work/first-graph/2025-09-11-0008.jpg',
    '/fall2025/images/student-work/first-graph/2025-09-11-0009.jpg',
    '/fall2025/images/student-work/first-graph/2025-09-11-0010.jpg',
    '/fall2025/images/student-work/first-graph/2025-09-11-0011.jpg',
    '/fall2025/images/student-work/first-graph/2025-09-11-0012.jpg',
    '/fall2025/images/student-work/first-graph/2025-09-11-0013.jpg',
    '/fall2025/images/student-work/first-graph/2025-09-11-0014.jpg',
    '/fall2025/images/student-work/first-graph/2025-09-11-0015.jpg',
  ],
  // Redesigned charts from vis02 activity
  'vis02': [
    '/fall2025/images/student-work/redesigned-charts/2025-09-18-0005.jpg',
    '/fall2025/images/student-work/redesigned-charts/2025-09-18-0004.jpg',
    '/fall2025/images/student-work/redesigned-charts/2025-09-18-0003.jpg',
    '/fall2025/images/student-work/redesigned-charts/2025-09-18-0006.jpg',
    '/fall2025/images/student-work/redesigned-charts/2025-09-18-0007.jpg',
    '/fall2025/images/student-work/redesigned-charts/2025-09-18-0008.jpg',
    '/fall2025/images/student-work/redesigned-charts/2025-09-18-0009.jpg',
    '/fall2025/images/student-work/redesigned-charts/2025-09-18-0010.jpg',
    '/fall2025/images/student-work/redesigned-charts/2025-09-18-0011.jpg',
    '/fall2025/images/student-work/redesigned-charts/2025-09-18-0012.jpg',
    '/fall2025/images/student-work/redesigned-charts/2025-09-18-0013.jpg',
  ],
  // Add more image sets as needed
  // 'lab01': [...],
};

// Legacy export for backward compatibility
export const IMAGE_PATHS = IMAGE_SETS.vis01;

export function remarkImageGrid() {
  return (tree: Node) => {
    visit(tree, 'html', (node: Html) => {
      if (node.value && node.value.includes('<ImageGrid')) {
        // Parse ImageGrid tags with optional parameters
        // Support formats like:
        // <ImageGrid />
        // <ImageGrid set="vis01" />
        // <ImageGrid set="vis01" alt="Custom alt text" />
        node.value = node.value.replace(
          /<ImageGrid(?:\s+([^>]*))?\s*\/?>/g,
          (match, attributes) => {
            // Parse attributes if they exist
            let dataAttributes = 'data-imagegrid-placeholder="true"';
            
            if (attributes) {
              // Simple attribute parsing for set and alt
              const setMatch = attributes.match(/set="([^"]*)"/);
              const altMatch = attributes.match(/alt="([^"]*)"/);
              
              if (setMatch) {
                dataAttributes += ` data-imagegrid-set="${setMatch[1]}"`;
              }
              if (altMatch) {
                dataAttributes += ` data-imagegrid-alt="${altMatch[1]}"`;
              }
            }
            
            return `<div ${dataAttributes}></div>`;
          }
        );
      }
    });
  };
}
