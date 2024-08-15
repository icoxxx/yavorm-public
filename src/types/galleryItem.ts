import { Document } from "mongoose"

export interface GalleryItemType extends Document {
  galleryName?: string
  images?: string[]
  date: Date
  category?: string
}