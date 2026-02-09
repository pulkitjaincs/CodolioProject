import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: ''
    },
    order: {
        type: Number,
        default: 0,
    },
    subTopics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubTopic"
    }],
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
    }],
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending'
    }
}, { _id: true });

topicSchema.index({ order: 1 });

export const Topic = mongoose.model("Topic", topicSchema);