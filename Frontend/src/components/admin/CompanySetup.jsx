import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import useGetCompanyById from '@/hooks/useGetCompanyById'

const CompanySetup = () => {
    const params = useParams();

    useGetCompanyById(params.id);

    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null
    });

    const { singleCompany } = useSelector(store => store.company);

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        });
    };

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];

        setInput({
            ...input,
            file
        });
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!params.id) {
            toast.error("Company ID is missing from URL");
            return;
        }

        const formData = new FormData();

        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);

        if (input.file && typeof input.file !== "string") {
            formData.append("file", input.file);
        }

        try {
            setLoading(true);

            const res = await axios.put(
                `${COMPANY_API_END_POINT}/update/${params.id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                }
            );

            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/companies");
            }

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to update company");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (singleCompany) {
            setInput({
                name: singleCompany.name || "",
                description: singleCompany.description || "",
                website: singleCompany.website || "",
                location: singleCompany.location || "",
                file: singleCompany.logo || null
            });
        }
    }, [singleCompany]);

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
                            onClick={() => navigate("/admin/companies")}
                            variant="outline"
                            className="rounded-full px-5 py-5 bg-white/60 border-white/40 hover:bg-white/80 shadow-sm"
                        >
                            <ArrowLeft className='w-4 h-4 mr-2' />
                            Back
                        </Button>

                        <h1 className='font-bold text-4xl text-gray-800'>
                            Company Setup
                        </h1>
                    </div>

                    {/* Form */}
                    <form onSubmit={submitHandler}>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>

                            <div>
                                <Label className="text-base font-semibold text-gray-700 mb-2 block">
                                    Company Name
                                </Label>

                                <Input
                                    type="text"
                                    name="name"
                                    value={input.name}
                                    onChange={changeEventHandler}
                                    className="bg-white/70 border-none rounded-2xl h-14 px-6 text-base shadow-sm focus-visible:ring-[#e4b293]"
                                />
                            </div>

                            <div>
                                <Label className="text-base font-semibold text-gray-700 mb-2 block">
                                    Description
                                </Label>

                                <Input
                                    type="text"
                                    name="description"
                                    value={input.description}
                                    onChange={changeEventHandler}
                                    className="bg-white/70 border-none rounded-2xl h-14 px-6 text-base shadow-sm focus-visible:ring-[#e4b293]"
                                />
                            </div>

                            <div>
                                <Label className="text-base font-semibold text-gray-700 mb-2 block">
                                    Website
                                </Label>

                                <Input
                                    type="text"
                                    name="website"
                                    value={input.website}
                                    onChange={changeEventHandler}
                                    className="bg-white/70 border-none rounded-2xl h-14 px-6 text-base shadow-sm focus-visible:ring-[#e4b293]"
                                />
                            </div>

                            <div>
                                <Label className="text-base font-semibold text-gray-700 mb-2 block">
                                    Location
                                </Label>

                                <Input
                                    type="text"
                                    name="location"
                                    value={input.location}
                                    onChange={changeEventHandler}
                                    className="bg-white/70 border-none rounded-2xl h-14 px-6 text-base shadow-sm focus-visible:ring-[#e4b293]"
                                />
                            </div>

                            <div className='md:col-span-2'>
                                <Label className="text-base font-semibold text-gray-700 mb-2 block">
                                    Logo
                                </Label>

                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={changeFileHandler}
                                    className="bg-white/70 border-none rounded-2xl h-14 px-4 py-3 shadow-sm cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Button */}
                        <div className='flex justify-center mt-12'>
                            {
                                loading ? (
                                    <Button
                                        disabled
                                        className="rounded-full bg-gray-800 text-white px-10 py-6 text-lg font-bold shadow-clay"
                                    >
                                        <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                                        Please wait
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        className="rounded-full bg-gray-800 hover:bg-[#a66a50] text-white px-12 py-6 text-lg font-bold shadow-clay transition-all active:scale-95"
                                    >
                                        Update
                                    </Button>
                                )
                            }
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CompanySetup