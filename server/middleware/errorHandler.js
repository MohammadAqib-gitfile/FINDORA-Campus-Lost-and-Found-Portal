function errorHandler(err, req, res, next) {
  console.error('[Error Handler]', err);

  // Multer errors
  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: messages.join(', ')
    });
  }

  // CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Resource not found with invalid id format: ${err.value}`
    });
  }

  // Default server error
  const status = err.statusCode || 500;
  return res.status(status).json({
    success: false,
    message: err.message || 'Internal server error.'
  });
}

module.exports = errorHandler;
