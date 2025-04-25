
import React, { useState } from 'react';
import TouchpointCard from './TouchpointCard';
import { CompassTag } from '@/types/journey';

type StageDetailProps = {
  stageName: string;
  description: string;
  touchpoints: {
    number: number;
    title: string;
    performanceValue: number;
    type: string;
    duration: string;
    actions: {
      title: string;
      description: string;
      image: string;
      type: 'customer' | 'backoffice'; // Make sure action type is defined in each action
    }[];
      comment?: string;
      compassTags: CompassTag[];
  }[];
};

const StageDetail: React.FC<StageDetailProps> = ({
  stageName,
  description,
  touchpoints,

}) => {
  const [activeTabs, setActiveTabs] = useState<{ [key: number]: 'customer' | 'backoffice' }>({});


  const handleTabChange = (index: number, tab: 'customer' | 'backoffice') => {
    setActiveTabs(prev => ({
      ...prev,
      [index]: tab
    }));
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-2">{stageName} Stage</h2>
      <p className="text-gray-600 mb-6">{description}</p>
      
      <h3 className="text-lg font-semibold mb-4">Customer Touchpoints</h3>
      
      {touchpoints.map((touchpoint, index) => (
        <TouchpointCard
          key={index}
          number={index+1}
          title={touchpoint.title}
          compassTags={touchpoint?.compassTags}
          comment={touchpoint?.comment}
          performanceValue={touchpoint.performanceValue}
          type={touchpoint.type}
          duration={touchpoint.duration}
          actions={touchpoint.actions}
          activeTab={activeTabs[index] || 'customer'}
          onTabChange={(tab) => handleTabChange(index, tab)}
        />
      ))}
    </div>
  );
};

export default StageDetail;
