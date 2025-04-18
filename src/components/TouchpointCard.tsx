
import React from 'react';
import { Clock } from 'lucide-react';

type TouchpointCardProps = {
  number: number;
  title: string;
  performanceValue: number;
  type: string;
  duration: string;
  actions: {
    title: string;
    description: string;
    image: string;
  }[];
  activeTab: 'customer' | 'backoffice';
  onTabChange: (tab: 'customer' | 'backoffice') => void;
};

const TouchpointCard: React.FC<TouchpointCardProps> = ({
  number,
  title,
  performanceValue,
  type,
  duration,
  actions,
  activeTab,
  onTabChange,
}) => {
  const getPerformanceColor = () => {
    if (performanceValue >= 80) return 'bg-green-500';
    if (performanceValue >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="border border-gray-200 rounded-lg mb-6 overflow-hidden">
      <div className="flex items-center p-4 border-b border-gray-100">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-900 text-white mr-3">
          {number}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">{title}</h3>
            <div className="flex items-center">
              <span className={`px-2 py-0.5 rounded-full text-xs text-white ${getPerformanceColor()}`}>
                {performanceValue}%
              </span>
            </div>
          </div>
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <div className="flex items-center mr-4">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
              <span>{type}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              <span>{duration}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-b border-gray-100">
        <div className="flex">
          <button
            className={`flex-1 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'customer' 
                ? 'border-purple-600 text-purple-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => onTabChange('customer')}
          >
            Customer Actions
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'backoffice' 
                ? 'border-purple-600 text-purple-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => onTabChange('backoffice')}
          >
            Back Office Processes
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="space-y-4">
          {actions.map((action, index) => (
            <div key={index} className="flex">
              <div className="mr-4 flex-shrink-0">
                <img 
                  src={action.image} 
                  alt={action.title} 
                  className="w-16 h-16 object-cover rounded border border-gray-200"
                />
              </div>
              <div>
                <h4 className="font-medium mb-1">{action.title}</h4>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TouchpointCard;
