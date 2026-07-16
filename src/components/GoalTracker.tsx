import { Target, CheckCircle } from 'lucide-react';
import { LearningGoal } from '../contexts/AuthContext';

interface GoalTrackerProps {
  goals: LearningGoal[];
}

export function GoalTracker({ goals }: GoalTrackerProps) {
  if (!goals || goals.length === 0) {
    return (
      <div className="bg-white dark:bg-[#0F1615] rounded-[2rem] p-6 border border-gray-100 dark:border-white/5 shadow-sm text-center">
        <Target className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <h3 className="font-bold text-slate-900 dark:text-white text-lg">No Learning Goals Set</h3>
        <p className="text-sm text-gray-500 mt-2">Set goals to track your progress and stay motivated.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0F1615] rounded-[2rem] p-6 border border-gray-100 dark:border-white/5 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
        <h3 className="font-bold text-slate-900 dark:text-white text-lg">Learning Goals</h3>
      </div>
      
      <div className="space-y-6">
        {goals.map((goal) => {
          const completedCount = goal.completedSessionIds?.length || 0;
          const targetCount = goal.targetSessionCount || 1;
          const progressPercent = Math.min(100, Math.round((completedCount / targetCount) * 100));
          const isCompleted = completedCount >= targetCount;

          return (
            <div key={goal.id} className="group">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                    {goal.title}
                  </h4>
                  <div className="flex gap-2 items-center text-xs text-gray-500 mt-1">
                    <span className="bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">
                      {goal.category}
                    </span>
                    <span>•</span>
                    <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                  </div>
                </div>
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                ) : (
                  <span className="text-sm font-medium text-slate-700 dark:text-gray-300">
                    {completedCount} / {targetCount} sessions
                  </span>
                )}
              </div>
              
              <div className="h-2 w-full bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    isCompleted ? 'bg-emerald-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
