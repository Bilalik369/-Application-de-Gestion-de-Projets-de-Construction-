  const mongoose = require("mongoose")

  const taskSchema = new mongoose.Schema({
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    resources: [
      {
        resourceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Resource",
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
    status: {
      type: String,
      enum: ["À faire", "En cours", "Terminé", "En retard"],
      default: "À faire",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  })


  taskSchema.pre("save", function (next) {
    this.updatedAt = Date.now()
    next()
  })

  module.exports = mongoose.model("Task", taskSchema)