/**
 * An array of routes that are accesible to the public
 * do not require authentication
 * @type {string[]}
 */
export const publicRoutes = ["/", "/search/request", "/auth/new-verification"];
/**
 * An array of routes that are used for authentication
 * Will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];
/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API auth purposes
 */
export const apiAuthPrefix = "/api/auth";

/**
 * default redirect path after logging in
 */
export const DEFAULT_LOGIN_REDIRECT = "/search";
