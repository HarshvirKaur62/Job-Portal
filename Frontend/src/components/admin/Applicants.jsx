import React, { useEffect } from 'react'
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';

const Applicants = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const { applicants } = useSelector(store => store.application);

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await axios.get(
                    `${APPLICATION_API_END_POINT}/${params.id}/applicants`,
                    { withCredentials: true }
                );

                dispatch(setAllApplicants(res.data.job));
            } catch (error) {
                console.log(error);
            }
        };

        fetchAllApplicants();
    }, []);

    return (
        <div className='bg-sage min-h-screen relative overflow-hidden flex flex-col'>
            <Navbar />

            {/* Background Shapes */}
            <div className="fixed top-20 -right-20 w-96 h-96 bg-clay-terracotta rounded-full shadow-clay z-0 opacity-80" />
            <div className="fixed bottom-20 right-40 w-20 h-20 bg-sage-light rounded-full shadow-clay z-0" />
            <div className="fixed -bottom-20 -left-20 w-72 h-72 bg-clay-terracotta rounded-full shadow-clay z-0 opacity-80" />
            <div className="fixed top-60 left-20 w-16 h-16 bg-clay-peach rounded-full shadow-clay z-0" />

            <div className='max-w-6xl mx-auto my-10 relative z-10 w-full px-4'>
                <div className='bg-sage-light/40 backdrop-blur-md border-4 border-white/30 rounded-[40px] p-8 shadow-clay'>
                    
                    <h1 className='font-bold text-3xl mb-6'>
                        Applicants ({applicants?.applications?.length || 0})
                    </h1>

                    <ApplicantsTable />
                </div>
            </div>
        </div>
    )
}

export default Applicants