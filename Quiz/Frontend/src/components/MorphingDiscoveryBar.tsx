import React from 'react';
import { Icon } from './Icons';
import { CustomDropdown, DropdownOption } from './CustomDropdown';

interface MorphingDiscoveryBarProps {
  categories: { id: string; label: string; icon: string }[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  difficultyFilter: string;
  onDifficultyChange: (diff: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const DIFFICULTY_OPTIONS: DropdownOption[] = [
  { value: 'All', label: 'All Difficulties', badge: 'Any', badgeColor: 'bg-slate-800 text-slate-300 border-slate-700' },
  { value: 'Easy', label: 'Easy (Foundational)', badge: 'Beginner', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { value: 'Medium', label: 'Medium (Intermediate)', badge: 'Core', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { value: 'Hard', label: 'Hard (Advanced)', badge: 'Senior', badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
];

const SORT_OPTIONS: DropdownOption[] = [
  { value: 'default', label: 'Default Order' },
  { value: 'title-asc', label: 'Title: A to Z' },
  { value: 'title-desc', label: 'Title: Z to A' },
  { value: 'time-asc', label: 'Time: Shortest First' },
  { value: 'time-desc', label: 'Time: Longest First' },
];

export const MorphingDiscoveryBar: React.FC<MorphingDiscoveryBarProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  difficultyFilter,
  onDifficultyChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto mb-10 px-4">
      {/* Category Tabs (StageLink Style Pill Bar) */}
      <div className="flex items-center justify-center flex-wrap gap-2 mb-6">
        {categories.map(cat => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-violet-600 text-white shadow-lg glow-violet border border-violet-400/50 scale-105'
                  : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white border border-white/[0.06]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search, Filter & Sort Controls Row */}
      <div className="glass-panel p-3 rounded-2xl flex flex-col md:flex-row items-center gap-3">
        {/* Instant Search Bar */}
        <div className="relative flex-1 w-full">
          <Icon.Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search quizzes by title, topic, or keyword (e.g. HTML, OOP, SQL, DSA)..."
            className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <Icon.X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Custom Difficulty & Sort Dropdowns */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="w-full sm:w-48">
            <CustomDropdown
              value={difficultyFilter}
              onChange={onDifficultyChange}
              options={DIFFICULTY_OPTIONS}
              icon={<Icon.Filter className="w-3.5 h-3.5" />}
            />
          </div>

          <div className="w-full sm:w-48">
            <CustomDropdown
              value={sortBy}
              onChange={onSortChange}
              options={SORT_OPTIONS}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
