import bcrypt from "bcryptjs";
import User from "../../../models/user";
import db from "../../../utils/db";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return;
  }
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(422).json({
      message: "Validation error",
    });
    return;
  }
  await db.connect();

  const existUser = await User.findOne({ email: email });
  if (existUser) {
    res.status(422).json({ message: "Email already existed" });
    await db.disconnect();
    return;
  }
  const newUser = new User({
    name,
    email,
    password: bcrypt.hashSync(password),
    isAdmin: false,
  });
  const userCreated = await newUser.save();
  db.disconnect();
  res.status(201).send({
    message: "Account created!",
    email: userCreated.email,
    _id: userCreated._id,
    name: userCreated.name,
    isAdmin: userCreated.isAdmin,
  });
};

export default handler;
