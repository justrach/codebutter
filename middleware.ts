import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ['/','/api/submit','/api/test','/api/getTasks',"/api/webhooks/stripe","/privacy-policy","/terms-of-use,","/pricing","/contact","/ip"],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
