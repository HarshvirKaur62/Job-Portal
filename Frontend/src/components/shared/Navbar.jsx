import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { LogOut, User, LayoutDashboard } from 'lucide-react'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser, setToken } from '@/redux/authSlice'
import { toast } from 'sonner'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`);
            if (res.data.success) {
                dispatch(setUser(null));
                dispatch(setToken(null));
                localStorage.removeItem("token");
                navigate("/");
                toast.success(res.data.message || "Logged out successfully.");
            }
        } catch (error) {
            console.error("LOGOUT_ERROR:", error);
            // Even if backend fails, clear client session safely
            dispatch(setUser(null));
            dispatch(setToken(null));
            localStorage.removeItem("token");
            navigate("/");
            toast.success("Logged out.");
        }
    }

    return (
        <div className='fixed top-0 left-0 right-0 z-50 bg-white/20 backdrop-blur-lg border-b border-white/30'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-20 px-4'>
                <div>
                    <Link to="/">
                        <h1 className='text-3xl font-black text-gray-800'>
                            Job<span className='text-clay-terracotta'>Hunt</span>
                        </h1>
                    </Link>
                </div>
                
                <div className='flex items-center gap-12'>
                    {/* --- MAIN NAVIGATION MENU --- */}
                    <ul className='flex font-black text-gray-700 items-center gap-8 uppercase tracking-widest text-sm'>
                        {/* 🌟 ALWAYS VISIBLE FOR EVERYONE */}
                        <li className={`hover:text-clay-terracotta transition-all cursor-pointer ${location.pathname === '/' ? 'text-clay-terracotta' : ''}`}>
                            <Link to="/">Home</Link>
                        </li>
                        <li className={`hover:text-clay-terracotta transition-all cursor-pointer ${location.pathname === '/jobs' ? 'text-clay-terracotta' : ''}`}>
                            <Link to="/jobs">Jobs</Link>
                        </li>
                        <li className={`hover:text-clay-terracotta transition-all cursor-pointer ${location.pathname === '/browse' ? 'text-clay-terracotta' : ''}`}>
                            <Link to="/browse">Browse</Link>
                        </li>

                        {/* 👑 RECRUITER SPECIFIC EXTRA LINKS */}
                        {user && user.role === 'recruiter' && (
                            <>
                                <li className={`hover:text-clay-terracotta transition-all cursor-pointer ${location.pathname.includes('/admin/companies') ? 'text-clay-terracotta' : ''}`}>
                                    <Link to="/admin/companies">Companies</Link>
                                </li>
                                <li className={`hover:text-clay-terracotta transition-all cursor-pointer ${location.pathname.includes('/admin/jobs') ? 'text-clay-terracotta' : ''}`}>
                                    <Link to="/admin/jobs">Jobs Management</Link>
                                </li>
                            </>
                        )}
                        
                        {/* 🎓 STUDENT SPECIFIC EXTRA LINKS */}
                        {user && user.role === 'student' && (
                            <>
                                <li className={`hover:text-clay-terracotta transition-all cursor-pointer ${location.pathname === '/saved-jobs' ? 'text-clay-terracotta' : ''}`}>
                                    <Link to="/saved-jobs">Saved</Link>
                                </li>
                                <li className={`hover:text-clay-terracotta transition-all cursor-pointer ${location.pathname === '/applied-jobs' ? 'text-clay-terracotta' : ''}`}>
                                    <Link to="/applied-jobs">Applied</Link>
                                </li>
                            </>
                        )}
                    </ul>

                    {!user ? (
                        <div className='flex items-center gap-4'>
                            <Link to="/login">
                                <Button variant="outline" className="rounded-full font-bold px-6 border-2">Login</Button>
                            </Link>
                            <Link to="/signup">
                                <Button className="rounded-full font-bold px-6 bg-clay-peach hover:bg-clay-terracotta text-white transition-all">Signup</Button>
                            </Link>
                        </div>
                    ) : (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Avatar className="cursor-pointer border-2 border-white shadow-clay">
                                    <AvatarImage src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"} alt="profile" />
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 rounded-[35px] p-6 shadow-clay border-white/50 bg-white/90 backdrop-blur-xl mt-2">
                                <div className='flex gap-4 items-center mb-6 border-b border-gray-100 pb-4'>
                                    <Avatar className="w-14 h-14 border-2 border-clay-peach/30">
                                        <AvatarImage src={user?.profile?.profilePhoto} />
                                    </Avatar>
                                    <div>
                                        <h4 className='font-black text-xl text-gray-800 leading-tight'>{user?.fullname}</h4>
                                        {user?.profile?.bio && (
                                            <p className='text-xs text-gray-500 font-bold mt-1 uppercase tracking-tighter line-clamp-1'>
                                                {user?.profile?.bio}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className='flex flex-col gap-3'>
                                    {user && user.role === 'recruiter' && (
                                        <Link to="/admin/companies" className='flex items-center gap-3 p-3 hover:bg-gray-50 rounded-2xl transition-all group'>
                                            <LayoutDashboard className='w-5 h-5 text-gray-400 group-hover:text-clay-terracotta' />
                                            <span className='font-bold text-gray-700 group-hover:text-gray-900'>Admin Panel</span>
                                        </Link>
                                    )}

                                    <Link to="/profile" className='flex items-center gap-3 p-3 hover:bg-gray-50 rounded-2xl transition-all group'>
                                        <User className='w-5 h-5 text-gray-400 group-hover:text-clay-terracotta' />
                                        <span className='font-bold text-gray-700 group-hover:text-gray-900'>View Profile</span>
                                    </Link>
                                    
                                    <div 
                                        onClick={logoutHandler} 
                                        className='flex items-center gap-3 p-3 hover:bg-red-50 rounded-2xl transition-all group cursor-pointer'
                                    >
                                        <LogOut className='w-5 h-5 text-red-400' />
                                        <span className='font-bold text-red-500'>Logout</span>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Navbar;
