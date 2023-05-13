import { Schema, model } from "mongoose";

const exerciseSchema = new Schema(
  {
    nickname: {
      type: String,
    },
    action: {
      type: Schema.Types.ObjectId,
      ref: "Action",
      required: true,
    },
    step: {
        type: Number,
    },
    sets: {
        type: Number,
    },
    reps: {
        type: Number,
    },
    weight: {
        type: Number,
    },
    duration: {
        type: Date
    },
  },
  { timestamps: false }
);

export default model("Excercise", exerciseSchema);
