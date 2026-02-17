type GroupSlugsResult = [page: number, groupSlugs: string[]];

export const getGroupSlugs = (slugs: string[]): GroupSlugsResult => {
  let groupSlugs = [...slugs];
  let page = 1;

  const lastSlug = slugs[slugs.length - 1];

  // Проверка на пустой массив, чтобы избежать ошибки match у undefined
  if (!lastSlug) {
    return [page, groupSlugs];
  }

  const pageRegex = /^page-(\d+)$/;
  const match = lastSlug.match(pageRegex);

  if (match) {
    page = parseInt(match[1], 10);
    groupSlugs = slugs.slice(0, -1);
  }

  return [page, groupSlugs];
};
