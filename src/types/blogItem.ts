import { Document } from "mongoose"

export interface BlogItemType extends Document {
  blogTitle?: string
  blogText?: string
  blogAuthor?: string
  image?: string
  date: Date
  category?: string
}