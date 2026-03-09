import mongoose, { Document, Schema } from "mongoose";

export interface IEvent extends Document {
    title: string;
    description: string;
    date: Date;
    totalSeats: number;
    availableSeats: number;
    imageUrl?: string;
}

const eventSchema: Schema = new Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    date: { 
        type: Date, 
        required: true },
    totalSeats: { 
        type: Number, 
        required: true },
    availableSeats: { 
        type: Number,
        required: true },
    imageUrl: {
        type: String
    }
}, {
    timestamps: true
});     

export default mongoose.model<IEvent>("Event", eventSchema);



