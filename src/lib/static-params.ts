import { getAllPostIds, getPostData, PostData } from './markdown';

/**
 * Generates a placeholder slug for a given content type.
 * Used when all items are drafts to satisfy Next.js's requirement
 * that generateStaticParams returns at least one param.
 */
export function getPlaceholderSlug(contentType: 'activities' | 'assignments' | 'resources'): string {
  const singularMap: Record<typeof contentType, string> = {
    activities: 'activity',
    assignments: 'assignment',
    resources: 'resource',
  };
  return `__no-${singularMap[contentType]}__`;
}

/**
 * Checks if a slug is a placeholder slug (indicating all items are drafts).
 */
export function isPlaceholderSlug(slug: string, contentType: 'activities' | 'assignments' | 'resources'): boolean {
  return slug === getPlaceholderSlug(contentType);
}

/**
 * Validates if a post should be rendered (not draft, not excluded).
 */
export function shouldRenderPost(postData: PostData): boolean {
  return postData.draft !== 1 && !postData.excluded;
}

/**
 * Generates static params for a content type.
 * Includes ALL posts (including drafts) so they can be pre-generated and return 404 gracefully.
 * Returns a placeholder slug if no posts exist to satisfy Next.js requirements.
 */
export async function generateStaticParamsForContentType(
  contentType: 'activities' | 'assignments' | 'resources'
): Promise<Array<{ slug: string }>> {
  try {
    const postIds = getAllPostIds(contentType);
    
    // Include ALL posts (including drafts) so they can be pre-generated
    // The page component will handle returning 404 for drafts
    const allPosts = await Promise.all(
      postIds.map(async ({ params }) => {
        try {
          // Just verify the post can be loaded - don't filter by draft status here
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
 * Handles placeholder slugs and draft/excluded posts.
 */
export function validatePostForRender(
  slug: string,
  postData: PostData,
  contentType: 'activities' | 'assignments' | 'resources'
): boolean {
  // Handle placeholder slug when all posts are drafts
  if (isPlaceholderSlug(slug, contentType)) {
    return false;
  }
  
  // Don't render draft or excluded posts
  return shouldRenderPost(postData);
}
