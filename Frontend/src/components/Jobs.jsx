import React, { useEffect, useState } from 'react'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import MainLayout from './layout/MainLayout';

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);

    useEffect(() => {
        if (searchedQuery) {
            const filteredJobs = allJobs.filter((job) => {
                return job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.location.toLowerCase().includes(searchedQuery.toLowerCase())
            })
            setFilterJobs(filteredJobs)
        } else {
            setFilterJobs(allJobs)
        }
    }, [allJobs, searchedQuery]);

    return (
        <MainLayout>
            <div className='max-w-7xl mx-auto px-4 relative z-10 pt-28 pb-10 w-full'>
                <div className='flex flex-col md:flex-row gap-8'>
                    <div className='w-full md:w-1/4'>
                        <FilterCard />
                    </div>
                    <div className='flex-1 h-[85vh] overflow-y-auto no-scrollbar'>
                        {filterJobs.length <= 0 ? (
                            <div className="flex flex-col items-center justify-center h-full bg-white/25 backdrop-blur-2xl border-4 border-white/30 rounded-[55px] shadow-2xl">
                                <span className="text-gray-800 font-black text-2xl">No jobs found</span>
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                                {filterJobs.map((job) => (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }} 
                                        animate={{ opacity: 1, y: 0 }} 
                                        transition={{ duration: 0.3 }}
                                        key={job?._id}
                                    >
                                        <Job job={job} />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default Jobs