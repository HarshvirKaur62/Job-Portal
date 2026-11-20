import React, { useEffect } from 'react'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { motion } from 'framer-motion';
import MainLayout from './layout/MainLayout';

const Browse = () => {
    useGetAllJobs();
    const { allJobs } = useSelector(store => store.job);
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(setSearchedQuery(""));
        }
    }, [dispatch])

    const jobList = allJobs || [];

    return (
        <MainLayout>
            <div className='max-w-7xl mx-auto pt-32 px-6 relative z-10'>
                <div className='mb-10'>
                    <span className="inline-block px-8 py-3 rounded-full bg-[#e4b293] text-white text-base font-black shadow-clay mb-4 uppercase tracking-wider">
                        Discovery Mode
                    </span>
                    <h1 className='font-black text-6xl text-gray-800 leading-tight tracking-tight'>
                        Search Results <span className="text-[#a66a50]">({jobList.length})</span>
                    </h1>
                </div>

                {jobList.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-20 bg-white/20 backdrop-blur-md border-4 border-white/30 rounded-[40px] text-center px-4'>
                        <p className='text-gray-700 font-bold text-2xl'>No jobs found matching your search.</p>
                        <p className='text-gray-500 font-medium mt-2'>Try searching with different keywords or role titles.</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20'>
                        {jobList.map((job) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                key={job._id}
                            >
                                <Job job={job}/>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    )
}

export default Browse;
