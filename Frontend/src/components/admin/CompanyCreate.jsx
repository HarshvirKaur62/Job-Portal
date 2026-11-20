import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setSingleCompany } from '@/redux/companySlice'
import { Loader2 } from 'lucide-react'

const CompanyCreate = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState(""); 
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const registerNewCompany = async (e) => {
        if (e) e.preventDefault();
        if (!companyName.trim()) {
            toast.error("Company name is required");
            return;
        }
        try {
            setLoading(true);
            const res = await axios.post(`${COMPANY_API_END_POINT}/register`, { companyName }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res?.data?.success) {
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message);
                const companyId = res?.data?.company?._id;
                navigate(`/admin/companies/${companyId}`);
            }
        } catch (error) {
            console.error("Register company error:", error);
            toast.error(error.response?.data?.message || "Failed to register company");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='bg-sage min-h-screen relative overflow-hidden flex flex-col'>
            <Navbar />

            {/* 3D Spheres Background Elements */}
            <div className="fixed top-20 -right-20 w-96 h-96 bg-clay-terracotta rounded-full shadow-clay z-0 opacity-80" />
            <div className="fixed bottom-20 right-40 w-24 h-24 bg-sage-light rounded-full shadow-clay z-0" />
            <div className="fixed -bottom-20 -left-20 w-80 h-80 bg-clay-terracotta rounded-full shadow-clay z-0 opacity-80" />
            <div className="fixed top-60 left-10 w-20 h-20 bg-clay-peach rounded-full shadow-clay z-0" />
            <div className="fixed top-1/2 left-1/3 w-12 h-12 bg-white/20 rounded-full shadow-clay z-0 blur-sm" />

            <div className='max-w-4xl mx-auto my-auto relative z-10 w-full px-4'>
                {/* Glassmorphism Container */}
                <form 
                    onSubmit={registerNewCompany}
                    className='bg-sage-light/40 backdrop-blur-md border-4 border-white/30 rounded-[40px] p-10 shadow-clay'
                >
                    <div className='my-5'>
                        <h1 className='font-bold text-3xl text-gray-800'>Your Company Name</h1>
                        <p className='text-gray-600 mt-2 font-medium'>What would you like to give your company name? You can change this later.</p>
                    </div>

                    <Label className="text-gray-700 font-bold text-lg">Company Name</Label>
                    <Input
                        type="text"
                        className="my-3 bg-white/60 border-none rounded-xl p-6 shadow-sm focus-visible:ring-clay-peach font-semibold text-lg"
                        placeholder="JobHunt, Google, Microsoft etc."
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                    />

                    <div className='flex items-center gap-4 my-10'>
                        <Button 
                            type="button"
                            variant="outline" 
                            className="rounded-full px-8 border-gray-400 hover:bg-white/50 font-bold"
                            onClick={() => navigate("/admin/companies")}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit"
                            disabled={loading}
                            className="rounded-full bg-[#1e293b] hover:bg-[#a66a50] text-white font-bold px-10 shadow-clay transition-all active:scale-95"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                            Continue
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CompanyCreate
