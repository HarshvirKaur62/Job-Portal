import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarImage } from './ui/avatar'

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();
    
    return (
        <div 
            onClick={() => navigate(`/description/${job._id}`)} 
            className='p-6 rounded-[40px] shadow-clay bg-white border border-gray-50 cursor-pointer hover:-translate-y-2 transition-all duration-300 group'
        >
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='font-semibold text-lg text-clay-terracotta'>{job?.company?.name}</h1>
                    <p className='text-sm text-gray-400 font-medium'>India</p>
                </div>
                
                <Avatar className="h-14 w-14 shadow-sm border border-gray-100">
                    <AvatarImage 
                        src={job?.company?.logo} 
                        alt={`${job?.company?.name} logo`} 
                        className="object-contain p-1"
                    />
                </Avatar>
            </div>

            <div className='mt-4'>
                <h1 className='font-extrabold text-xl text-gray-800 group-hover:text-clay-peach transition-colors'>
                    {job?.title}
                </h1>
                <p className='text-sm text-gray-500 leading-relaxed mt-2 line-clamp-2'>
                    {job?.description}
                </p>
            </div>

            <div className='flex flex-wrap items-center gap-2 mt-5'>
                <Badge className='bg-blue-50 text-blue-600 border-none px-3 py-1 rounded-full font-bold' variant="outline">
                    {job?.positions} Positions
                </Badge>
                <Badge className='bg-orange-50 text-clay-terracotta border-none px-3 py-1 rounded-full font-bold' variant="outline">
                    {job?.jobType}
                </Badge>
                <Badge className='bg-purple-50 text-purple-600 border-none px-3 py-1 rounded-full font-bold' variant="outline">
                    {job?.salary}LPA
                </Badge>
            </div>
        </div>
    )
}

export default LatestJobCards