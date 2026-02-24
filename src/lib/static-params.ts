import { getAllPostIds, getPostData, PostData } from './markdown';

/**
 * Generates a placeholder slug for a given content type.
 * Used when all items are drafts to satisfy Next.js's requirement
 * that generateStaticParams returns at least one param.
 */
export function getPlaceholderSlug(contentType: 'activities' | 'assignments' | 'resources' | 'exams'): string {
  const singularMap: Record<typeof contentType, string> = {
    activities: 'activity',
    assignments: 'assignment',
    resources: 'resource',
    exams: 'exam',
  };
  return `__no-${singularMap[contentType]}__`;
}

/**
 * Checks if a slug is a placeholder slug (indicating all items are drafts).
 */
export function isPlaceholderSlug(slug: string, contentType: 'activities' | 'assignments' | 'resources' | 'exams'): boolean {
  return slug === getPlaceholderSlug(contentType);
}

/**
 * Validates if a post should be rendered (not excluded and not marked as no_render).
 * Note: Drafts are allowed to be rendered (accessible via direct URL),
 * but should be filtered out from index pages.
 */
export function shouldRenderPost(postData: PostData): boolean {
  // Don't render if excluded or if no_render flag is set to 1
  return !postData.excluded && postData.no_render !== 1;
}

/**
 * Generates static params for a content type.
 * Includes ALL posts (including drafts) so they can be pre-generated.
 * Returns a placeholder slug if no posts exist to satisfy Next.js requirements.
 */
export async function generateStaticParamsForContentType(
  contentType: 'activities' | 'assignments' | 'resources' | 'exams'
): Promise<Array<{ slug: string }>> {
  try {
    const postIds = getAllPostIds(contentType);
    
    // Include ALL posts (including drafts and no_render items) so they can be pre-generated
    // The page component will handle returning 404 for drafts and no_render items
    // We must include no_render items in static generation because Next.js with output: export
    // requires all routes to be pre-generated, but the page will return 404 via validatePostForRender
    const allPosts = await Promise.all(
      postIds.map(async ({ params }) => {
        try {
          // Just verify the post can be loaded - don't filter by draft or no_render status here
          await getPostData(params.id, contentType);
          return { slug: params.id };
        } catch {
          // If post can't be loaded, exclude it
          return null;
        }
      })
    );
    
    const filtered = allPosts.filter((post): post is { slug: string } => post !== null);
    
    // Next.js requires at least one param when using output: export
    // Return a placeholder if no posts exist
    if (filtered.length === 0) {
      return [{ slug: getPlaceholderSlug(contentType) }];
    }
    
    return filtered;
  } catch (error) {
    console.error(`Error generating static params for ${contentType}:`, error);
    // Return placeholder on error to satisfy Next.js requirement
    return [{ slug: getPlaceholderSlug(contentType) }];
  }
}

/**
 * Validates a slug and post data, returning true if the post should be rendered.
 * Handles placeholder slugs and excluded posts.
 * Note: Drafts are allowed to be rendered (accessible via direct URL),
 * but should be filtered out from index pages.
 */
export function validatePostForRender(
  slug: string,
  postData: PostData,
  contentType: 'activities' | 'assignments' | 'exams' | 'resources'
): boolean {
  // Handle placeholder slug when all posts are drafts
  if (isPlaceholderSlug(slug, contentType)) {
    return false;
  }
  
  // Only exclude excluded posts (drafts are allowed)
  return shouldRenderPost(postData);
}
