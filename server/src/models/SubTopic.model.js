import mongoose from "mongoose";

const SubTopicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
    }],
    order: {
        type: Number,
        default: 0
    }
}, { _id: true });

SubTopicSchema.index({ order: 1 });

const SubTopic = mongoose.model("SubTopic", SubTopicSchema);
export default SubTopic;
