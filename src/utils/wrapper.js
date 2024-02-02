
const wrapper = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);   
    } catch (error) {
      res.status(error.code||500).json({ message: error.message });
      next(error);
    }
  }
}
export default wrapper;
