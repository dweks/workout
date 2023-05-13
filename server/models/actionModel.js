import { Schema, model } from "mongoose";

const actionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    effect: {
      type: Schema.Types.ObjectId,
      ref: "MuscleGroup",
      required: true,
    },
  },
  { timestamps: false }
);

export default model("Action", actionSchema);
