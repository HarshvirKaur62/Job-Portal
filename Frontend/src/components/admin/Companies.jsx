import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import CompaniesTable from './CompaniesTable'
import { useNavigate } from 'react-router-dom'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import { useDispatch } from 'react-redux'
import { setSearchCompanyByText } from '@/redux/companySlice'

const Companies = () => {
    useGetAllCompanies();
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setSearchCompanyByText(input));
    }, [input]);

    return (
        <div className='bg-sage min-h-screen relative overflow-hidden flex flex-col'>
            <Navbar />

            {/* 3D Spheres Background Elements */}
            <div className="fixed top-20 -right-20 w-96 h-96 bg-clay-terracotta rounded-full shadow-clay z-0 opacity-80" />
            <div className="fixed bottom-40 right-20 w-24 h-24 bg-clay-peach rounded-full shadow-clay z-0" />
            <div className="fixed -bottom-20 -left-20 w-72 h-72 bg-clay-terracotta rounded-full shadow-clay z-0 opacity-80" />
            <div className="fixed top-40 left-10 w-32 h-32 bg-sage-light rounded-full shadow-clay z-0" />
            <div className="fixed bottom-10 left-1/2 w-16 h-16 bg-white/40 rounded-full shadow-clay z-0" />

            <div className='max-w-6xl mx-auto my-10 relative z-10 w-full px-4'>
                <div className='bg-sage-light/40 backdrop-blur-md border-4 border-white/30 rounded-[40px] p-8 shadow-clay'>
                    <div className='flex items-center justify-between my-5 gap-4'>
                        <Input
                            className="w-fit bg-white/60 border-none rounded-full px-6 shadow-sm focus-visible:ring-clay-peach"
                            placeholder="Filter by name"
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <Button 
                            className="rounded-full bg-gray-800 hover:bg-clay-terracotta text-white font-bold px-8 shadow-clay transition-all active:scale-95"
                            onClick={() => navigate("/admin/companies/create")}
                        >
                            New Company
                        </Button>
                    </div>
                    <CompaniesTable />
                </div>
            </div>
        </div>
    )
}

export default Companies