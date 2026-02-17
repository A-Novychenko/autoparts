export const buildCanonicalPath = (
  ancestors: IGroupAncestor[] | undefined,
  currentSlug: string,
): string => {
  const pathSlugs = [...(ancestors || []).map(a => a.slug), currentSlug];
  return pathSlugs.join('/');
};
