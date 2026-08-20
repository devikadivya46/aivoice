import React, { useState } from 'react';
import { useJarvis } from '../../context/JarvisContext';
import { X, Calendar, Clock, Video, Users, MapPin, Sparkles } from 'lucide-react';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose }) => {
  const { addEvent, createMeeting } = useJarvis();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('11:00 AM');
  const [endTime, setEndTime] = useState('11:30 AM');
  const [category, setCategory] = useState<'meeting' | 'deep_work' | 'review' | 'standup'>('meeting');
  const [platform, setPlatform] = useState<'Google Meet' | 'Conference Room A' | 'Zoom' | 'In-Person'>('Google Meet');
  const [participants, setParticipants] = useState('Rahul Sharma, Priya Patel');
  const [description, setDescription] = useState('');
  const [createGoogleMeet, setCreateGoogleMeet] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const participantList = participants
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    await addEvent({
      title,
      date,
      startTime,
      endTime,
      category,
      platform,
      meetLink: createGoogleMeet ? 'https://meet.google.com/jrv-user-block' : undefined,
      participants: participantList,
      description,
    });

    if (createGoogleMeet || platform === 'Google Meet') {
      await createMeeting({
        title,
        date: 'Today',
        time: `${startTime} – ${endTime}`,
        duration: '30 mins',
        platform: 'Google Meet',
        status: 'upcoming',
        meetUrl: 'https://meet.google.com/jrv-user-block',
        participants: participantList.map((name) => ({
          name,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        })),
        agenda: description,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0F0F26] border border-purple-500/40 shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-950/70 border border-purple-500/30">
              <Calendar className="w-4 h-4 text-cyan-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create Schedule Block</h3>
              <p className="text-xs text-slate-400">JARVIS Smart Calendar Synchronization</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
          {/* Title */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Event Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AI Strategy Sync & Model Review"
              className="w-full px-3 py-2 rounded-xl bg-[#070714] border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Date & Times */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl bg-[#070714] border border-white/10 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Start Time</label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="10:00 AM"
                className="w-full px-3 py-2 rounded-xl bg-[#070714] border border-white/10 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">End Time</label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="10:30 AM"
                className="w-full px-3 py-2 rounded-xl bg-[#070714] border border-white/10 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Category & Platform */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#070714] border border-white/10 text-white focus:outline-none focus:border-purple-500"
              >
                <option value="meeting">Meeting</option>
                <option value="standup">Standup</option>
                <option value="deep_work">Deep Work / Focus</option>
                <option value="review">Review / Retro</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Platform</label>
              <select
                value={platform}
                onChange={(e: any) => setPlatform(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#070714] border border-white/10 text-white focus:outline-none focus:border-purple-500"
              >
                <option value="Google Meet">Google Meet</option>
                <option value="Conference Room A">Conference Room A</option>
                <option value="Zoom">Zoom</option>
                <option value="In-Person">In-Person</option>
              </select>
            </div>
          </div>

          {/* Participants */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Participants (comma separated)</label>
            <input
              type="text"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              placeholder="Rahul Sharma, Priya Patel, Amit Verma"
              className="w-full px-3 py-2 rounded-xl bg-[#070714] border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Description / Notes</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add agenda or context for attendees..."
              className="w-full px-3 py-2 rounded-xl bg-[#070714] border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {/* Google Meet Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-cyan-400" />
              <div>
                <p className="text-xs font-semibold text-white">Generate Google Meet Link</p>
                <p className="text-[10px] text-slate-400">Attach secure meeting room link automatically</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={createGoogleMeet}
              onChange={(e) => setCreateGoogleMeet(e.target.checked)}
              className="w-4 h-4 accent-purple-600 rounded"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold shadow-lg shadow-purple-600/30 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
