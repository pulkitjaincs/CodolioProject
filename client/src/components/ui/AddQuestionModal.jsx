import React, { useState } from 'react';
import { Modal } from './Modal';
import { LinkIcon, Youtube, Building2, Globe } from 'lucide-react';

export const AddQuestionModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: '',
        problemUrl: '',
        difficulty: 'Medium',
        platform: 'leetcode',
        resource: '',
        companyTags: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title.trim()) return;

        // Process company tags string to array
        const tagsArray = formData.companyTags
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag !== '');

        onSubmit({
            ...formData,
            companyTags: tagsArray
        });

        setFormData({
            title: '',
            problemUrl: '',
            difficulty: 'Medium',
            platform: 'leetcode',
            resource: '',
            companyTags: ''
        });
        onClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Question">
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                        Question Title *
                    </label>
                    <input
                        autoFocus
                        type="text"
                        name="title"
                        placeholder="e.g. Two Sum"
                        className="input-field"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                            Platform
                        </label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <select
                                name="platform"
                                className="input-field pl-10 appearance-none"
                                value={formData.platform}
                                onChange={handleChange}
                            >
                                <option value="leetcode">LeetCode</option>
                                <option value="geeksforgeeks">GFG</option>
                                <option value="codestudio">CodeStudio</option>
                                <option value="hackerrank">HackerRank</option>
                                <option value="codechef">CodeChef</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                            Difficulty
                        </label>
                        <select
                            name="difficulty"
                            className="input-field"
                            value={formData.difficulty}
                            onChange={handleChange}
                        >
                            <option value="Basic">Basic</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                        Problem URL
                    </label>
                    <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="url"
                            name="problemUrl"
                            placeholder="https://leetcode.com/problems/..."
                            className="input-field pl-10"
                            value={formData.problemUrl}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                        Resource (Video/Tutorial)
                    </label>
                    <div className="relative">
                        <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="url"
                            name="resource"
                            placeholder="https://youtube.com/watch?v=..."
                            className="input-field pl-10"
                            value={formData.resource}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                        Company Tags (comma separated)
                    </label>
                    <div className="relative">
                        <Building2 className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                        <textarea
                            name="companyTags"
                            placeholder="Amazon, Google, Microsoft..."
                            className="input-field pl-10 min-h-[80px] resize-none"
                            value={formData.companyTags}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <button type="submit" className="btn-primary w-full mt-6">
                    Add Question
                </button>
            </form>
        </Modal>
    );
};
