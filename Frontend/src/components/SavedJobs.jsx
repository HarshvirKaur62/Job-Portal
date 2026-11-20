import React from 'react'
import { useSelector } from 'react-redux'
import Job from './Job'
import MainLayout from './layout/MainLayout'
import { motion } from 'framer-motion'

const SavedJobs = () => {
    // We grab allJobs from the store and filter for ones that have isSaved: true
    const { allJobs } = useSelector(store => store.job);
    const savedJobs = allJobs.filter(job => job.isSaved === true);

    return (
        <MainLayout>
            <div className='max-w-7xl mx-auto px-6 relative z-10'>
                <div className='mb-12'>
                    <span className="inline-block px-8 py-3 rounded-full bg-[#a66a50] text-white text-xs font-black shadow-clay mb-6 uppercase tracking-[0.3em]">
                        Your Collection
                    </span>
                    <h1 className='font-black text-6xl text-gray-800 leading-tight tracking-tight'>
                        Saved <span className="text-[#e4b293]">Jobs</span>
                    </h1>
                    <p className='text-gray-600 mt-4 font-bold text-lg'>
                        {savedJobs.length > 0 
                          ? `You have marked ${savedJobs.length} opportunities for follow-up.` 
                          : "Your collection is empty. Start exploring jobs to save them!"}
                    </p>
                </div>

                {savedJobs.length <= 0 ? (
                    <div className='flex flex-col items-center justify-center py-32 bg-white/20 backdrop-blur-md border-4 border-white/30 rounded-[60px] shadow-clay text-center px-10'>
                        <div className='w-24 h-24 bg-white/50 rounded-full flex items-center justify-center mb-6 shadow-inner'>
                             <span className='text-4xl'>⭐</span>
                        </div>
                        <h2 className='text-3xl font-black text-gray-700'>Nothing here yet</h2>
                        <p className='text-gray-500 mt-4 max-w-md font-medium text-lg leading-relaxed'>
                            Click the "Save Later" button on any job card to keep track of interesting roles.
                        </p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20'>
                        {savedJobs.map((job) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                key={job._id}
                            >
                                <Job job={job} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    )
}

export default SavedJobs