import { Schema, model } from "mongoose";

const workoutStyleSchema = new Schema(
  {
    type: {
      type: Schema.Types.ObjectId,
      ref: "Style",
      required: true,
    },
    occurence: {
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

export default model("WorkoutStyle", workoutStyleSchema);
