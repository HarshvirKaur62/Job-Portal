import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/hero-team.png'; 

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div className="bg-sage pt-24 pb-32 relative overflow-hidden">
            {/* --- EXTENDED DECORATIVE 3D ELEMENTS --- */}
            {/* Top Right Ring Cluster */}
            <div className="absolute top-20 right-[-50px] w-64 h-64 bg-clay-terracotta rounded-full shadow-clay z-0 flex items-center justify-center">
                <div className="w-40 h-40 bg-clay-terracotta/50 rounded-full border border-white/20" />
            </div>

            {/* Floating Accents Across Screen */}
            <div className="absolute top-60 right-40 w-12 h-12 bg-clay-peach rounded-full shadow-clay z-0" />
            <div className="absolute bottom-20 left-[-30px] w-32 h-32 bg-clay-terracotta rounded-full shadow-clay z-0" />
            <div className="absolute top-10 left-10 w-16 h-16 bg-sage-light rounded-full shadow-clay z-0" />
            <div className="absolute bottom-10 right-1/3 w-14 h-14 bg-sage-light rounded-full shadow-clay z-0 opacity-40 blur-[1px]" />
            <div className="absolute top-1/4 left-1/3 w-8 h-8 bg-clay-peach rounded-full shadow-clay z-0" />
            
            {/* Far Background Rings */}
            <div className="absolute -bottom-10 right-20 w-48 h-48 border-[15px] border-clay-terracotta/10 rounded-full z-0" />

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 px-6 relative z-10">
                
                {/* Left Side: Illustration */}
                <div className="w-full md:w-[40%] flex justify-center items-center mb-10 md:mb-0 order-2 md:order-1">
                   <img 
                     src={heroImage} 
                     alt="Team Illustration" 
                     className="w-full h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.2)] animate-float" 
                   />
                </div>

                {/* Right Side: Content */}
                <div className="w-full md:w-[50%] text-center md:text-left relative z-20 order-1 md:order-2">
                    <div className="flex justify-center">
                        <span className="inline-block px-8 py-3 rounded-full bg-clay-peach text-white text-base font-black shadow-clay mb-6 tracking-wide uppercase">
                            No. 1 Job Hunt Website
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 leading-tight text-center">
                        Search, Apply & <br />
                        <span className="relative inline-block">
                            Get Your <span className="text-clay-terracotta">Dream Jobs</span>
                        </span>
                    </h1>

                    <p className="mt-6 text-gray-700 font-medium max-w-lg mx-auto text-center">
                        Explore thousands of job opportunities with all the information you need. 
                        It's your future. Let's build it together.
                    </p>

                    <div className="mt-10 flex items-center max-w-lg bg-sage-light border-4 border-sage-dark/30 rounded-full shadow-clay-inner p-1.5 focus-within:border-sage-dark transition-all mx-auto">
                        <input
                            type="text"
                            placeholder="Find your dream jobs"
                            onChange={(e) => setQuery(e.target.value)}
                            className="flex-1 px-6 py-3 bg-transparent outline-none text-gray-800 placeholder-gray-500 font-semibold w-full"
                        />
                        <Button
                            onClick={searchJobHandler}
                            className="rounded-full w-12 h-12 bg-clay-peach hover:scale-105 shadow-clay transition-all active:scale-95 shrink-0"
                        >
                            <Search className="h-5 w-5 text-white" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroSection;