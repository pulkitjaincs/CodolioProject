import { Router } from 'express';
import topicRoutes from './topicRoutes.js';
import subTopicRoutes from './subTopicRoutes.js';
import questionRoutes from './questionRoutes.js';
import { Topic } from '../models/Topic.model.js';
import SubTopic from '../models/SubTopic.model.js';
import Question from '../models/Question.model.js';

const router = Router();

router.use('/topics', topicRoutes);
router.use('/topics/:topicId/subtopics', subTopicRoutes);
router.use('/topics/:topicId/subtopics/:subTopicId/questions', questionRoutes);
router.use('/topics/:topicId/questions', questionRoutes);

router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.delete('/reset', async (req, res) => {
    try {
        await Question.deleteMany({});
        await SubTopic.deleteMany({});
        await Topic.deleteMany({});
        res.json({ success: true, message: 'Database cleared' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/stats', async (req, res) => {
    try {
        const topics = await Topic.find()
            .populate({ path: 'subTopics', populate: { path: 'questions' } })
            .populate('questions');

        let totalQuestions = 0, solvedQuestions = 0;
        topics.forEach(t => {
            t.questions.forEach(q => { totalQuestions++; if (q.isSolved) solvedQuestions++; });
            t.subTopics.forEach(st => {
                st.questions.forEach(q => { totalQuestions++; if (q.isSolved) solvedQuestions++; });
            });
        });

        res.json({
            success: true,
            data: {
                topics: topics.length,
                questions: totalQuestions,
                solved: solvedQuestions,
                progress: totalQuestions > 0 ? Math.round((solvedQuestions / totalQuestions) * 100) : 0
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
