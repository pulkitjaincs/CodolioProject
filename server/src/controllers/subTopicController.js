import { Topic } from '../models/Topic.model.js';
import SubTopic from '../models/SubTopic.model.js';

export const createSubTopic = async (req, res) => {
    try {
        const { topicId } = req.params;
        const { title } = req.body;

        const topic = await Topic.findById(topicId);
        if (!topic) return res.status(404).json({ success: false, error: 'Topic not found' });

        const newSubTopic = await SubTopic.create({ title: title || 'New Sub-Topic', questions: [] });
        topic.subTopics.push(newSubTopic._id);
        await topic.save();

        res.status(201).json({
            success: true,
            data: { id: newSubTopic._id.toString(), title: newSubTopic.title, questions: [] }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateSubTopic = async (req, res) => {
    try {
        const { subTopicId } = req.params;
        const { title } = req.body;

        const subTopic = await SubTopic.findByIdAndUpdate(subTopicId, { title }, { new: true });
        if (!subTopic) return res.status(404).json({ success: false, error: 'Sub-topic not found' });

        res.json({ success: true, data: { id: subTopic._id.toString(), title: subTopic.title } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteSubTopic = async (req, res) => {
    try {
        const { topicId, subTopicId } = req.params;

        const topic = await Topic.findById(topicId);
        if (!topic) return res.status(404).json({ success: false, error: 'Topic not found' });

        topic.subTopics.pull(subTopicId);
        await topic.save();
        await SubTopic.findByIdAndDelete(subTopicId);

        res.json({ success: true, message: 'Sub-topic deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const reorderSubTopics = async (req, res) => {
    try {
        const { topicId } = req.params;
        const { orderedIds } = req.body;

        const topic = await Topic.findById(topicId);
        if (!topic) return res.status(404).json({ success: false, error: 'Topic not found' });

        topic.subTopics = orderedIds;
        await topic.save();
        res.json({ success: true, message: 'Sub-topics reordered' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
