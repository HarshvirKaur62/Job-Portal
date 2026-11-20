import React from 'react'
import Navbar from './shared/Navbar'
import AppliedJobTable from './AppliedJobTable'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'

const AppliedJobs = () => {
    // Automatically fetch applied jobs data when this page loads
    useGetAppliedJobs();

    return (
        <div className='bg-[#bcc6bc] min-h-screen relative overflow-hidden flex flex-col'>
            <Navbar />
            
            {/* Background Aesthetic Spheres */}
            <div className="fixed top-20 -right-20 w-96 h-96 bg-[#a66a50] rounded-full shadow-clay z-0 opacity-80" />
            <div className="fixed -bottom-20 -left-20 w-80 h-80 bg-[#a66a50] rounded-full shadow-clay z-0 opacity-80" />
            <div className="fixed top-60 left-10 w-20 h-20 bg-[#e4b293] rounded-full shadow-clay z-0" />

            <div className='max-w-7xl mx-auto my-10 relative z-10 w-full px-4'>
                <div className='bg-white/25 backdrop-blur-2xl border-4 border-white/30 rounded-[50px] p-10 shadow-2xl'>
                    <div className='mb-8'>
                        <h1 className='font-black text-5xl text-gray-800 tracking-tight'>
                            Applied <span className='text-[#a66a50]'>Jobs</span>
                        </h1>
                        <p className='text-gray-600 font-bold mt-2 ml-1'>Track the status of your dream career path</p>
                    </div>
                    
                    {/* The Table Component */}
                    <div className='bg-white/30 rounded-[35px] p-2 border border-white/20 shadow-inner'>
                        <AppliedJobTable />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AppliedJobs