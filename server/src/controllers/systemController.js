import fs from 'fs';
import path from 'path';
import { Topic } from '../models/Topic.model.js';
import SubTopic from '../models/SubTopic.model.js';
import Question from '../models/Question.model.js';

export const resetProgress = async (req, res) => {
    try {
        await Question.updateMany({}, { isSolved: false });
        res.json({ success: true, message: 'All progress reset' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const fullReset = async (req, res) => {
    try {
        console.log('🧹 Clearing existing data for full reset...');
        await Question.deleteMany({});
        await SubTopic.deleteMany({});
        await Topic.deleteMany({});

        const filePath = path.join(process.cwd(), '..', 'sheet.json');
        if (!fs.existsSync(filePath)) {
            throw new Error('sheet.json not found in project root');
        }

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data } = JSON.parse(fileContent);
        const { questions } = data;

        console.log(`📦 Re-seeding ${questions.length} questions...`);

        const topicsMap = new Map();
        for (const q of questions) {
            const topicTitle = q.topic || 'General';
            const subTopicTitle = q.subTopic || 'Miscellaneous';
            if (!topicsMap.has(topicTitle)) topicsMap.set(topicTitle, new Map());
            const subTopicsMap = topicsMap.get(topicTitle);
            if (!subTopicsMap.has(subTopicTitle)) subTopicsMap.set(subTopicTitle, []);
            subTopicsMap.get(subTopicTitle).push(q);
        }

        const ALLOWED_PLATFORMS = ['leetcode', 'geeksforgeeks', 'codestudio', 'hackerrank', 'codechef', 'interviewbit', 'ninjas', 'other'];

        let topicOrder = 1;
        for (const [topicTitle, subTopicsMap] of topicsMap) {
            const topic = await Topic.create({
                title: topicTitle,
                order: topicOrder++,
                description: `Questions for ${topicTitle}`
            });

            let subTopicOrder = 1;
            for (const [subTopicTitle, qList] of subTopicsMap) {
                const subTopic = await SubTopic.create({
                    title: subTopicTitle,
                    order: subTopicOrder++
                });

                let questionOrder = 1;
                const questionIds = [];
                for (const qData of qList) {
                    const rawPlatform = qData.questionId?.platform;
                    const platform = ALLOWED_PLATFORMS.includes(rawPlatform) ? rawPlatform : 'other';

                    const question = await Question.create({
                        title: qData.title || qData.questionId?.name || 'Untitled Question',
                        isSolved: false,
                        difficulty: qData.questionId?.difficulty || 'Medium',
                        order: questionOrder++,
                        problemUrl: qData.questionId?.problemUrl || '#',
                        platform: platform,
                        resource: qData.resource || '#',
                        companyTags: qData.questionId?.companyTags || []
                    });
                    questionIds.push(question._id);
                }

                subTopic.questions = questionIds;
                await subTopic.save();
                topic.subTopics.push(subTopic._id);
            }
            await topic.save();
        }

        res.json({ success: true, message: 'Database fully reset and re-seeded' });
    } catch (error) {
        console.error('Full Reset Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
