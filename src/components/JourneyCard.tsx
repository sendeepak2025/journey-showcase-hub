import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

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
}) => {
  const calculateStatusFromNPS = () => {
    if (npsScore >= 75) return 'healthy';
    if (npsScore >= 50) return 'needs-attention';
    return 'critical';
  };

  const dynamicStatus = calculateStatusFromNPS();

  const getStatusBadge = () => {
    switch (dynamicStatus) {
      case 'healthy':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" />
            Healthy
          </span>
        );
      case 'needs-attention':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
            <AlertTriangle className="w-4 h-4" />
            Needs Attention
          </span>
        );
      case 'critical':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-sm font-medium">
            <AlertCircle className="w-4 h-4" />
            Critical
          </span>
        );
      default:
        return null;
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

  const getStatusIcon = () => {
    switch (dynamicStatus) {
      case 'healthy':
        return <CheckCircle2 className="text-green-500 w-5 h-5" />;
      case 'needs-attention':
        return <AlertTriangle className="text-yellow-500 w-5 h-5" />;
      case 'critical':
        return <AlertCircle className="text-red-500 w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold">{title}</h3>
          {getStatusBadge()}
        </div>

        {/* NPS Score */}
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

        {/* Customer Sentiment */}
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

        {/* Key Insight */}
        <div
          className={`mb-4 p-3 rounded-md ${
            dynamicStatus === 'healthy'
              ? 'bg-green-50'
              : dynamicStatus === 'needs-attention'
              ? 'bg-yellow-50'
              : 'bg-red-50'
          }`}
        >
          <div className="flex items-start gap-2">
            <div className="p-1 rounded-full">{getStatusIcon()}</div>
            <div>
              <p className="text-xs font-medium text-gray-500">Key Insight</p>
              <p className="text-sm">{keyInsight}</p>
            </div>
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-500 mb-2">KEY PERFORMANCE INDICATORS</h4>
          {performanceIndicators.map((indicator, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <span className="text-sm">{indicator.name}</span>
              <span
                className={`text-sm font-semibold ${
                  indicator.value >= 75
                    ? 'text-healthy'
                    : indicator.value >= 50
                    ? 'text-warning'
                    : 'text-critical'
                }`}
              >
                {indicator.value}%
              </span>
            </div>
          ))}
        </div>

        {/* View Link */}
        <Link
          to={`/${_id}`}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md bg-[rgb(54_22_74_/var(--tw-bg-opacity))] text-white border-none hover:bg-[rgb(54_22_74_/var(--tw-bg-opacity))] transition-colors"
        >
          <span>View Journey Details</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default JourneyCard;
