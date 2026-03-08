/**
 * Lightweight helpers to handle Jekyll-style custom tags in markdown.
 *
 * We currently support:
 *   - {% collapsible %} / {% collapsible closed %}
 *   - {% no-copy %}
 *   - {: .class #id } (Kramdown-style inline attribute lists)
 *
 * For now, we implement these as a pre-processing step that rewrites tags
 * into HTML comments, which are then consumed by the existing HTML
 * post-processors in `markdown.ts`.
 *
 * This keeps the implementation small while giving you Jekyll-like
 * authoring syntax in your markdown.
 */

/**
 * Replace custom tag syntax in raw markdown with internal HTML comments
 * that the existing HTML post-processors already understand.
 */
export function preprocessMarkdownTags(markdown: string): string {
  let result = markdown;

  // {% collapsible closed %} -> <!-- collapsible closed -->
  result = result.replace(
    /{%\s*collapsible\s+closed\s*%}/gi,
    '<!-- collapsible closed -->',
  );

  // {% collapsible %} -> <!-- collapsible -->
  result = result.replace(
    /{%\s*collapsible\s*%}/gi,
    '<!-- collapsible -->',
  );

  // {% no-copy %} -> <!-- no-copy-button -->
  result = result.replace(
    /{%\s*no-copy\s*%}/gi,
    '<!-- no-copy-button -->',
  );

  // {: .class #id } -> <!-- ATTR-BLOCK: .class #id -->
  // Matches Kramdown-style inline attribute lists on their own line
  // Supports both "before" (marker before element) and "after" (marker after element) placement
  result = result.replace(
    /^\s*\{\:\s+([^}]+)\}\s*$/gm,
    (match, attrs) => {
      // Preserve the attributes, trimming whitespace
      const trimmedAttrs = attrs.trim();
      return `<!-- ATTR-BLOCK: ${trimmedAttrs} -->`;
    }
  );

  return result;
}

