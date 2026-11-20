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
import { setLoading, setUser, setToken } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'

const Login = () => {
    const [input, setInput] = useState({ email: "", password: "", role: "" });
    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => setInput({ ...input, [e.target.name]: e.target.value });

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!input.role) return toast.error("Please select a role");
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                if (res.data.token) {
                    dispatch(setToken(res.data.token));
                    localStorage.setItem("token", res.data.token);
                }
                toast.success(res.data.message);
                
                // Smart navigation based on role right after login response
                if (res.data.user.role === 'recruiter') {
                    navigate("/admin/companies");
                } else {
                    navigate("/");
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => { 
        if (user) {
            if (user.role === 'recruiter') {
                navigate("/admin/companies");
            } else {
                navigate("/");
            }
        } 
    }, [user, navigate])

    return (
        <div className="min-h-screen bg-[#bcc6bc] relative overflow-hidden flex flex-col">
            <Navbar />

            {/* --- DENSE CLAY SPHERE FIELD --- */}
            <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-[#a66a50] rounded-full shadow-clay z-0 opacity-90" />
            <div className="absolute -bottom-32 -left-20 w-[450px] h-[450px] bg-[#a66a50] rounded-full shadow-clay z-0" />
            <div className="absolute top-1/2 -left-32 w-64 h-64 bg-[#a66a50] rounded-full shadow-clay z-0 opacity-40 blur-sm" />

            {/* Mid-sized Floating Spheres */}
            <div className="absolute top-20 left-1/4 w-32 h-32 bg-[#e4b293] rounded-full shadow-clay z-0" />
            <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-[#e4b293] rounded-full shadow-clay z-0" />
            <div className="absolute top-1/3 right-10 w-28 h-28 bg-[#d1d8d1] rounded-full shadow-clay z-0" />
            <div className="absolute bottom-1/3 left-10 w-36 h-36 bg-[#d1d8d1] rounded-full shadow-clay z-0 opacity-60" />

            {/* Small Decorative "Bubbles" */}
            <div className="absolute top-10 right-1/3 w-16 h-16 bg-[#e4b293] rounded-full shadow-clay z-0 blur-[1px]" />
            <div className="absolute bottom-10 left-1/2 w-12 h-12 bg-[#a66a50] rounded-full shadow-clay z-0 opacity-70" />
            <div className="absolute top-1/2 right-1/3 w-10 h-10 bg-[#d1d8d1] rounded-full shadow-clay z-0" />
            <div className="absolute bottom-1/4 left-1/4 w-14 h-14 bg-[#a66a50] rounded-full shadow-clay z-0 opacity-30" />
            <div className="absolute top-60 left-1/2 w-16 h-16 bg-[#e4b293] rounded-full shadow-clay z-0 blur-md opacity-50" />

            <div className='flex-1 flex items-center justify-center relative z-10 px-4 pt-20'>
                <form
                    onSubmit={submitHandler}
                    className='w-full max-w-md bg-white/25 backdrop-blur-2xl border-4 border-white/30 rounded-[55px] p-10 shadow-2xl flex flex-col items-center'
                >
                    <h1 className='font-black text-4xl mb-8 text-gray-800 text-center tracking-tight'>Welcome Back</h1>

                    <div className='w-full space-y-4'>
                        <div className='flex flex-col gap-3'>
                            <Label className="font-bold text-gray-700 ml-2 text-xl">Email</Label>
                            <Input
                                type="email"
                                name="email"
                                value={input.email}
                                onChange={changeEventHandler}
                                placeholder="alex@email.com"
                                className="bg-[#d1d8d1] border-none shadow-clay-inner rounded-full px-6 py-9 focus-visible:ring-white font-bold text-[#a66a50] text-xl placeholder:text-[#a66a50]/80"
                            />
                        </div>

                        <div className='flex flex-col gap-3'>
                            <Label className="font-bold text-gray-700 ml-2 text-xl">Password</Label>
                            <Input
                                type="password"
                                name="password"
                                value={input.password}
                                onChange={changeEventHandler}
                                placeholder="••••••••"
                                className="bg-[#d1d8d1] border-none shadow-clay-inner rounded-full px-6 py-9 focus-visible:ring-white font-bold text-[#a66a50] text-xl placeholder:text-[#a66a50]/80"
                            />
                        </div>
                    </div>

                    <RadioGroup className="flex items-center gap-8 my-8 justify-center">
                        <div className="flex items-center space-x-2 cursor-pointer group">
                            <input type="radio" name="role" value="student" checked={input.role === 'student'} onChange={changeEventHandler} className="cursor-pointer h-5 w-5 accent-[#a66a50]" />
                            <Label className="cursor-pointer font-bold text-gray-700 text-xl">Student</Label>
                        </div>
                        <div className="flex items-center space-x-2 cursor-pointer group">
                            <input type="radio" name="role" value="recruiter" checked={input.role === 'recruiter'} onChange={changeEventHandler} className="cursor-pointer h-5 w-5 accent-[#a66a50]" />
                            <Label className="cursor-pointer font-bold text-gray-700 text-xl">Recruiter</Label>
                        </div>
                    </RadioGroup>

                    <Button type="submit" className="w-full py-8 rounded-full bg-[#a66a50] hover:bg-[#8e5a44] text-white font-black text-2xl shadow-clay transition-all transform hover:-translate-y-1 active:scale-95">
                        {loading ? <Loader2 className='mr-2 h-6 w-6 animate-spin' /> : "Login"}
                    </Button>

                    <div className='text-center mt-10'>
                        <span className='text-lg font-bold text-gray-800'>
                            New to JobHunt? <Link to="/signup" className='text-[#a66a50] font-black hover:underline ml-1'>Create account</Link>
                        </span>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
