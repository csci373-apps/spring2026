import type { Root, Element, Content } from 'hast';

/**
 * Rehype plugin to ensure hProperties on all nodes are properly applied.
 * remark-rehype should convert data.hProperties to properties, but this ensures
 * it works correctly for all element types.
 */
export default function rehypeApplyAttrs() {
  return function transformer(tree: Root) {
    function visit(node: Root | Content): void {
      if (node.type === 'element' && 'data' in node && node.data && typeof node.data === 'object' && 'hProperties' in node.data) {
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
        
        // Also handle 'class' property if set directly
        if (props.class) {
          const classes = typeof props.class === 'string'
            ? props.class.split(/\s+/)
            : Array.isArray(props.class)
            ? props.class
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
