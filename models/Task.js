const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
    {
      title: String,
      description: String,
      status: { 
        type: String, 
        enum: ["pending", "completed"], 
        default: "pending" 
      },
      priority: { 
        type: String, 
        enum: ["low", "medium", "high"], 
        required: true 
      },
      createdAt: { 
        type: Date, 
        default: Date.now 
      }
    }
);

module.exports = mongoose.model("Task", TaskSchema);