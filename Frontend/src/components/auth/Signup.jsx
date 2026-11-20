import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'

const Signup = () => {
    const [input, setInput] = useState({ 
        fullname: "", 
        email: "", 
        phoneNumber: "", 
        password: "", 
        role: "", 
        file: "", 
        resume: "" 
    });

    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => setInput({ ...input, [e.target.name]: e.target.value });
    
    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        if (e.target.name === "file") {
            setInput({ ...input, file: file });
        } else if (e.target.name === "resume") {
            setInput({ ...input, resume: file });
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!input.role) return toast.error("Please select a role.");
        if (input.role === 'student' && !input.resume) return toast.error("Resume is required for students.");

        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        
        if (input.file) formData.append("file", input.file);
        if (input.role === 'student' && input.resume) {
            formData.append("resume", input.resume);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Registration failed");
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => { if (user) navigate("/"); }, [user, navigate])

    return (
        <div className="min-h-screen bg-[#bcc6bc] relative overflow-hidden flex flex-col">
            <Navbar />
            
            {/* Background Aesthetic Spheres */}
            <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-[#a66a50] rounded-full shadow-clay z-0" />
            <div className="absolute top-1/4 right-0 w-64 h-64 bg-[#a66a50] rounded-full shadow-clay z-0 opacity-80" />
            <div className="absolute -bottom-20 right-1/4 w-[350px] h-[350px] bg-[#a66a50] rounded-full shadow-clay z-0" />
            
            <div className='flex-1 flex items-center justify-center relative z-10 pt-24 px-4 pb-10'>
                <form onSubmit={submitHandler} className='w-full max-w-2xl bg-white/25 backdrop-blur-2xl border-4 border-white/30 rounded-[50px] p-10 shadow-2xl'>
                    <h1 className='font-black text-4xl mb-8 text-gray-800 text-center tracking-tight'>Join <span className='text-[#a66a50]'>JobHunt</span></h1>
                    
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div className='flex flex-col gap-3'>
                            <Label className="font-bold text-gray-700 ml-2 text-xl">Full Name</Label>
                            <Input type="text" value={input.fullname} name="fullname" onChange={changeEventHandler} placeholder="Enter your name" className="bg-[#d1d8d1] border-none shadow-clay-inner rounded-full px-6 py-6 font-bold text-[#a66a50] text-xl" />
                        </div>
                        <div className='flex flex-col gap-3'>
                            <Label className="font-bold text-gray-700 ml-2 text-xl">Email</Label>
                            <Input type="email" value={input.email} name="email" onChange={changeEventHandler} placeholder="email@gmail.com" className="bg-[#d1d8d1] border-none shadow-clay-inner rounded-full px-6 py-6 font-bold text-[#a66a50] text-xl" />
                        </div>
                        <div className='flex flex-col gap-3'>
                            <Label className="font-bold text-gray-700 ml-2 text-xl">Phone Number</Label>
                            <Input type="text" value={input.phoneNumber} name="phoneNumber" onChange={changeEventHandler} placeholder="1234567890" className="bg-[#d1d8d1] border-none shadow-clay-inner rounded-full px-6 py-6 font-bold text-[#a66a50] text-xl" />
                        </div>
                        <div className='flex flex-col gap-3'>
                            <Label className="font-bold text-gray-700 ml-2 text-xl">Password</Label>
                            <Input type="password" value={input.password} name="password" onChange={changeEventHandler} placeholder="••••••••" className="bg-[#d1d8d1] border-none shadow-clay-inner rounded-full px-6 py-6 font-bold text-[#a66a50] text-xl" />
                        </div>
                    </div>

                    <div className='flex flex-col items-center justify-between mt-8 gap-6'>
                        <RadioGroup className="flex items-center gap-6">
                            <div className="flex items-center space-x-2">
                                <input type="radio" name="role" value="student" checked={input.role === 'student'} onChange={changeEventHandler} className="cursor-pointer h-5 w-5 accent-[#a66a50]" />
                                <Label className="cursor-pointer font-bold text-gray-700 text-xl">Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input type="radio" name="role" value="recruiter" checked={input.role === 'recruiter'} onChange={changeEventHandler} className="cursor-pointer h-5 w-5 accent-[#a66a50]" />
                                <Label className="cursor-pointer font-bold text-gray-700 text-xl">Recruiter</Label>
                            </div>
                        </RadioGroup>

                        <div className='flex flex-wrap items-center justify-center gap-4'>
                            <div className='flex items-center gap-3 bg-[#d1d8d1] rounded-full px-6 py-3 shadow-clay-inner'>
                                <Label className="font-bold text-gray-700 text-lg">Avatar</Label>
                                <Input accept="image/*" type="file" name="file" onChange={changeFileHandler} className="cursor-pointer border-none bg-transparent h-auto w-44 text-sm font-bold text-[#a66a50]" />
                            </div>

                            {input.role === 'student' && (
                                <div className='flex items-center gap-3 bg-[#d1d8d1] rounded-full px-6 py-3 shadow-clay-inner'>
                                    <Label className="font-bold text-gray-700 text-lg">Resume</Label>
                                    <Input accept="application/pdf" type="file" name="resume" onChange={changeFileHandler} className="cursor-pointer border-none bg-transparent h-auto w-44 text-sm font-bold text-[#a66a50]" />
                                </div>
                            )}
                        </div>
                    </div>

                    {loading ? (
                        <Button className="w-full mt-10 py-7 rounded-full bg-[#a66a50] text-white font-black text-xl"><Loader2 className='mr-2 h-6 w-6 animate-spin' /> Please wait</Button>
                    ) : (
                        <Button type="submit" className="w-full mt-10 py-7 rounded-full bg-[#a66a50] hover:bg-[#8e5a44] text-white font-black text-2xl shadow-clay transition-all transform hover:-translate-y-1 active:scale-95">Signup</Button>
                    )}
                    
                    <div className='text-center mt-8'>
                        <span className='text-lg font-bold text-gray-700'>Already have an account? <Link to="/login" className='text-[#a66a50] font-black hover:underline'>Login</Link></span>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup