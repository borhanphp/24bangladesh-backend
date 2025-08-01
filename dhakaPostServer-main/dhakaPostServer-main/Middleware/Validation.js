function validation(req, res, next) {
  console.log("email", req.body);
  const { email } = req.body;

  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const result = re.test(email);

  if (!result) {
    return res.status(400).json({ message: "Your Email is not valid!!" });
  }

  next();
}
module.exports = { validation };
