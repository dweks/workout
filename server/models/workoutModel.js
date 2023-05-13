import { Schema, model } from "mongoose";

const workoutSchema = new Schema(
  {
    type: {
      type: Schema.Types.ObjectId,
      ref: "Style",
      required: true,
    },
    occurence: {
      type: Date,
    },
    repetition: {
      type: Date,
    },
    exercises: [
      {
        type: Schema.Types.ObjectId,
        ref: "Exercise",
      },
    ],
  },
  { timestamps: false }
);

export default model("Workout", workoutSchema);
