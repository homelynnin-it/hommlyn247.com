// Vercel serverless entry point.
// Wraps the existing Express app so /api/* requests reach the same routes,
// middleware, auth, and error handling used by `npm run start`.
const { buildApp } = require('../dist/server.cjs');

let appPromise;

module.exports = async (req, res) => {
  if (!appPromise) {
    appPromise = buildApp();
  }
  const { app } = await appPromise;
  app(req, res);
};