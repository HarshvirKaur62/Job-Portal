import React from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toggleSaveJob } from '@/redux/jobSlice' // Ensure this is imported
import { toast } from 'sonner'

const Job = ({ job }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // 🛠️ The function that makes the button work
    const saveJobHandler = (e) => {
        e.stopPropagation(); // Prevents triggering navigate if card is clickable
        dispatch(toggleSaveJob(job._id));
        
        if (!job?.isSaved) {
            toast.success("Job added to your collection!");
        } else {
            toast.error("Job removed from your collection.");
        }
    }

    return (
        <div className='p-6 rounded-[40px] bg-white/30 backdrop-blur-md border-4 border-white/30 shadow-clay flex flex-col gap-4 transition-all hover:scale-[1.02]'>
            <div className='flex items-center justify-between'>
                <p className='text-xs text-gray-500 font-black uppercase tracking-widest'>8 days ago</p>
                <Button 
                    variant="ghost" 
                    className="rounded-full hover:bg-white/50" 
                    size="icon" 
                    onClick={saveJobHandler}
                >
                    <Bookmark className={`${job?.isSaved ? "fill-[#a66a50] text-[#a66a50]" : "text-gray-400"} transition-colors`} />
                </Button>
            </div>

            <div className='flex items-center gap-4 my-2'>
                <div className='w-14 h-14 bg-white rounded-[20px] flex items-center justify-center shadow-sm overflow-hidden p-2'>
                    <img src={job?.company?.logo} alt="logo" className='w-full h-full object-contain' />
                </div>
                <div>
                    <h1 className='font-black text-xl text-gray-800 leading-tight'>{job?.company?.name}</h1>
                    <p className='text-sm text-gray-500 font-bold'>{job?.location}</p>
                </div>
            </div>

            <div>
                <h1 className='font-black text-2xl text-gray-800 tracking-tight'>{job?.title}</h1>
                <p className='text-sm text-gray-600 font-medium line-clamp-2 mt-2 leading-relaxed'>
                    {job?.description}
                </p>
            </div>

            <div className='flex items-center gap-4 mt-4'>
                <Button 
                    onClick={() => navigate(`/description/${job?._id}`)} 
                    className="rounded-full flex-1 bg-white text-gray-800 font-black py-6 shadow-sm hover:bg-gray-50 border-none"
                >
                    Details
                </Button>
                {/* 🛠️ SAVE LATER BUTTON NOW CALLS THE HANDLER */}
                <Button 
                    onClick={saveJobHandler}
                    className={`rounded-full flex-1 font-black py-6 shadow-clay transition-all ${
                        job?.isSaved 
                        ? 'bg-gray-800 text-white' 
                        : 'bg-[#a66a50] text-white hover:bg-[#8e5a43]'
                    }`}
                >
                    {job?.isSaved ? "Saved" : "Save Later"}
                </Button>
            </div>
        </div>
    )
}

export default Job