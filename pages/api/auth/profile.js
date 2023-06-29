import { getSession } from "next-auth/react"
import bcryptjs from "bcryptjs"
import db from "../../../utils/db"
import User from "../../../models/user"

const handler = async (req, res) => {
    if (req.method !== "PUT") {
        res.status(400).send({ message: `${req.method} not supported` })
    }
    const session = await getSession({ req })
    if (!session) {
        res.status(401).send({ message: "signin required" })
    }
    const { user } = session
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        res.status(422).send({ message: "Validation error" })
        return
    }
    await db.connect()
    const userToUpdate = await User.findById(user._id)
    userToUpdate.name = name
    userToUpdate.email = email
    if (password) {
        userToUpdate.password = bcryptjs.hashSync(password)
    }
    await userToUpdate.save()
    await db.disconnect()
    res.send({ message: "user profile updated" })
}

export default handler