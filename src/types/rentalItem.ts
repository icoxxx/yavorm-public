import { Document } from "mongoose"

export interface RentalItemType extends Document {
  itemName?: string
  description?: string
  modelName?: string
  rentalCategory?: string
  image?: string
  date: Date
  category?: string
}