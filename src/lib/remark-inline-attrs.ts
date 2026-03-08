import type { Root, Content } from 'mdast';

/**
 * Simple remark plugin to support Kramdown-style inline attribute lists:
 * 
 *   {: .class-one .class-two #element-id }
 * 
 * placed on a separate line immediately after a block element.
 * 
 * The plugin:
 * - Finds paragraphs that consist ONLY of an inline-attrs marker
 * - Attaches the parsed classes/ID to the previous sibling node
 * - Removes the marker paragraph from the tree
 *
 * This keeps the markdown source clean while letting remark-html
 * emit the right attributes via hProperties.
 */
export default function remarkInlineAttrs() {
  return function transformer(tree: Root) {
    if (!tree || !('children' in tree)) return;

    const root = tree as unknown as { children: Content[] };

    const processChildren = (parent: { children?: Content[] }) => {
      if (!parent.children || !Array.isArray(parent.children)) return;

      const children = parent.children;

      for (let i = 0; i < children.length; i++) {
        const node = children[i];

        // Recurse into nested parents (lists, blockquotes, etc.)
        if (node && typeof node === 'object' && 'children' in node && Array.isArray(node.children)) {
          processChildren(node as { children: Content[] });
        }

        // Look for a paragraph that is just an inline-attrs marker
        // Also check if it's a text node directly (can happen in some contexts)
        let markerText: string | null = null;
        let markerAttrs: string | null = null;
        
        if (node.type === 'paragraph' && 'children' in node && Array.isArray(node.children) && node.children.length === 1) {
          const child = node.children[0];
          if (child.type === 'text') {
            const text = String(child.value || '').trim();
            const match = text.match(/^\{\:\s+([^}]+)\}$/);
            if (match) {
              markerText = text;
              markerAttrs = match[1].trim();
            }
          }
        } else if (node.type === 'text') {
          // Handle case where marker might be a direct text node
          const text = String(node.value || '').trim();
          const match = text.match(/^\{\:\s+([^}]+)\}$/);
          if (match) {
            markerText = text;
            markerAttrs = match[1].trim();
          }
        }
        
        if (markerAttrs) {
              // We have an inline attrs marker that should apply to a sibling (before or after)
              const attrs = markerAttrs;
              const tokens = attrs.split(/\s+/);

              const classes: string[] = [];
              let id: string | undefined;

              for (const token of tokens) {
                if (token.startsWith('.')) {
                  const cls = token.slice(1);
                  if (cls) classes.push(cls);
                } else if (token.startsWith('#')) {
                  const ident = token.slice(1);
                  if (ident) id = ident;
                }
              }

              // Try to attach to previous sibling first (marker after element - standard Kramdown)
              // If that doesn't work, try next sibling (marker before element - also supported)
              const prevIndex = i - 1;
              const nextIndex = i + 1;
              let targetNode: Content | null = null;
              
              // First, try previous sibling (marker after element)
              if (prevIndex >= 0) {
                const prevSibling = children[prevIndex];
                // Skip if previous sibling is also a marker paragraph
                if (prevSibling && prevSibling.type !== 'paragraph') {
                  targetNode = prevSibling;
                }
              }
              
              // If no previous sibling or it's not suitable, try next sibling (marker before element)
              if (!targetNode && nextIndex < children.length) {
                const nextSibling = children[nextIndex];
                // Skip if next sibling is a marker paragraph
                if (nextSibling && nextSibling.type !== 'paragraph') {
                  targetNode = nextSibling;
                }
              }
              
              // Special handling for tables: look backwards through siblings
              if (!targetNode && prevIndex >= 0) {
                for (let j = prevIndex; j >= 0; j--) {
                  const candidate = children[j];
                  if (candidate && candidate.type === 'table') {
                    targetNode = candidate;
                    break;
                  }
                  // Check if this node contains a table as its last child
                  if (candidate && 'children' in candidate && Array.isArray(candidate.children)) {
                    const lastChild = candidate.children[candidate.children.length - 1];
                    if (lastChild && lastChild.type === 'table') {
                      targetNode = lastChild;
                      break;
                    }
                  }
                }
              }
              
              if (targetNode && typeof targetNode === 'object' && 'type' in targetNode) {
                const nodeWithData = targetNode as Content & { data?: { hProperties?: Record<string, unknown> } };
                nodeWithData.data = nodeWithData.data || {};
                nodeWithData.data.hProperties = nodeWithData.data.hProperties || {};

                // Merge classes with any existing ones
                const existing = nodeWithData.data.hProperties.className;
                let existingClasses: string[] = [];

                if (typeof existing === 'string') {
                  existingClasses = existing.split(/\s+/);
                } else if (Array.isArray(existing)) {
                  existingClasses = existing.filter((item): item is string => typeof item === 'string');
                }

                const mergedClasses = [...existingClasses];
                for (const cls of classes) {
                  if (!mergedClasses.includes(cls)) {
                    mergedClasses.push(cls);
                  }
                }

                if (mergedClasses.length > 0) {
                  const classString = mergedClasses.join(' ');
                  nodeWithData.data.hProperties.className = mergedClasses;
                  nodeWithData.data.hProperties.class = classString; // Also set 'class' for compatibility
                }

                if (id) {
                  nodeWithData.data.hProperties.id = id;
                }
              }

              // Remove this paragraph marker from the tree
              // Exception: if target is a table, keep it for post-processing (handles raw HTML contexts)
              const isTableTarget = targetNode && targetNode.type === 'table';
              
              if (!isTableTarget) {
                // Remove the marker paragraph for non-table targets
                children.splice(i, 1);
                i--; // Adjust index after removal
              } else {
                // For tables, convert the marker to a data attribute comment that post-processing can find
                // Replace the text content with a comment-like marker
                const tableMarkerText = `<!-- TABLE-ATTR: ${attrs} -->`;
                if (node.type === 'paragraph' && 'children' in node && Array.isArray(node.children) && node.children[0] && 'value' in node.children[0]) {
                  (node.children[0] as { value: string }).value = tableMarkerText;
                }
                // Change paragraph to html node so it's preserved
                node.type = 'html';
                if ('children' in node) {
                  (node as { children?: unknown }).children = undefined;
                }
                (node as { value: string }).value = tableMarkerText;
              }
            }
      }
    };

    processChildren(root);
  };
}

