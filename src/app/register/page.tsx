// NOTE(ryuu): not sure if its a good idea to do this in server component rather than
// creating an API route for it.

import { connectDB } from "@/lib/mongoose"
import { User } from "@/models/user"
import RegisterPage from "./register-page"
import AlreadyExists from "./already-exists"

export default async function Register() {
  await connectDB()
  const existingUser = await User.findOne()

  if (existingUser) {
    return <AlreadyExists />
  }

  return <RegisterPage />
}

