import React, { useState } from 'react';
import { useJarvis } from '../../context/JarvisContext';
import { GlassCard } from '../shared/GlassCard';
import { TaskCompletionDonutChart } from '../shared/TaskCompletionDonutChart';
import { Task } from '../../types';
import {
  CheckSquare,
  Plus,
  Zap,
  Check,
  Trash2,
  Clock,
  User,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Search,
  CheckCircle2,
  Layers,
} from 'lucide-react';

export const TasksScreen: React.FC = () => {
  const {
    tasks,
    addTask,
    toggleCompleteTask,
    deleteTask,
    toggleSubtask,
    addSubtask,
    breakdownTaskWithAi,
    runTaskDelegation,
    delegationProgress,
    setCurrentScreen,
  } = useJarvis();

  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'completed' | 'overdue'>('today');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [newSubtaskInputs, setNewSubtaskInputs] = useState<Record<string, string>>({});

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<'Engineering' | 'Product' | 'Operations' | 'Design'>('Engineering');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('high');

  const filteredTasks = tasks.filter((t) => {
    if (t.status !== activeTab) return false;
    if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.assignee && t.assignee.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    await addTask({
      title: newTaskTitle,
      priority: newTaskPriority,
      dueDate: activeTab === 'today' ? 'Today 5:00 PM' : 'Tomorrow',
      category: newTaskCategory,
      progress: 0,
      status: activeTab === 'completed' ? 'today' : activeTab,
      assignee: 'Harsh',
      subtasks: [],
    });

    setNewTaskTitle('');
  };

  const handleAddSubtask = async (taskId: string) => {
    const text = newSubtaskInputs[taskId]?.trim();
    if (!text) return;
    await addSubtask(taskId, text);
    setNewSubtaskInputs((prev) => ({ ...prev, [taskId]: '' }));
  };

  const toggleExpand = (taskId: string) => {
    setExpandedTaskId((prev) => (prev === taskId ? null : taskId));
  };

  return (
    <div id="tasks-screen" className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-400 font-mono">
              ORCHESTRATION & DELEGATION
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Tasks & AI Delegation
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Autonomous priority ranking, subtask breakdowns, and interactive follow-ups.
          </p>
        </div>

        {/* Quick Delegation CTA */}
        <button
          onClick={() => runTaskDelegation('Prepare my team update')}
          disabled={delegationProgress.active}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-magenta-500 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-xs font-extrabold shadow-lg shadow-purple-600/30 active:scale-95 transition-all disabled:opacity-50"
        >
          <Zap className="w-4 h-4 text-cyan-200" />
          <span>{delegationProgress.active ? 'Delegating...' : 'Delegate Team Update to JARVIS'}</span>
        </button>
      </div>

      {/* AI DELEGATION LIVE PIPELINE CARD */}
      {delegationProgress.active || delegationProgress.step ? (
        <div className="rounded-2xl border border-purple-500/40 bg-gradient-to-r from-[#190F2E] via-[#121225] to-[#0A0A18] p-5 shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin duration-3000" />
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-purple-300 font-mono">
                DELEGATE TO JARVIS PIPELINE
              </h4>
            </div>
            <span className="text-xs font-bold text-cyan-300 font-mono">
              {delegationProgress.progress}%
            </span>
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-white">
              Task: "Prepare my team update and sprint blocker report"
            </p>
            <p className="text-xs text-slate-300 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              Status: <span className="text-cyan-300 font-bold">{delegationProgress.step}</span>
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${delegationProgress.progress}%` }}
            />
          </div>

          {delegationProgress.step.includes('ready') && (
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-emerald-400 font-semibold">
                ✓ Team update successfully compiled and synced with HRMS.
              </span>
              <button
                onClick={() => setCurrentScreen('hrms')}
                className="flex items-center gap-1 text-xs text-purple-300 hover:text-purple-200 font-bold"
              >
                View HRMS Update <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      ) : null}

      {/* Recharts Task Completion Donut Chart */}
      <TaskCompletionDonutChart tasks={tasks} />

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {(['today', 'upcoming', 'completed', 'overdue'] as const).map((tab) => {
            const count = tasks.filter((t) => t.status === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    activeTab === tab ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Category Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-purple-400"
          >
            <option value="all">All Categories</option>
            <option value="Engineering">Engineering</option>
            <option value="Product">Product</option>
            <option value="Operations">Operations</option>
            <option value="Design">Design</option>
          </select>
        </div>
      </div>

      {/* Add Task Bar */}
      <form
        onSubmit={handleCreateTask}
        className="flex flex-col sm:flex-row items-center gap-2 p-2 rounded-2xl bg-[#0B0B18] border border-white/10"
      >
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder={`Add new task to ${activeTab}... (JARVIS will ask follow-up questions)`}
          className="flex-1 w-full bg-transparent px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none"
        />

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={newTaskCategory}
            onChange={(e: any) => setNewTaskCategory(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 focus:outline-none"
          >
            <option value="Engineering">Engineering</option>
            <option value="Product">Product</option>
            <option value="Operations">Operations</option>
            <option value="Design">Design</option>
          </select>

          <select
            value={newTaskPriority}
            onChange={(e: any) => setNewTaskPriority(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 focus:outline-none"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <button
            type="submit"
            disabled={!newTaskTitle.trim()}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold shadow-md disabled:opacity-40 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </form>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-16 p-6 rounded-2xl bg-[#0B0B18] border border-white/10">
          <CheckSquare className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-300">No {activeTab} tasks found</h4>
          <p className="text-xs text-slate-500 mt-1">Add a new item above or delegate to JARVIS.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const isExpanded = expandedTaskId === task.id;
            const subtasks = task.subtasks || [];
            const completedSubCount = subtasks.filter((s) => s.completed).length;

            return (
              <GlassCard
                key={task.id}
                glowColor={task.priority === 'high' ? 'magenta' : 'purple'}
                className="p-4 sm:p-5 flex flex-col gap-3 group transition-all"
              >
                {/* Main Task Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left Details */}
                  <div className="flex items-start gap-3">
                    {/* Complete checkbox button */}
                    <button
                      onClick={() => toggleCompleteTask(task.id)}
                      className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                        task.status === 'completed'
                          ? 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                          : 'border-white/20 hover:border-purple-400 bg-white/5'
                      }`}
                      title={task.status === 'completed' ? 'Mark active' : 'Mark completed'}
                    >
                      {task.status === 'completed' && <Check className="w-3.5 h-3.5" />}
                    </button>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4
                          className={`text-sm font-bold ${
                            task.status === 'completed' ? 'line-through text-slate-500' : 'text-white'
                          }`}
                        >
                          {task.title}
                        </h4>

                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            task.priority === 'high'
                              ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                              : 'bg-purple-950/80 text-purple-300 border border-purple-500/40'
                          }`}
                        >
                          {task.priority} Priority
                        </span>

                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                          {task.category}
                        </span>

                        {subtasks.length > 0 && (
                          <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/70 text-cyan-300 border border-cyan-500/30">
                            <Layers className="w-2.5 h-2.5" />
                            {completedSubCount}/{subtasks.length} subtasks
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-purple-400" />
                          {task.dueDate}
                        </span>
                        {task.assignee && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5 text-cyan-400" />
                              {task.assignee}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Progress bar, AI Breakdown, Expand & Actions */}
                  <div className="flex items-center gap-2.5 self-end sm:self-center w-full sm:w-auto">
                    <div className="w-full sm:w-28 space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Progress</span>
                        <span className="font-mono text-purple-300 font-bold">{task.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* AI Subtask Decompose Button */}
                    <button
                      onClick={() => breakdownTaskWithAi(task.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-500/30 hover:border-cyan-400/50 text-[11px] font-bold text-cyan-300 hover:text-white transition-colors"
                      title="Generate subtasks with Gemini AI"
                    >
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span className="hidden sm:inline">AI Breakdown</span>
                    </button>

                    {/* Expand Subtasks */}
                    <button
                      onClick={() => toggleExpand(task.id)}
                      className="flex items-center gap-1 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
                      title="View subtasks"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 rounded-xl hover:bg-rose-950/40 border border-transparent hover:border-rose-500/30 text-slate-500 hover:text-rose-300 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subtasks Accordion Section */}
                {isExpanded && (
                  <div className="mt-2 pt-3 border-t border-white/10 space-y-2.5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300 font-mono">
                        Subtasks & Checklist ({completedSubCount}/{subtasks.length})
                      </span>
                    </div>

                    {/* Subtask list */}
                    {subtasks.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">
                        No subtasks added yet. Click 'AI Breakdown' or add one below.
                      </p>
                    ) : (
                      <div className="space-y-1.5">
                        {subtasks.map((sub) => (
                          <div
                            key={sub.id}
                            onClick={() => toggleSubtask(task.id, sub.id)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-colors"
                          >
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                sub.completed
                                  ? 'bg-cyan-500 border-cyan-400 text-white'
                                  : 'border-white/20 bg-white/5'
                              }`}
                            >
                              {sub.completed && <Check className="w-2.5 h-2.5" />}
                            </div>
                            <span
                              className={`text-xs ${
                                sub.completed ? 'line-through text-slate-500' : 'text-slate-200'
                              }`}
                            >
                              {sub.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Subtask Input */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={newSubtaskInputs[task.id] || ''}
                        onChange={(e) =>
                          setNewSubtaskInputs((prev) => ({ ...prev, [task.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSubtask(task.id);
                          }
                        }}
                        placeholder="Add subtask and press Enter..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddSubtask(task.id)}
                        disabled={!newSubtaskInputs[task.id]?.trim()}
                        className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold disabled:opacity-40 transition-colors"
                      >
                        + Subtask
                      </button>
                    </div>
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
};
