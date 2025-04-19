
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

type JourneyCardProps = {
  _id: string;
  title: string;
  npsScore: number;
  customerSentiment: number;
  keyInsight: string;
  performanceIndicators: {
    name: string;
    value: number;
  }[];
  status: 'healthy' | 'needs-attention' | 'critical';
};

const JourneyCard: React.FC<JourneyCardProps> = ({
  _id,
  title,
  npsScore,
  customerSentiment,
  keyInsight,
  performanceIndicators,
  status,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'healthy':
        return 'bg-healthy';
      case 'needs-attention':
        return 'bg-warning';
      case 'critical':
        return 'bg-critical';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'healthy':
        return 'Healthy';
      case 'needs-attention':
        return 'Needs Attention';
      case 'critical':
        return 'Critical';
      default:
        return '';
    }
  };

  const getStatusTextColor = () => {
    switch (status) {
      case 'healthy':
        return 'text-healthy';
      case 'needs-attention':
        return 'text-warning';
      case 'critical':
        return 'text-critical';
      default:
        return 'text-gray-500';
    }
  };

  const getSentimentColor = () => {
    if (customerSentiment >= 75) return 'stroke-healthy';
    if (customerSentiment >= 50) return 'stroke-warning';
    return 'stroke-critical';
  };

  const getNPSProgressColor = () => {
    if (npsScore >= 75) return 'bg-healthy';
    if (npsScore >= 50) return 'bg-warning';
    return 'bg-critical';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <h3 className={`text-2xl font-bold`}>
            {title}
          </h3>
          <div className="flex items-center">
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${getStatusColor()}`}></span>
            <span className={`text-sm font-medium ${getStatusTextColor()}`}>{getStatusText()}</span>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">NPS Score</p>
          <div className="flex items-center mb-2">
            <div className="text-3xl font-bold mr-2">{npsScore}</div>
            <div className="text-sm text-gray-400">/100</div>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${getNPSProgressColor()}`} 
              style={{ width: `${npsScore}%`, transition: 'width 1s ease-in-out' }}
            ></div>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2 text-center">Customer Sentiment</p>
          <div className="flex justify-center">
            <div className="relative w-24 h-24">
              <svg viewBox="0 0 36 36" className="w-full h-full">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#f0f0f0" strokeWidth="2.5"></circle>
                <circle 
                  cx="18" 
                  cy="18" 
                  r="16" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeDasharray={`${customerSentiment} 100`}
                  strokeLinecap="round"
                  className={`${getSentimentColor()} transform -rotate-90 origin-center`}
                ></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{customerSentiment}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`mb-4 p-3 rounded-md ${
          status === 'healthy' ? 'bg-green-50' : 
          status === 'needs-attention' ? 'bg-yellow-50' : 
          'bg-red-50'
        }`}>
          <div className="flex items-start">
            <div className={`p-1 rounded-full mr-2 ${
              status === 'healthy' ? 'bg-green-100' : 
              status === 'needs-attention' ? 'bg-yellow-100' : 
              'bg-red-100'
            }`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" 
                  stroke={
                    status === 'healthy' ? '#28c76f' : 
                    status === 'needs-attention' ? '#ff9f43' : 
                    '#ea5455'
                  } 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Key Insight</p>
              <p className="text-sm">{keyInsight}</p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-500 mb-2">KEY PERFORMANCE INDICATORS</h4>
          {performanceIndicators.map((indicator, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <span className="text-sm">{indicator.name}</span>
              <span className={`text-sm font-semibold ${
                indicator.value >= 75 ? 'text-healthy' : 
                indicator.value >= 50 ? 'text-warning' : 
                'text-critical'
              }`}>{indicator.value}%</span>
            </div>
          ))}
        </div>

        <Link 
  to={`/${_id}`} 
  className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md bg-[rgb(54_22_74_/var(--tw-bg-opacity))] text-white border-none hover:bg-[rgb(54_22_74_/var(--tw-bg-opacity))] transition-colors`}
>
  <span>View Journey Details</span>
  <ArrowRight size={16} />
</Link>

      </div>
    </div>
  );
};

export default JourneyCard;
