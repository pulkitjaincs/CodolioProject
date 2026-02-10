import { Topic } from '../models/Topic.model.js';
import SubTopic from '../models/SubTopic.model.js';
import Question from '../models/Question.model.js';

export const getAllTopics = async (req, res) => {
    try {
        const topics = await Topic.find()
            .sort({ order: 1 })
            .populate({
                path: 'subTopics',
                populate: { path: 'questions' }
            })
            .populate('questions')
            .lean();

        const formattedTopics = topics.map(t => ({
            id: t._id.toString(),
            title: t.title,
            subTopics: (t.subTopics || []).map(st => ({
                id: st._id.toString(),
                title: st.title,
                questions: (st.questions || []).map(q => ({
                    _id: q._id.toString(),
                    title: q.title,
                    isSolved: q.isSolved,
                    isStarred: q.isStarred || false,
                    notes: q.notes || '',
                    questionId: {
                        difficulty: q.difficulty,
                        problemUrl: q.problemUrl,
                        platform: q.platform,
                        resource: q.resource,
                        companyTags: q.companyTags
                    }
                }))
            })),
            questions: (t.questions || []).map(q => ({
                _id: q._id.toString(),
                title: q.title,
                isSolved: q.isSolved,
                isStarred: q.isStarred || false,
                notes: q.notes || '',
                questionId: {
                    difficulty: q.difficulty,
                    problemUrl: q.problemUrl,
                    platform: q.platform,
                    resource: q.resource,
                    companyTags: q.companyTags
                }
            }))
        }));
        res.json({ success: true, data: formattedTopics });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const createTopic = async (req, res) => {
    try {
        const { title, description } = req.body;
        const count = await Topic.countDocuments();
        const newTopic = await Topic.create({
            title: title || 'New Topic',
            description: description || '',
            order: count
        });
        res.status(201).json({
            success: true,
            data: {
                id: newTopic._id.toString(),
                title: newTopic.title,
                description: newTopic.description,
                subTopics: [],
                questions: []
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateTopic = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const topic = await Topic.findByIdAndUpdate(id, { title, description }, { new: true });
        if (!topic) return res.status(404).json({ success: false, error: 'Topic not found' });
        res.json({
            success: true, data: {
                id: topic._id.toString(),
                title: topic.title,
                description: topic.description
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteTopic = async (req, res) => {
    try {
        const { id } = req.params;
        const topic = await Topic.findById(id).populate('subTopics');
        if (topic) {
            const questionIds = [...topic.questions];
            topic.subTopics.forEach(st => questionIds.push(...st.questions));
            await Question.deleteMany({ _id: { $in: questionIds } });
            await SubTopic.deleteMany({ _id: { $in: topic.subTopics.map(st => st._id) } });
        }
        await Topic.findByIdAndDelete(id);
        res.json({ success: true, message: 'Topic deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const reorderTopics = async (req, res) => {
    try {
        const { orderedIds } = req.body;
        const updates = orderedIds.map((id, index) =>
            Topic.findByIdAndUpdate(id, { order: index })
        );
        await Promise.all(updates);
        res.json({ success: true, message: 'Topics reordered' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
