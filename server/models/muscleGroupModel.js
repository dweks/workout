import { Schema, model } from "mongoose";

const muscleGroupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: false }
);

export default model("MuscleGroup", muscleGroupSchema);
