export const API_BASEURL =
  process.env.NEXT_PUBLIC_API_BASEURL ||
  'https://se-project-backend-22-more-concern-na.vercel.app';
export const apiPath = (url: string) => {
  return `${API_BASEURL}${url}`;
};
