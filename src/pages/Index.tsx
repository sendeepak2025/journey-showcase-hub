
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import JourneyCard from '@/components/JourneyCard';
import CreateJourneyDialog from '@/components/CreateJourneyDialog';
import axios from 'axios';

const Index = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [error, setError] = useState<string>('');


  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/reports');
        console.log(response.data)
        setReports(response.data); // Set the fetched reports to state
      } catch (err) {
        setError('There was an error fetching reports');
        console.error(err); // Log the error for debugging
      }
    };

    fetchReports(); // Call the async function
  }, []);

  // const reports = [
  //   {
  //     title: 'iJoin',
  //     npsScore: 85,
  //     customerSentiment: 90,
  //     keyInsight: 'High conversion rate driven by streamlined onboarding process',
  //     performanceIndicators: [
  //       { name: 'Conversion', value: 68 },
  //       { name: 'Sales', value: 92 }
  //     ],
  //     status: 'healthy' as const
  //   },
  //   {
  //     title: 'iPay',
  //     npsScore: 65,
  //     customerSentiment: 72,
  //     keyInsight: 'Billing contact rate needs improvement despite increasing Bille adoption',
  //     performanceIndicators: [
  //       { name: 'Billing contact rate', value: 45 },
  //       { name: 'Bille adoption', value: 58 }
  //     ],
  //     status: 'needs-attention' as const
  //   },
  //   {
  //     title: 'iMove',
  //     npsScore: 45,
  //     customerSentiment: 38,
  //     keyInsight: 'Critical drop in conversion affecting overall journey performance',
  //     performanceIndicators: [
  //       { name: 'Conversion', value: 32 },
  //       { name: 'New sales', value: 41 }
  //     ],
  //     status: 'critical' as const
  //   }
  // ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Customer Journey Overview</h1>
          <div className="flex items-center gap-4">
            <CreateJourneyDialog />
            <p className="text-sm text-gray-500">Last updated: April 18, 2025</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((journey, index) => (
            <JourneyCard
            _id={journey._id}
              key={index}
              title={journey.title}
              npsScore={journey.npsScore}
              customerSentiment={journey.customerSentiment}
              keyInsight={journey.keyInsight}
              performanceIndicators={journey.performanceIndicators}
              status={journey.status}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
