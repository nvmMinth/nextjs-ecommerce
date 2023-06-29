import { getSession } from "next-auth/react";
import db from "../../../../utils/db";
import User from "../../../../models/user";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send("signin required");
  }

  if (req.method === "DELETE") {
    await db.connect();
    const user = await User.findById(req.query.id);
    if (user) {
      if (user.isAdmin === true) {
        res.status(400).send({ message: "can not remove admin" });
      }
      await user.remove();
      await db.disconnect();
      res.send({ message: "user deleted" });
    } else {
      await db.disconnect();
      res.status(400).send({ message: "user not found" });
    }
  } else {
    return res.status(400).send({ message: "method not allowed" });
  }
};
export default handler;
