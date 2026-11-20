import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'

const PostJob = () => {
    // Automatically load recruiter companies
    useGetAllCompanies();

    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        positions: 0, 
        role: "",      
        companyId: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { companies } = useSelector(store => store.company);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (value) => {
        setInput({ ...input, companyId: value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!input.companyId) {
            return toast.error("Please select a registered company");
        }
        try {
            setLoading(true);
            const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Internal Server Error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='bg-sage min-h-screen relative overflow-hidden flex flex-col pt-20'>
            <Navbar />

            {/* 3D Spheres Background Elements (With pointer-events-none) */}
            <div className="fixed top-20 -right-20 w-96 h-96 bg-clay-terracotta rounded-full shadow-clay z-0 opacity-80 pointer-events-none" />
            <div className="fixed bottom-20 right-40 w-24 h-24 bg-sage-light rounded-full shadow-clay z-0 pointer-events-none" />
            <div className="fixed -bottom-20 -left-20 w-80 h-80 bg-clay-terracotta rounded-full shadow-clay z-0 opacity-80 pointer-events-none" />
            <div className="fixed top-60 left-10 w-20 h-20 bg-clay-peach rounded-full shadow-clay z-0 pointer-events-none" />
            
            <div className="fixed top-1/2 left-1/3 w-12 h-12 bg-white/20 rounded-full shadow-clay z-0 blur-sm pointer-events-none" />
            <div className="fixed bottom-1/4 left-1/4 w-32 h-32 bg-sage-light/60 rounded-full shadow-clay z-0 pointer-events-none" />
            <div className="fixed top-10 right-1/4 w-16 h-16 bg-clay-peach/40 rounded-full shadow-clay z-0 pointer-events-none" />

            <div className='flex items-center justify-center w-full my-10 relative z-10 px-4'>
                <form 
                    onSubmit={submitHandler} 
                    className='p-8 max-w-4xl w-full bg-sage-light/40 backdrop-blur-md border-4 border-white/30 rounded-[40px] shadow-clay relative z-20'
                >
                    <h1 className='font-bold text-2xl mb-5 text-gray-800'>Post New Job</h1>
                    
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <Label className="text-gray-700 font-bold">Title</Label>
                            <Input type="text" name="title" value={input.title} onChange={changeEventHandler} className="bg-white/60 border-none rounded-xl my-1 focus-visible:ring-clay-peach font-semibold" required />
                        </div>
                        <div>
                            <Label className="text-gray-700 font-bold">Role</Label>
                            <Input type="text" name="role" value={input.role} onChange={changeEventHandler} placeholder="e.g. Fullstack Developer" className="bg-white/60 border-none rounded-xl my-1 focus-visible:ring-clay-peach font-semibold" required />
                        </div>
                        <div className='md:col-span-2'>
                            <Label className="text-gray-700 font-bold">Description</Label>
                            <Input type="text" name="description" value={input.description} onChange={changeEventHandler} className="bg-white/60 border-none rounded-xl my-1 focus-visible:ring-clay-peach font-semibold" required />
                        </div>
                        <div>
                            <Label className="text-gray-700 font-bold">Requirements (Comma separated)</Label>
                            <Input type="text" name="requirements" value={input.requirements} onChange={changeEventHandler} className="bg-white/60 border-none rounded-xl my-1 focus-visible:ring-clay-peach font-semibold" />
                        </div>
                        <div>
                            <Label className="text-gray-700 font-bold">Salary (LPA)</Label>
                            <Input type="number" name="salary" value={input.salary} onChange={changeEventHandler} className="bg-white/60 border-none rounded-xl my-1 focus-visible:ring-clay-peach font-semibold" required />
                        </div>
                        <div>
                            <Label className="text-gray-700 font-bold">Location</Label>
                            <Input type="text" name="location" value={input.location} onChange={changeEventHandler} className="bg-white/60 border-none rounded-xl my-1 focus-visible:ring-clay-peach font-semibold" required />
                        </div>
                        <div>
                            <Label className="text-gray-700 font-bold">Job Type</Label>
                            <Input type="text" name="jobType" value={input.jobType} onChange={changeEventHandler} placeholder="Full-time, Part-time, Remote" className="bg-white/60 border-none rounded-xl my-1 focus-visible:ring-clay-peach font-semibold" required />
                        </div>
                        <div>
                            <Label className="text-gray-700 font-bold">Experience Level (Years)</Label>
                            <Input type="number" name="experience" value={input.experience} onChange={changeEventHandler} className="bg-white/60 border-none rounded-xl my-1 focus-visible:ring-clay-peach font-semibold" required />
                        </div>
                        <div>
                            <Label className="text-gray-700 font-bold">No of Positions</Label>
                            <Input type="number" name="positions" value={input.positions} onChange={changeEventHandler} className="bg-white/60 border-none rounded-xl my-1 focus-visible:ring-clay-peach font-semibold" required />
                        </div>
                        
                        <div className='flex flex-col gap-2'>
                            <Label className="text-gray-700 font-bold">Select Company</Label>
                            {companies && companies.length > 0 ? (
                                <Select onValueChange={selectChangeHandler}>
                                    <SelectTrigger className="w-full bg-white/60 border-none rounded-xl font-semibold">
                                        <SelectValue placeholder="Select a Company" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white/90 backdrop-blur-lg">
                                        <SelectGroup>
                                            {companies.map((company) => (
                                                <SelectItem key={company._id} value={company._id}>
                                                    {company.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <div className='p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-bold flex items-center justify-between'>
                                    <span>No company registered yet.</span>
                                    <Button 
                                        type="button" 
                                        onClick={() => navigate("/admin/companies/create")}
                                        className="h-8 px-3 text-xs bg-gray-800 text-white rounded-lg"
                                    >
                                        Create Company
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {loading ? (
                        <Button className="w-full my-6 rounded-full" disabled>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full my-6 bg-gray-800 hover:bg-clay-terracotta text-white font-bold rounded-full shadow-clay transition-all active:scale-95">
                            Post New Job
                        </Button>
                    )}
                </form>
            </div>
        </div>
    )
}

export default PostJob
