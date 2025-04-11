export const API_BASEURL = process.env.API_BASEURL || 'https://crappy-cbc-backend.vercel.app/api/v1';
export const apiPath = (url: string) => {
    return `${API_BASEURL}${url}`;
}