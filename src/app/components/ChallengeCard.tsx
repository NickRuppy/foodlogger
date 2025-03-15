import { Challenge } from '@/lib/types';

interface ChallengeCardProps {
  challenge: Challenge;
}

export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  const progress = (challenge.progress / challenge.goal) * 100;
  
  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-1">{challenge.name}</h3>
          <p className="text-gray-600 text-sm mb-4">{challenge.description}</p>
        </div>
        {challenge.completed && (
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
            Completed!
          </span>
        )}
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
        <div 
          className={`h-2.5 rounded-full transition-all duration-500 ${
            challenge.completed ? 'bg-green-500' : 'bg-blue-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">
          {challenge.progress} of {challenge.goal} completed
        </span>
        <span className="text-gray-500">
          {progress.toFixed(0)}%
        </span>
      </div>
      
      {/* Challenge type indicator */}
      <div className="mt-4 flex gap-2">
        <span className={`
          text-xs px-2 py-1 rounded
          ${challenge.type === 'cuisine' ? 'bg-purple-100 text-purple-800' : ''}
          ${challenge.type === 'restaurant' ? 'bg-blue-100 text-blue-800' : ''}
          ${challenge.type === 'rating' ? 'bg-yellow-100 text-yellow-800' : ''}
          ${challenge.type === 'dish' ? 'bg-green-100 text-green-800' : ''}
        `}>
          {challenge.type.charAt(0).toUpperCase() + challenge.type.slice(1)}
        </span>
      </div>
    </div>
  );
} 