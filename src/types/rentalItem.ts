import { Document } from "mongoose"

export interface RentalItemType extends Document {
  itemName?: string
  description?: string
  image?: string
  date: Date
  category?: string
}