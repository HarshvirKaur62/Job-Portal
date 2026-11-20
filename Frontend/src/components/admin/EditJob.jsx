import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate, useParams } from 'react-router-dom'

const EditJob = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        positions: "",
        role: ""
    });

    const changeEventHandler = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        });
    };

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(
                    `${JOB_API_END_POINT}/get/${params.id}`,
                    { withCredentials: true }
                );

                if (res.data?.success && res.data.job) {
                    const job = res.data.job;
                    setInput({
                        title: job.title || "",
                        description: job.description || "",
                        requirements: Array.isArray(job.requirements) ? job.requirements.join(", ") : (job.requirements || ""),
                        salary: job.salary ?? "",
                        location: job.location || "",
                        jobType: job.jobType || "",
                        experience: job.experienceLevel ?? "",
                        positions: job.positions ?? job.position ?? "",
                        role: job.role || job.title || ""
                    });
                }
            } catch (error) {
                console.error("Fetch single job error:", error);
                toast.error("Failed to load job details");
            }
        };

        if (params.id) {
            fetchSingleJob();
        }
    }, [params.id]);

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const res = await axios.put(
                `${JOB_API_END_POINT}/update/${params.id}`,
                {
                    ...input,
                    requirements: typeof input.requirements === 'string'
                        ? input.requirements.split(/,|\n/).map(r => r.trim()).filter(Boolean)
                        : input.requirements
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            if (res.data?.success) {
                toast.success(res.data.message || "Job updated successfully");
                navigate("/admin/jobs");
            }
        } catch (error) {
            console.error("Update job error:", error);
            toast.error(
                error.response?.data?.message || "Failed to update job"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='bg-sage min-h-screen relative overflow-hidden flex flex-col'>
            <Navbar />

            {/* Background Orbs */}
            <div className="fixed top-20 -right-20 w-96 h-96 bg-clay-terracotta rounded-full shadow-clay z-0 opacity-80" />
            <div className="fixed bottom-20 right-40 w-20 h-20 bg-sage-light rounded-full shadow-clay z-0" />
            <div className="fixed -bottom-20 -left-20 w-72 h-72 bg-clay-terracotta rounded-full shadow-clay z-0 opacity-80" />
            <div className="fixed top-60 left-20 w-16 h-16 bg-clay-peach rounded-full shadow-clay z-0" />

            <div className='max-w-5xl mx-auto my-14 relative z-10 w-full px-4'>
                <div className='bg-sage-light/40 backdrop-blur-md border-4 border-white/30 rounded-[40px] p-10 shadow-clay'>
                    {/* Header */}
                    <div className='flex items-center gap-5 mb-10'>
                        <Button
                            type="button"
                            onClick={() => navigate("/admin/jobs")}
                            variant="outline"
                            className="rounded-full px-5 py-5 bg-white/60 border-white/40 hover:bg-white/80 shadow-sm"
                        >
                            <ArrowLeft className='w-4 h-4 mr-2' />
                            Back
                        </Button>

                        <h1 className='font-bold text-4xl text-gray-800'>
                            Edit Job
                        </h1>
                    </div>

                    <form onSubmit={submitHandler}>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                            <div>
                                <Label className="mb-2 block text-gray-700 font-bold">Title</Label>
                                <Input
                                    type="text"
                                    name="title"
                                    value={input.title}
                                    onChange={changeEventHandler}
                                    className="bg-white/70 border-none rounded-2xl h-14 px-6 font-semibold"
                                    required
                                />
                            </div>

                            <div>
                                <Label className="mb-2 block text-gray-700 font-bold">Role</Label>
                                <Input
                                    type="text"
                                    name="role"
                                    value={input.role}
                                    onChange={changeEventHandler}
                                    className="bg-white/70 border-none rounded-2xl h-14 px-6 font-semibold"
                                    required
                                />
                            </div>

                            <div className='md:col-span-2'>
                                <Label className="mb-2 block text-gray-700 font-bold">
                                    Description
                                </Label>
                                <Input
                                    type="text"
                                    name="description"
                                    value={input.description}
                                    onChange={changeEventHandler}
                                    className="bg-white/70 border-none rounded-2xl h-14 px-6 font-semibold"
                                    required
                                />
                            </div>

                            <div>
                                <Label className="mb-2 block text-gray-700 font-bold">
                                    Requirements (Comma separated)
                                </Label>
                                <Input
                                    type="text"
                                    name="requirements"
                                    value={input.requirements}
                                    onChange={changeEventHandler}
                                    className="bg-white/70 border-none rounded-2xl h-14 px-6 font-semibold"
                                />
                            </div>

                            <div>
                                <Label className="mb-2 block text-gray-700 font-bold">
                                    Salary (LPA)
                                </Label>
                                <Input
                                    type="number"
                                    name="salary"
                                    value={input.salary}
                                    onChange={changeEventHandler}
                                    className="bg-white/70 border-none rounded-2xl h-14 px-6 font-semibold"
                                    required
                                />
                            </div>

                            <div>
                                <Label className="mb-2 block text-gray-700 font-bold">
                                    Location
                                </Label>
                                <Input
                                    type="text"
                                    name="location"
                                    value={input.location}
                                    onChange={changeEventHandler}
                                    className="bg-white/70 border-none rounded-2xl h-14 px-6 font-semibold"
                                    required
                                />
                            </div>

                            <div>
                                <Label className="mb-2 block text-gray-700 font-bold">
                                    Job Type
                                </Label>
                                <Input
                                    type="text"
                                    name="jobType"
                                    value={input.jobType}
                                    onChange={changeEventHandler}
                                    className="bg-white/70 border-none rounded-2xl h-14 px-6 font-semibold"
                                    required
                                />
                            </div>

                            <div>
                                <Label className="mb-2 block text-gray-700 font-bold">
                                    Experience (Years)
                                </Label>
                                <Input
                                    type="number"
                                    name="experience"
                                    value={input.experience}
                                    onChange={changeEventHandler}
                                    className="bg-white/70 border-none rounded-2xl h-14 px-6 font-semibold"
                                    required
                                />
                            </div>

                            <div>
                                <Label className="mb-2 block text-gray-700 font-bold">
                                    No of Positions
                                </Label>
                                <Input
                                    type="number"
                                    name="positions"
                                    value={input.positions}
                                    onChange={changeEventHandler}
                                    className="bg-white/70 border-none rounded-2xl h-14 px-6 font-semibold"
                                    required
                                />
                            </div>
                        </div>

                        <div className='flex justify-center mt-12'>
                            {loading ? (
                                <Button
                                    disabled
                                    className="rounded-full bg-gray-800 text-white px-10 py-6 text-lg font-bold"
                                >
                                    <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                                    Please wait
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    className="rounded-full bg-gray-800 hover:bg-[#a66a50] text-white px-12 py-6 text-lg font-bold shadow-clay transition-all active:scale-95"
                                >
                                    Update Job
                                </Button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditJob
