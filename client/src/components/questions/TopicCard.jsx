import React, { useState } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, KeyboardSensor } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, ChevronRight, BookOpen, GripVertical, Trash2, Plus, FolderOpen } from 'lucide-react';
import { QuestionItem } from './QuestionItem';
import { useQuestionStore } from '../../store/useQuestionStore';
import { AddQuestionModal } from '../ui/AddQuestionModal';

const SortableQuestionItem = ({ question, topicId, subTopicId }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: question._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 100ms ease',
    zIndex: isDragging ? 40 : 1,
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center group/question">
      <div {...attributes} {...listeners} className="drag-handle opacity-0 group-hover/question:opacity-100">
        <GripVertical className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1">
        <QuestionItem question={question} topicId={topicId} subTopicId={subTopicId} />
      </div>
    </div>
  );
};

const SortableSubTopicSection = ({ subTopic, topicId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);
  const addQuestion = useQuestionStore(state => state.addQuestion);
  const deleteSubTopic = useQuestionStore(state => state.deleteSubTopic);
  const reorderQuestions = useQuestionStore(state => state.reorderQuestions);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: subTopic.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 100ms ease',
    zIndex: isDragging ? 30 : 1,
    opacity: isDragging ? 0.7 : 1,
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleQuestionDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = subTopic.questions.findIndex(q => q._id === active.id);
      const newIndex = subTopic.questions.findIndex(q => q._id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderQuestions(topicId, subTopic.id, oldIndex, newIndex);
      }
    }
  };

  const handleAddQuestion = (questionData) => {
    addQuestion(topicId, subTopic.id, questionData);
  };

  const solvedCount = subTopic.questions.filter(q => q.isSolved).length;
  const progress = (solvedCount / subTopic.questions.length) * 100 || 0;

  return (
    <div ref={setNodeRef} style={style} className="glass-subtle overflow-hidden group/subtopic">
      <div className="flex items-center">
        <div {...attributes} {...listeners} className="drag-handle opacity-0 group-hover/subtopic:opacity-100">
          <GripVertical className="w-4 h-4" />
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex-1 flex items-center justify-between p-3 pl-1 text-left hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-secondary/10">
              <FolderOpen className="w-4 h-4 text-brand-secondary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-200">{subTopic.title}</h3>
              <p className="text-xs text-slate-500">{solvedCount} / {subTopic.questions.length} solved</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-24 progress-bar hidden sm:block">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            {isOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
          </div>
        </button>

        <div className="flex gap-1 pr-3 opacity-0 group-hover/subtopic:opacity-100 transition-opacity">
          <button onClick={() => setIsAddQuestionOpen(true)} className="btn-icon" title="Add Question">
            <Plus className="w-4 h-4" />
          </button>
          <button onClick={() => deleteSubTopic(topicId, subTopic.id)} className="btn-danger" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-3 pt-0 border-t border-white/5 animate-fade-in">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleQuestionDragEnd}>
            <SortableContext items={subTopic.questions.map(q => q._id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-1 mt-3">
                {subTopic.questions.map(q => (
                  <SortableQuestionItem key={q._id} question={q} topicId={topicId} subTopicId={subTopic.id} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          {subTopic.questions.length === 0 && (
            <p className="text-xs text-slate-600 italic py-4 text-center">No questions yet</p>
          )}
        </div>
      )}

      <AddQuestionModal
        isOpen={isAddQuestionOpen}
        onClose={() => setIsAddQuestionOpen(false)}
        onSubmit={handleAddQuestion}
      />
    </div>
  );
};

export const TopicCard = ({ topic }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);
  const deleteTopic = useQuestionStore(state => state.deleteTopic);
  const addSubTopic = useQuestionStore(state => state.addSubTopic);
  const addQuestion = useQuestionStore(state => state.addQuestion);
  const reorderSubTopics = useQuestionStore(state => state.reorderSubTopics);
  const reorderQuestions = useQuestionStore(state => state.reorderQuestions);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: topic.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 100ms ease',
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.85 : 1,
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleSubTopicDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = topic.subTopics.findIndex(st => st.id === active.id);
      const newIndex = topic.subTopics.findIndex(st => st.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderSubTopics(topic.id, oldIndex, newIndex);
      }
    }
  };

  const handleQuestionDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = topic.questions.findIndex(q => q._id === active.id);
      const newIndex = topic.questions.findIndex(q => q._id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderQuestions(topic.id, null, oldIndex, newIndex);
      }
    }
  };

  const handleAddQuestion = (questionData) => {
    addQuestion(topic.id, null, questionData);
  };

  const totalQuestions = (topic.questions?.length || 0) +
    (topic.subTopics?.reduce((acc, st) => acc + (st.questions?.length || 0), 0) || 0);
  const solvedQuestions = (topic.questions?.filter(q => q.isSolved).length || 0) +
    (topic.subTopics?.reduce((acc, st) => acc + (st.questions?.filter(q => q.isSolved).length || 0), 0) || 0);
  const progress = totalQuestions > 0 ? (solvedQuestions / totalQuestions) * 100 : 0;

  return (
    <div ref={setNodeRef} style={style} className="glass glass-hover group/topic animate-fade-in">
      <div className="flex items-center">
        <div {...attributes} {...listeners} className="drag-handle opacity-50 group-hover/topic:opacity-100 ml-2">
          <GripVertical className="w-5 h-5" />
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex-1 flex items-center justify-between p-4 pl-2 text-left"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 border border-brand-primary/10">
              <BookOpen className="w-5 h-5 text-brand-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">{topic.title}</h2>
              <div className="flex flex-col">
                <p className="text-sm text-slate-500">
                  {solvedQuestions} / {totalQuestions} solved
                  {topic.subTopics?.length > 0 && ` • ${topic.subTopics.length} sub-topics`}
                </p>
                {topic.description && (
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1 max-w-md">
                    {topic.description}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3">
              <div className="w-32 progress-bar">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-sm font-medium text-slate-400 w-12">{Math.round(progress)}%</span>
            </div>
            <div className={`p-2 rounded-lg transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-5 h-5 text-slate-500" />
            </div>
          </div>
        </button>

        <div className="flex gap-1 pr-4 opacity-0 group-hover/topic:opacity-100 transition-opacity">
          <button onClick={() => addSubTopic(topic.id, "New Sub-Topic")} className="btn-icon" title="Add Sub-Topic">
            <FolderOpen className="w-4 h-4" />
          </button>
          <button onClick={() => setIsAddQuestionOpen(true)} className="btn-icon" title="Add Question">
            <Plus className="w-4 h-4" />
          </button>
          <button onClick={() => deleteTopic(topic.id)} className="btn-danger" title="Delete Topic">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="px-4 pb-4 space-y-3 animate-fade-in">
          {topic.subTopics?.length > 0 && (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSubTopicDragEnd}>
              <SortableContext items={topic.subTopics.map(st => st.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {topic.subTopics.map(st => (
                    <SortableSubTopicSection key={st.id} subTopic={st} topicId={topic.id} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          {topic.questions?.length > 0 && (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleQuestionDragEnd}>
              <SortableContext items={topic.questions.map(q => q._id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-1 pt-2 border-t border-white/5">
                  {topic.questions.map(q => (
                    <SortableQuestionItem key={q._id} question={q} topicId={topic.id} subTopicId={null} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          {(!topic.questions?.length && !topic.subTopics?.length) && (
            <div className="text-center py-8 text-slate-600">
              <p className="text-sm">No content yet. Add a sub-topic or question to get started.</p>
            </div>
          )}
        </div>
      )}

      <AddQuestionModal
        isOpen={isAddQuestionOpen}
        onClose={() => setIsAddQuestionOpen(false)}
        onSubmit={handleAddQuestion}
      />
    </div>
  );
};