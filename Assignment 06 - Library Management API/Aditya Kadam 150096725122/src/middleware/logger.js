const loggerMiddleware = (req, res, next) => {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  
  const logData = {
    timestamp,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
    user: req.user ? req.user.userId : 'anonymous',
  };
  
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - User: ${logData.user} - IP: ${logData.ip}`);
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - Duration: ${duration}ms`);
  });
  
  next();
};

module.exports = loggerMiddleware;
