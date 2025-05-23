import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import JourneyStageProgress from '@/components/JourneyStageProgress';
import StageDetail from '@/components/StageDetail';
import { Button } from '@/components/ui/button';
import { Edit, Users, Settings, FileText } from 'lucide-react';
import axios from 'axios';
import CreateJourneyDialog from '@/components/CreateJourneyDialog';
import { BASE_URL } from '@/App';

const JourneyDetail = () => {
  const { journeyId } = useParams<{ journeyId: string }>();
  const [activeStage, setActiveStage] = useState<string>('awareness');
  const [journeyData, setJourneyData] = useState<any>(null);

  const stageIcons = {
    Awareness: <Users className="w-4 h-4 mr-2" />,
    Consideration: <Settings className="w-4 h-4 mr-2" />,
    Quote: <FileText className="w-4 h-4 mr-2" />,
  };

  const fetchJourneyData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/reports/${journeyId}`);
      const data = response.data;
      setJourneyData(data);

      // Set default activeStage dynamically from fetched data
      if (data?.stages?.length > 0) {
        setActiveStage(data.stages[0].name.toLowerCase()); // Set first stage as default
      }
    } catch (err) {
      console.error('There was an error fetching the report:', err);
    }
  };

  useEffect(() => {
    fetchJourneyData();
  }, [journeyId]);

  if (!journeyData) return <div>Loading...</div>;

  // Get the current journey details from the backend data
  const currentJourney = journeyData;

  // Filter for the selected stage based on the activeStage
  const currentStageDetails = currentJourney.stages.find((stage: any) => stage.name.toLowerCase() === activeStage);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className={`text-3xl font-bold text-gray-900`}>
                {journeyData.title} Journey Details
              </h1>
              <p className="text-sm text-gray-500">
                Last updated: {new Date(journeyData.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <CreateJourneyDialog id={journeyId} onSave={fetchJourneyData} />
          </div>

          <div className="mb-6">
            <div className="flex flex-wrap gap-3">
              {journeyData.stages.map((stage: any, index: number) => {
                const stageName = stage.name;
                const displayName = stageName.replace(/\b\w/g, (char) => char.toUpperCase()); // Properly capitalize stage name
                const icon = stageIcons[displayName] || <Users className="w-4 h-4 mr-2" />; // Fallback icon

                return (
                  <button
                    key={index}
                    className={`flex items-center px-4 py-2 rounded-md text-xl font-medium ${
                      activeStage === stageName.toLowerCase()
                        ? 'bg-[rgb(54_22_74_/var(--tw-bg-opacity))] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveStage(stageName.toLowerCase())}
                  >
             
                    {displayName}
                  </button>
                );
              })}
            </div>
          </div>

          {currentStageDetails && (
            <StageDetail 
              stageName={currentStageDetails.name}
              description={currentStageDetails.description}
              touchpoints={currentStageDetails.touchpoints}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default JourneyDetail;
