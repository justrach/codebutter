
const isProd = process.env.NODE_ENV === 'production';
const appUrl = !isProd
  ? 'http://localhost:3000'
  : 'https://codebutter.xyz/home';

export {  appUrl, isProd };
