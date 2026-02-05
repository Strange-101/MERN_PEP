const loggerMiddleware = (req, res, next) => {
  console.log(`Logger: ${req.method} ${req.url}`);
  next();
};

export default loggerMiddleware;
