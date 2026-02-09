import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useQuestionStore = create(
    persist(
        (set) => ({
            topics: [],
            loading: false,

            setTopics: (topics) => set({ topics }),


            addTopic: (title, description = '') => set((state) => ({
                topics: [...state.topics, { id: crypto.randomUUID(), title, description, subTopics: [], questions: [] }]
            })),
            deleteTopic: (topicId) => set((state) => ({
                topics: state.topics.filter(t => t.id !== topicId)
            })),
            editTopic: (topicId, newTitle, newDescription) => set((state) => ({
                topics: state.topics.map(t => t.id === topicId ? { ...t, title: newTitle, description: newDescription } : t)
            })),

            addSubTopic: (topicId, title) => set((state) => ({
                topics: state.topics.map(t => t.id === topicId ? {
                    ...t,
                    subTopics: [...t.subTopics, { id: crypto.randomUUID(), title, questions: [] }]
                } : t)
            })),

            deleteSubTopic: (topicId, subTopicId) => set((state) => ({
                topics: state.topics.map(t => t.id === topicId ? {
                    ...t,
                    subTopics: t.subTopics.filter(st => st.id !== subTopicId)
                } : t)
            })),

            addQuestion: (topicId, subTopicId, questionData) => set((state) => {
                const newQuestion = {
                    _id: crypto.randomUUID(),
                    title: questionData.title || 'New Question',
                    isSolved: false,
                    questionId: {
                        difficulty: questionData.difficulty || 'Medium',
                        problemUrl: questionData.problemUrl || '#',
                        platform: questionData.platform || 'leetcode',
                        resource: questionData.resource || '#',
                        companyTags: questionData.companyTags || []
                    }
                };

                const newTopics = state.topics.map(topic => {
                    if (topic.id !== topicId) return topic;

                    if (!subTopicId) {
                        return { ...topic, questions: [...topic.questions, newQuestion] };
                    }

                    return {
                        ...topic,
                        subTopics: topic.subTopics.map(st =>
                            st.id === subTopicId
                                ? { ...st, questions: [...st.questions, newQuestion] }
                                : st
                        )
                    };
                });
                return { topics: newTopics };
            }),

            deleteQuestion: (topicId, subTopicId, questionId) => set((state) => {
                const newTopics = state.topics.map(topic => {
                    if (topic.id !== topicId) return topic;

                    if (!subTopicId) {
                        return { ...topic, questions: topic.questions.filter(q => q._id !== questionId) };
                    }

                    return {
                        ...topic,
                        subTopics: topic.subTopics.map(st =>
                            st.id === subTopicId
                                ? { ...st, questions: st.questions.filter(q => q._id !== questionId) }
                                : st
                        )
                    };
                });
                return { topics: newTopics };
            }),

            toggleSolved: (topicId, subTopicId, questionId) => set((state) => {
                const newTopics = state.topics.map(topic => {
                    if (topic.id !== topicId) return topic;

                    if (!subTopicId) {
                        return {
                            ...topic,
                            questions: topic.questions.map(q =>
                                q._id === questionId ? { ...q, isSolved: !q.isSolved } : q
                            )
                        };
                    }

                    return {
                        ...topic,
                        subTopics: topic.subTopics.map(st =>
                            st.id === subTopicId
                                ? { ...st, questions: st.questions.map(q => q._id === questionId ? { ...q, isSolved: !q.isSolved } : q) }
                                : st
                        )
                    };
                });
                return { topics: newTopics };
            }),

            reorderTopics: (startIndex, endIndex) => set((state) => {
                const newTopics = [...state.topics];
                const [removed] = newTopics.splice(startIndex, 1);
                newTopics.splice(endIndex, 0, removed);
                return { topics: newTopics };
            }),

            reorderSubTopics: (topicId, startIndex, endIndex) => set((state) => ({
                topics: state.topics.map(topic => {
                    if (topic.id !== topicId) return topic;
                    const newSubTopics = [...topic.subTopics];
                    const [removed] = newSubTopics.splice(startIndex, 1);
                    newSubTopics.splice(endIndex, 0, removed);
                    return { ...topic, subTopics: newSubTopics };
                })
            })),

            reorderQuestions: (topicId, subTopicId, startIndex, endIndex) => set((state) => ({
                topics: state.topics.map(topic => {
                    if (topic.id !== topicId) return topic;

                    if (!subTopicId) {
                        const newQuestions = [...topic.questions];
                        const [removed] = newQuestions.splice(startIndex, 1);
                        newQuestions.splice(endIndex, 0, removed);
                        return { ...topic, questions: newQuestions };
                    }

                    return {
                        ...topic,
                        subTopics: topic.subTopics.map(st => {
                            if (st.id !== subTopicId) return st;
                            const newQuestions = [...st.questions];
                            const [removed] = newQuestions.splice(startIndex, 1);
                            newQuestions.splice(endIndex, 0, removed);
                            return { ...st, questions: newQuestions };
                        })
                    };
                })
            })),

            resetStore: () => set({ topics: [] }),
        }),
        { name: 'codolio-questions-storage' }
    )
);