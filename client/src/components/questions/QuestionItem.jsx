import { useState } from 'react';
import { ExternalLink, Check, Trash2, Youtube, Building2, Pencil, Star, StickyNote, PlayCircle, BookOpen } from 'lucide-react';
import { useQuestionStore } from '../../store/useQuestionStore';
import { AddQuestionModal } from '../ui/AddQuestionModal';

export const QuestionItem = ({ question, topicId, subTopicId }) => {
    const toggleSolved = useQuestionStore(state => state.toggleSolved);
    const toggleStarred = useQuestionStore(state => state.toggleStarred);
    const updateNotes = useQuestionStore(state => state.updateNotes);
    const deleteQuestion = useQuestionStore(state => state.deleteQuestion);
    const editQuestion = useQuestionStore(state => state.editQuestion);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const [noteText, setNoteText] = useState(question.notes || '');

    const difficultyClass = {
        'Basic': 'badge-easy bg-brand-accent/15 text-brand-accent border-brand-accent/20',
        'Easy': 'badge-easy',
        'Medium': 'badge-medium',
        'Hard': 'badge-hard'
    }[question.questionId?.difficulty] || 'badge-medium';

    const companies = question.questionId?.companyTags || [];

    const handleEditSubmit = (updatedData) => {
        editQuestion(topicId, subTopicId, question._id, {
            title: updatedData.title,
            questionId: {
                difficulty: updatedData.difficulty,
                problemUrl: updatedData.problemUrl,
                platform: updatedData.platform,
                resource: updatedData.resource,
                companyTags: updatedData.companyTags
            }
        });
    };

    return (
        <div className="flex flex-col py-2 px-3 rounded-lg hover:bg-white/[0.03] transition-all group/item border border-transparent hover:border-white/5">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => toggleSolved(topicId, subTopicId, question._id)}
                    className={`checkbox-solved flex-shrink-0 ${question.isSolved ? 'checked' : ''}`}
                >
                    {question.isSolved && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                </button>

                <button
                    onClick={() => toggleStarred(topicId, subTopicId, question._id)}
                    className={`flex-shrink-0 transition-colors ${question.isStarred ? 'text-yellow-400' : 'text-slate-600 hover:text-slate-400'}`}
                >
                    <Star className={`w-4 h-4 ${question.isStarred ? 'fill-current' : ''}`} />
                </button>

                <div className="flex-1 min-w-0">
                    <span className={`text-sm ${question.isSolved ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                        {question.title}
                    </span>
                    {question.questionId?.platform && (
                        <span className="ml-2 text-[10px] uppercase tracking-wider text-slate-600 font-bold px-1.5 py-0.5 rounded bg-white/5">
                            {question.questionId.platform}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <span className={`badge ${difficultyClass}`}>
                        {question.questionId?.difficulty || 'Medium'}
                    </span>

                    {question.questionId?.resource && question.questionId.resource !== '#' && (
                        <a
                            href={question.questionId.resource}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-red-500/70 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                            title="Visit Resource"
                        >
                            {question.questionId.resource.includes('youtube.com') || question.questionId.resource.includes('youtu.be') ? (
                                <Youtube className="w-4 h-4" />
                            ) : (
                                <BookOpen className="w-4 h-4" />
                            )}
                        </a>
                    )}

                    {question.questionId?.problemUrl && question.questionId.problemUrl !== '#' && (
                        <a
                            href={question.questionId.problemUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-brand-primary/70 hover:bg-brand-primary/10 hover:text-brand-primary transition-colors"
                            title="Solve Challenge"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}

                    <div className="flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                        <button
                            onClick={() => setIsNotesOpen(!isNotesOpen)}
                            className={`p-1.5 rounded-lg transition-colors ${isNotesOpen || question.notes ? 'text-brand-accent bg-brand-accent/10' : 'text-slate-500 hover:bg-white/10 hover:text-white'}`}
                            title="Add Note"
                        >
                            <StickyNote className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-white/10 hover:text-white transition-colors"
                            title="Edit"
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => deleteQuestion(topicId, subTopicId, question._id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-danger/10 hover:text-danger transition-colors"
                            title="Delete"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {isNotesOpen && (
                <div className="mt-2 ml-8 animate-fade-in">
                    <textarea
                        autoFocus
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        onBlur={() => updateNotes(topicId, subTopicId, question._id, noteText)}
                        placeholder="Add a private note for this question..."
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/20 transition-all resize-none min-h-[60px]"
                    />
                    <div className="flex justify-end mt-1">
                        <span className="text-[10px] text-slate-600">Auto-saves on blur</span>
                    </div>
                </div>
            )}

            {companies.length > 0 && (
                <div className="flex items-center gap-1.5 mt-2 ml-8 flex-wrap">
                    <Building2 className="w-3 h-3 text-slate-600" />
                    {companies.slice(0, 5).map((company, idx) => (
                        <span key={idx} className="text-[10px] text-slate-500 px-1.5 py-0.5 rounded-md bg-white/[0.02] border border-white/5">
                            {company}
                        </span>
                    ))}
                    {companies.length > 5 && (
                        <span className="text-[10px] text-slate-600">+{companies.length - 5} more</span>
                    )}
                </div>
            )}

            <AddQuestionModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                mode="edit"
                initialData={question}
                onSubmit={handleEditSubmit}
            />
        </div>
    );
};
