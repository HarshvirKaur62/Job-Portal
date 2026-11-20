import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { JOB_API_END_POINT, APPLICATION_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Loader2, Sparkles } from 'lucide-react';
import MainLayout from './layout/MainLayout';

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id: jobId } = useParams();

    const [isApplied, setIsApplied] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiResult, setAiResult] = useState(null);

    const handleAnalyze = async () => {
        // Guard clause: Prompt user to log in if trying to use AI features while logged out
        if (!user) {
            toast.error("Please log in first to analyze your profile.");
            return navigate("/login");
        }
        if (!user?.profile?.resume) return toast.error("Please upload a resume first.");
        try {
            setIsAnalyzing(true);
            const res = await axios.post(`${JOB_API_END_POINT}/analyze`, { jobId, resumeUrl: user?.profile?.resume });
            if (res.data.success) {
                setAiResult(res.data.analysis);
                toast.success("AI Analysis Complete!");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Analysis failed.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const applyJobHandler = async () => {
        // FIX: If user is not logged in, show error toast and redirect to login page
        if (!user) {
            toast.error("Please login to apply for this job.");
            return navigate("/login");
        }

        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`);
            if (res.data.success) {
                setIsApplied(true);
                dispatch(setSingleJob({ ...singleJob, applications: [...singleJob.applications, { applicant: user?._id }] }));
                toast.success(res.data.message);
            }
        } catch (error) { 
            toast.error(error.response?.data?.message || "Application failed."); 
        }
    }

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`);
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    // Safely check array fields only when user identity is loaded
                    setIsApplied(res.data.job.applications.some(app => app.applicant === user?._id))
                }
            } catch (error) { 
                console.log(error); 
            }
        }
        fetchSingleJob();
    }, [jobId, dispatch, user?._id]);

    return (
        <MainLayout>
            <div className='max-w-7xl mx-auto px-4'>
                <div className='bg-white/30 backdrop-blur-md border-4 border-white/30 rounded-[40px] p-10 shadow-clay'>
                    
                    <div className='flex items-center justify-between'>
                        <div>
                            <h1 className='font-extrabold text-4xl text-gray-800'>{singleJob?.title}</h1>
                            <div className='flex items-center gap-2 mt-4'>
                                <Badge variant="outline" className="bg-white/50 text-gray-700 font-bold px-4 py-1 rounded-lg">Positions</Badge>
                                <Badge variant="outline" className="bg-clay-peach/20 text-clay-terracotta border-clay-peach/30 font-bold px-4 py-1 rounded-lg">{singleJob?.jobType}</Badge>
                                <Badge variant="outline" className="bg-white/50 text-gray-700 font-bold px-4 py-1 rounded-lg">{singleJob?.salary}LPA</Badge>
                            </div>
                        </div>
                        <Button
                            onClick={applyJobHandler}
                            disabled={isApplied}
                            className={`rounded-full px-10 py-7 text-lg font-black shadow-clay transition-all ${isApplied ? 'bg-gray-400 cursor-not-allowed' : 'bg-clay-peach hover:bg-clay-terracotta text-white'}`}>
                            {isApplied ? 'Already Applied' : 'Apply Now'}
                        </Button>
                    </div>

                    <div className='my-10 space-y-6 text-gray-700'>
                        <h1 className='font-bold text-2xl border-b border-gray-300 pb-3 text-gray-800'>Job Details</h1>
                        <div className='space-y-4 text-lg'>
                            <p><span className='font-bold text-gray-900'>Role:</span> {singleJob?.role || singleJob?.title}</p>
                            <p><span className='font-bold text-gray-900'>Location:</span> {singleJob?.location || 'India'}</p>
                            <p><span className='font-bold text-gray-900'>Description:</span> {singleJob?.description}</p>
                            <div className='space-y-2'>
                                <span className='font-bold text-gray-900'>Requirements:</span>
                                <ul className='list-disc list-inside ml-5 space-y-1 text-gray-700'>
                                    {singleJob?.requirements?.map((req, index) => (
                                        <li key={index} className='leading-relaxed'>{req.replace(/^[-\s•]+/, '')}</li>
                                    ))}
                                </ul>
                            </div>
                            <p><span className='font-bold text-gray-900'>Experience:</span> {singleJob?.experienceLevel} yrs</p>
                            <p><span className='font-bold text-gray-900'>Salary:</span> {singleJob?.salary}LPA</p>
                            <p><span className='font-bold text-gray-900'>Total Applicants:</span> {singleJob?.applications?.length || 0}</p>
                            <p><span className='font-bold text-gray-900'>Posted Date:</span> {singleJob?.createdAt?.split("T")[0]}</p>
                        </div>
                    </div>

                    {/* AI Match Card */}
                    <div className='mt-12 p-8 bg-white/40 border-2 border-white/50 rounded-[40px] shadow-clay'>
                        <div className='flex items-center gap-3 mb-8'>
                            <Sparkles className='text-clay-terracotta w-7 h-7' />
                            <h2 className='text-2xl font-black text-gray-800'>AI Assistant Match</h2>
                        </div>
                        
                        {!aiResult ? (
                            <div className='text-center py-10'>
                                <p className='mb-8 text-gray-600 font-medium text-lg'>
                                    {isApplied ? "Review your match even though you've already applied!" : "Compare your resume against this job using AI."}
                                </p>
                                <Button onClick={handleAnalyze} disabled={isAnalyzing} className='bg-gray-800 text-white rounded-full px-16 py-8 text-lg font-bold shadow-clay hover:bg-black transition-all'>
                                    {isAnalyzing ? <span className='flex items-center gap-3'><Loader2 className='animate-spin' /> Analyzing...</span> : "Analyze My Profile"}
                                </Button>
                            </div>
                        ) : (
                            <div className='space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700'>
                                <div className='flex flex-col md:flex-row items-center gap-10'>
                                    <div className='w-36 h-36 rounded-full border-[10px] border-clay-peach flex items-center justify-center bg-white shadow-clay shrink-0'>
                                        <span className='font-black text-4xl text-clay-terracotta'>{aiResult.score}%</span>
                                    </div>
                                    <p className='text-xl font-bold text-gray-800 italic bg-white/50 p-6 rounded-[30px] border border-white/60 flex-1'>"{aiResult.summary}"</p>
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                                    <div className='p-8 bg-red-50/60 rounded-[35px] border border-red-100'>
                                        <p className='font-black text-red-600 mb-6 uppercase text-xs tracking-widest'>Missing Skills</p>
                                        <div className='flex flex-wrap gap-2'>
                                            {aiResult.missingSkills?.map((s, i) => <Badge key={i} className="bg-red-100 text-red-700 font-bold px-4 py-1.5">{s}</Badge>)}
                                        </div>
                                    </div>
                                    <div className='p-8 bg-green-50/60 rounded-[35px] border border-green-100'>
                                        <p className='font-black text-green-700 mb-6 uppercase text-xs tracking-widest'>Why You Match</p>
                                        <ul className='text-gray-600 space-y-4 font-medium'>
                                            {aiResult.matchReasons?.map((r, i) => <li key={i} className='flex items-start gap-3'><div className='w-2.5 h-2.5 rounded-full bg-green-500 mt-1.5 shrink-0'></div>{r}</li>)}
                                        </ul>
                                    </div>
                                </div>
                                <div className='text-center pt-4'>
                                    <Button variant="ghost" onClick={() => setAiResult(null)} className="text-gray-400 font-bold">Reset Analysis</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default JobDescription;