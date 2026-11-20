import React, { useEffect } from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';

const LatestJobs = () => {
    const { allJobs } = useSelector(store => store.job);

    useEffect(() => {
        console.log("ALL JOBS:", allJobs);
    }, [allJobs]);

    return (
        <div className='max-w-7xl mx-auto my-12 px-6'>
            <h1 className='text-4xl md:text-5xl font-extrabold text-center text-gray-800'>
                Latest & Top <span className='text-clay-terracotta'>Job Openings</span>
            </h1>

            {!allJobs || allJobs.length === 0 ? (
                <div className='text-center mt-16 text-gray-500 text-xl font-medium italic'>
                    No Job Available at the moment.
                </div>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-16 mb-10'>
                    {allJobs.slice(0, 6).map((job) => (
                        <LatestJobCards key={job._id} job={job} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default LatestJobs;