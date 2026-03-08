import type { Root, Element, Content } from 'hast';

/**
 * Rehype plugin to ensure hProperties on table nodes are properly applied.
 * This handles cases where rehype-stringify might not apply hProperties correctly to tables.
 */
export default function rehypeTableAttrs() {
  return function transformer(tree: Root) {
    function visit(node: Root | Content): void {
      if (node.type === 'element' && node.tagName === 'table' && 'data' in node && node.data && typeof node.data === 'object' && 'hProperties' in node.data) {
        const props = node.data.hProperties as Record<string, unknown>;
        const element = node as Element;
        
        // Ensure className is converted to class attribute
        if (props.className) {
          const classes = Array.isArray(props.className) 
            ? props.className 
            : typeof props.className === 'string'
            ? props.className.split(/\s+/)
            : [];
          
          if (classes.length > 0) {
            const existingClass = element.properties?.className || element.properties?.class;
            const existingClasses = typeof existingClass === 'string'
              ? existingClass.split(/\s+/)
              : Array.isArray(existingClass)
              ? existingClass
              : [];
            
            const merged = [...existingClasses];
            for (const cls of classes) {
              if (cls && !merged.includes(cls)) {
                merged.push(cls);
              }
            }
            
            element.properties = element.properties || {};
            element.properties.className = merged;
          }
        }
        
        // Ensure id is set
        if (props.id && typeof props.id === 'string') {
          element.properties = element.properties || {};
          element.properties.id = props.id;
        }
      }
      
      // Recursively visit children
      if ('children' in node && Array.isArray(node.children)) {
        for (const child of node.children) {
          visit(child);
        }
      }
    }
    
    visit(tree);
  };
}
