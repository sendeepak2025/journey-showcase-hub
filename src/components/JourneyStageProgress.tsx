
import React from 'react';
import { User, Clock, FileText } from 'lucide-react';

type JourneyStageProgressProps = {
  stages: {
    name: 'Awareness' | 'Consideration' | 'Quote';
    value: number;
    isActive?: boolean;
  }[];
};

const JourneyStageProgress: React.FC<JourneyStageProgressProps> = ({ stages }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Awareness':
        return <User className="w-5 h-5" />;
      case 'Consideration':
        return <Clock className="w-5 h-5" />;
      case 'Quote':
        return <FileText className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getBgColor = (value: number, isActive?: boolean) => {
    if (!isActive) return 'bg-gray-100 text-gray-400';
    
    if (value >= 80) return 'bg-purple-900 text-white';
    if (value >= 60) return 'bg-purple-700 text-white';
    return 'bg-purple-500 text-white';
  };

  return (
    <div className="flex items-center w-full mb-8 space-x-2">
      {stages.map((stage, index) => (
        <React.Fragment key={stage.name}>
          <div className={`flex items-center justify-center rounded-md px-4 py-2 ${getBgColor(stage.value, stage.isActive)}`}>
            <div className="flex items-center">
              {getIcon(stage.name)}
              <span className="ml-2 text-sm font-medium">{stage.name}</span>
              <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded text-xs">{stage.value}%</span>
            </div>
          </div>
          
          {index < stages.length - 1 && (
            <div className="w-8 h-px bg-gray-300 flex-shrink-0"></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default JourneyStageProgress;
