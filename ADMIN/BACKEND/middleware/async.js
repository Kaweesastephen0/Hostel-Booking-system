// Wrapper to handle async/await errors in routes
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
