import { Topic } from '../models/Topic.model.js';
import SubTopic from '../models/SubTopic.model.js';
import Question from '../models/Question.model.js';

export const createQuestion = async (req, res) => {
    try {
        const { topicId, subTopicId } = req.params;
        const { title, difficulty, problemUrl, platform, resource, companyTags } = req.body;

        const newQuestion = await Question.create({
            title: title || 'New Question',
            isSolved: false,
            difficulty: difficulty || 'Medium',
            problemUrl: problemUrl || '#',
            order: 0,
            platform: platform || 'leetcode',
            resource: resource || '#',
            companyTags: companyTags || []
        });

        if (subTopicId && subTopicId !== 'null') {
            const subTopic = await SubTopic.findById(subTopicId);
            if (!subTopic) return res.status(404).json({ success: false, error: 'Sub-topic not found' });
            subTopic.questions.push(newQuestion._id);
            await subTopic.save();
        } else {
            const topic = await Topic.findById(topicId);
            if (!topic) return res.status(404).json({ success: false, error: 'Topic not found' });
            topic.questions.push(newQuestion._id);
            await topic.save();
        }

        res.status(201).json({
            success: true,
            data: {
                _id: newQuestion._id.toString(),
                title: newQuestion.title,
                isSolved: newQuestion.isSolved,
                questionId: {
                    difficulty: newQuestion.difficulty,
                    problemUrl: newQuestion.problemUrl,
                    platform: newQuestion.platform,
                    resource: newQuestion.resource,
                    companyTags: newQuestion.companyTags
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const { title, difficulty, problemUrl, platform, resource, companyTags } = req.body;

        const updateData = {};
        if (title) updateData.title = title;
        if (difficulty) updateData.difficulty = difficulty;
        if (problemUrl) updateData.problemUrl = problemUrl;
        if (platform) updateData.platform = platform;
        if (resource) updateData.resource = resource;
        if (companyTags) updateData.companyTags = companyTags;

        const question = await Question.findByIdAndUpdate(questionId, updateData, { new: true });
        if (!question) return res.status(404).json({ success: false, error: 'Question not found' });

        res.json({
            success: true, data: {
                _id: question._id.toString(),
                title: question.title,
                difficulty: question.difficulty,
                problemUrl: question.problemUrl,
                platform: question.platform,
                resource: question.resource,
                companyTags: question.companyTags
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const toggleSolved = async (req, res) => {
    try {
        const { questionId } = req.params;

        const question = await Question.findById(questionId);
        if (!question) return res.status(404).json({ success: false, error: 'Question not found' });

        question.isSolved = !question.isSolved;
        await question.save();

        res.json({
            success: true, data: {
                _id: question._id.toString(),
                isSolved: question.isSolved
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteQuestion = async (req, res) => {
    try {
        const { topicId, subTopicId, questionId } = req.params;

        if (subTopicId && subTopicId !== 'null') {
            const subTopic = await SubTopic.findById(subTopicId);
            if (subTopic) {
                subTopic.questions.pull(questionId);
                await subTopic.save();
            }
        } else {
            const topic = await Topic.findById(topicId);
            if (topic) {
                topic.questions.pull(questionId);
                await topic.save();
            }
        }

        await Question.findByIdAndDelete(questionId);
        res.json({ success: true, message: 'Question deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const reorderQuestions = async (req, res) => {
    try {
        const { topicId, subTopicId } = req.params;
        const { orderedIds } = req.body;

        if (subTopicId && subTopicId !== 'null') {
            const subTopic = await SubTopic.findById(subTopicId);
            if (subTopic) {
                subTopic.questions = orderedIds;
                await subTopic.save();
            }
        } else {
            const topic = await Topic.findById(topicId);
            if (topic) {
                topic.questions = orderedIds;
                await topic.save();
            }
        }

        res.json({ success: true, message: 'Questions reordered' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
