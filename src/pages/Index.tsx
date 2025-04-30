import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import JourneyCard from '@/components/JourneyCard';
import CreateJourneyDialog from '@/components/CreateJourneyDialog';
import axios from 'axios';
import { Loader } from 'lucide-react';  // Import the loader from lucide-react
import { BASE_URL } from '@/App';

const Index = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);  // State to track loading status

  const fetchReports = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/reports`);
         setReports(response.data); // Set the fetched reports to state
      setLoading(false);  // Set loading to false once the data is fetched
    } catch (err) {
      setError('There was an error fetching reports');
      setLoading(false);  // Set loading to false in case of an error
      console.error(err); // Log the error for debugging
    }
  };
  useEffect(() => {


    fetchReports(); // Call the async function
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <h1 className="text-3xl font-bold text-gray-800">Customer Journey Overview</h1>
          <div className="flex items-center gap-4">
            <CreateJourneyDialog onSave={fetchReports} />
            <p className="text-sm text-gray-500">Last updated: April 18, 2025</p>
          </div>
        </div>
        
        {/* Show loading spinner while loading */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[70vh]">
            <Loader className="animate-spin h-10 w-10 text-purple-600" />
          </div>
        ) : (
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
        )}
      </main>
    </div>
  );
};

export default Index;
