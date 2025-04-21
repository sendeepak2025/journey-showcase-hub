import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import JourneyStageProgress from '@/components/JourneyStageProgress';
import StageDetail from '@/components/StageDetail';
import axios from 'axios';
import { Users, Settings, FileText } from 'lucide-react'; // example icons

const JourneyDetail = () => {
  const { journeyId } = useParams<{ journeyId: string }>();
  const [activeStage, setActiveStage] = useState<string>('awareness');

  const [journeyData, setJourneyData] = useState<any>(null); // State to store the fetched data
 
  const stageIcons = {
    Awareness: <Users className="w-4 h-4 mr-2" />,
    Consideration: <Settings className="w-4 h-4 mr-2" />,
    Quote: <FileText className="w-4 h-4 mr-2" />,
  };

  useEffect(() => {
    const fetchJourneyData = async () => {
      try {
        // const response = await axios.get(`http://localhost:5000/api/reports/${journeyId}`);
        const response = await axios.get(`https://journey.mahitechnocrafts.in/api/reports/${journeyId}`);
        setJourneyData(response.data); // Set the fetched data
      } catch (err) {
        console.error('There was an error fetching the report:', err);
      }
    };
  
    fetchJourneyData(); // Call the async function
  }, [journeyId]); // Run when journeyId changes

  if (!journeyData) return <div>Loading...</div>; // Show loading if data is not fetched yet

  // Get the current journey details from the backend data
  const currentJourney = journeyData;

  // Filter for the selected stage based on the activeStage
  const currentStageDetails = currentJourney.stages.find((stage: any) => stage.name === activeStage);

  console.log(currentStageDetails)
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col g3 justify-between mb-6">
            <h1 className={`text-3xl font-bold text-gray-900`}>
              {currentJourney.title} Journey Details
            </h1>
            <p className="text-sm text-gray-500">Last updated: {new Date(currentJourney.updatedAt).toLocaleDateString()}</p>
          </div>
          
          {/* <JourneyStageProgress stages={currentJourney.stages} /> */}
          
          <div className="mb-6">
  <div className="flex flex-wrap gap-3">
    {['Awareness', 'Consideration', 'Quote']
      .filter(stageName => currentJourney.stages.some((stage: any) => stage.name.toLowerCase() === stageName.toLowerCase()))
      .map((stageName, index) => (
        <button
          key={index}
          className={`flex items-center px-4 py-2 rounded-md text-xl font-medium ${
            activeStage === stageName.toLowerCase()
              ? 'bg-[rgb(54_22_74_/var(--tw-bg-opacity))] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setActiveStage(stageName.toLowerCase())}
        >
          {stageIcons[stageName]}
          {stageName}
        </button>
    ))}
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
