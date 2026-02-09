import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    isSolved: {
        type: Boolean,
        default: false
    },
    difficulty: {
        type: String,
        enum: ['Basic', 'Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    order: {
        type: Number,
        default: 0
    },
    problemUrl: {
        type: String,
        default: '#'
    },
    platform: {
        type: String,
        enum: ['leetcode', 'geeksforgeeks', 'codestudio', 'hackerrank', 'codechef', 'interviewbit', 'ninjas', 'other'],
        default: 'leetcode'
    },
    resource: {
        type: String,
        default: '#'
    },
    companyTags: {
        type: [String],
        default: []
    }
}, { _id: true });

QuestionSchema.index({ order: 1 });
const Question = mongoose.model("Question", QuestionSchema);
export default Question;