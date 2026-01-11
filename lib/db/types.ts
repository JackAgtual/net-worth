import { Types } from "mongoose";

export interface MongoDocument {
  _id: Types.ObjectId;
}

export interface Entry extends MongoDocument {
  title: string;
  amount: number;
  notes?: string;
}
