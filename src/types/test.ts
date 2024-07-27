import { Document } from "mongoose"

export interface Test extends Document {
  name: string
  email: string
  image: string
  date: Date
}