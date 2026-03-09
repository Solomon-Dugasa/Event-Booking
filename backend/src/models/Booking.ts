import mongoose, { Document, Schema } from "mongoose";

export interface IBooking extends Document {
    user: mongoose.Types.ObjectId;
    event: mongoose.Types.ObjectId;
    seatsBooked: number;
}

const bookingSchema: Schema = new Schema({
    user: { 
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    event: { 
        type: Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    seatsBooked: { 
        type: Number, 
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model<IBooking>("Booking", bookingSchema);

 
