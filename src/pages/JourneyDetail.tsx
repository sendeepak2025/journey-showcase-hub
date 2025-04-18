
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import JourneyStageProgress from '@/components/JourneyStageProgress';
import StageDetail from '@/components/StageDetail';

const JourneyDetail = () => {
  const { journeyId } = useParams<{ journeyId: string }>();
  const [activeStage, setActiveStage] = useState<'awareness' | 'consideration' | 'quote'>('awareness');
  
  // Mock data for journey stages based on the screenshots
  const journeyData = {
    ijoin: {
      title: 'iJoin',
      stages: [
        { name: 'Awareness' as const, value: 92, isActive: activeStage === 'awareness' },
        { name: 'Consideration' as const, value: 88, isActive: activeStage === 'consideration' },
        { name: 'Quote' as const, value: 76, isActive: activeStage === 'quote' }
      ],
      stageDetails: {
        awareness: {
          description: 'Potential customers discover AGL through various marketing channels and begin to recognize the brand.',
          touchpoints: [
            {
              number: 1,
              title: 'Social Media Ads',
              performanceValue: 88,
              type: 'Digital',
              duration: '2-5 days',
              actions: [
                {
                  title: 'View Ad',
                  description: 'Customer sees targeted social media advertisements',
                  image: '/public/lovable-uploads/721b450d-6c01-4247-b198-21fe96eee682.png'
                },
                {
                  title: 'Click Through',
                  description: 'Customer clicks on ad to learn more',
                  image: '/public/lovable-uploads/07282123-8f27-402d-a6b2-eb74175ce594.png'
                }
              ]
            },
            {
              number: 2,
              title: 'Website Visit',
              performanceValue: 92,
              type: 'Digital',
              duration: '5-7 mins',
              actions: [
                {
                  title: 'Browse Homepage',
                  description: 'Customer explores main website features',
                  image: '/public/lovable-uploads/04f08dd9-6180-413e-a5f7-b39744250a73.png'
                },
                {
                  title: 'View Plans',
                  description: 'Customer browses available energy plans',
                  image: '/public/lovable-uploads/7065d094-6967-4ecf-bbfe-aa4e5948ee3f.png'
                }
              ]
            }
          ]
        },
        consideration: {
          description: 'Prospects evaluate AGL\'s offerings and compare them with competitors.',
          touchpoints: [
            {
              number: 1,
              title: 'Product Pages',
              performanceValue: 90,
              type: 'Digital',
              duration: '8-10 mins',
              actions: [
                {
                  title: 'Compare Plans',
                  description: 'Customer compares different energy plans and pricing',
                  image: '/public/lovable-uploads/04f08dd9-6180-413e-a5f7-b39744250a73.png'
                }
              ]
            }
          ]
        },
        quote: {
          description: 'Customers request and receive personalized energy plan quotes.',
          touchpoints: [
            {
              number: 1,
              title: 'Quote Form',
              performanceValue: 78,
              type: 'Digital',
              duration: '5-7 mins',
              actions: [
                {
                  title: 'Fill Form',
                  description: 'Customer completes quote request form',
                  image: '/public/lovable-uploads/7065d094-6967-4ecf-bbfe-aa4e5948ee3f.png'
                }
              ]
            }
          ]
        }
      }
    },
    ipay: {
      title: 'iPay',
      stages: [
        { name: 'Awareness' as const, value: 87, isActive: activeStage === 'awareness' },
        { name: 'Consideration' as const, value: 72, isActive: activeStage === 'consideration' },
        { name: 'Quote' as const, value: 65, isActive: activeStage === 'quote' }
      ],
      stageDetails: {
        awareness: {
          description: 'Potential customers discover iPay payment solutions through various marketing channels.',
          touchpoints: [
            {
              number: 1,
              title: 'Digital Ads',
              performanceValue: 78,
              type: 'Digital',
              duration: '3-4 days',
              actions: [
                {
                  title: 'View Campaign',
                  description: 'Customer sees digital payment solution advertisements',
                  image: '/public/lovable-uploads/721b450d-6c01-4247-b198-21fe96eee682.png'
                }
              ]
            }
          ]
        },
        consideration: {
          description: 'Prospects evaluate iPay solutions against competitors.',
          touchpoints: [
            {
              number: 1,
              title: 'Feature Comparison',
              performanceValue: 72,
              type: 'Digital',
              duration: '10-12 mins',
              actions: [
                {
                  title: 'Review Features',
                  description: 'Customer compares payment features and pricing models',
                  image: '/public/lovable-uploads/04f08dd9-6180-413e-a5f7-b39744250a73.png'
                }
              ]
            }
          ]
        },
        quote: {
          description: 'Business customers request pricing quotes for iPay integration.',
          touchpoints: [
            {
              number: 1,
              title: 'Business Quote',
              performanceValue: 65,
              type: 'Digital',
              duration: '8-10 mins',
              actions: [
                {
                  title: 'Request Quote',
                  description: 'Business customer submits requirements for custom pricing',
                  image: '/public/lovable-uploads/7065d094-6967-4ecf-bbfe-aa4e5948ee3f.png'
                }
              ]
            }
          ]
        }
      }
    },
    imove: {
      title: 'iMove',
      stages: [
        { name: 'Awareness' as const, value: 63, isActive: activeStage === 'awareness' },
        { name: 'Consideration' as const, value: 52, isActive: activeStage === 'consideration' },
        { name: 'Quote' as const, value: 41, isActive: activeStage === 'quote' }
      ],
      stageDetails: {
        awareness: {
          description: 'Potential customers discover iMove relocation services through marketing campaigns.',
          touchpoints: [
            {
              number: 1,
              title: 'Search Ads',
              performanceValue: 59,
              type: 'Digital',
              duration: '2-3 days',
              actions: [
                {
                  title: 'View Search Results',
                  description: 'Customer sees iMove in relocation service search results',
                  image: '/public/lovable-uploads/721b450d-6c01-4247-b198-21fe96eee682.png'
                }
              ]
            }
          ]
        },
        consideration: {
          description: 'Prospects evaluate iMove services against other relocation providers.',
          touchpoints: [
            {
              number: 1,
              title: 'Service Comparison',
              performanceValue: 52,
              type: 'Digital',
              duration: '12-15 mins',
              actions: [
                {
                  title: 'Compare Services',
                  description: 'Customer reviews relocation package options',
                  image: '/public/lovable-uploads/04f08dd9-6180-413e-a5f7-b39744250a73.png'
                }
              ]
            }
          ]
        },
        quote: {
          description: 'Customers request personalized relocation service quotes.',
          touchpoints: [
            {
              number: 1,
              title: 'Relocation Quote',
              performanceValue: 41,
              type: 'Digital',
              duration: '10-12 mins',
              actions: [
                {
                  title: 'Submit Requirements',
                  description: 'Customer provides relocation details for quote',
                  image: '/public/lovable-uploads/7065d094-6967-4ecf-bbfe-aa4e5948ee3f.png'
                }
              ]
            }
          ]
        }
      }
    }
  };

  const currentJourney = journeyId === 'ijoin' 
    ? journeyData.ijoin 
    : journeyId === 'ipay' 
      ? journeyData.ipay 
      : journeyData.imove;

  const currentStageDetails = activeStage === 'awareness' 
    ? currentJourney.stageDetails.awareness 
    : activeStage === 'consideration' 
      ? currentJourney.stageDetails.consideration 
      : currentJourney.stageDetails.quote;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className={`text-3xl font-bold ${
              journeyId === 'ijoin' ? 'text-journey-ijoin' : 
              journeyId === 'ipay' ? 'text-journey-ipay' : 
              'text-journey-imove'
            }`}>
              {currentJourney.title} Journey Details
            </h1>
            <p className="text-sm text-gray-500">Last updated: April 18, 2025</p>
          </div>
          
          <JourneyStageProgress stages={currentJourney.stages} />
          
          <div className="mb-6">
            <div className="flex space-x-4">
              <button 
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeStage === 'awareness' 
                    ? 'bg-purple-900 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setActiveStage('awareness')}
              >
                Awareness
              </button>
              <button 
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeStage === 'consideration' 
                    ? 'bg-purple-900 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setActiveStage('consideration')}
              >
                Consideration
              </button>
              <button 
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeStage === 'quote' 
                    ? 'bg-purple-900 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setActiveStage('quote')}
              >
                Quote
              </button>
            </div>
          </div>
          
          <StageDetail 
            stageName={
              activeStage === 'awareness' 
                ? 'Awareness' 
                : activeStage === 'consideration' 
                  ? 'Consideration' 
                  : 'Quote'
            }
            description={currentStageDetails.description}
            touchpoints={currentStageDetails.touchpoints}
          />
        </div>
      </main>
    </div>
  );
};

export default JourneyDetail;
