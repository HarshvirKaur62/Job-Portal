import { setAllAdminJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllAdminJobs = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllAdminJobs = async () => {
            try {
                // ✨ FIXED: Changed path string to match your backend definition exactly
                const res = await axios.get(`${JOB_API_END_POINT}/adminjobs`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setAllAdminJobs(res.data.jobs));
                }
            } catch (error) {
                console.error("Error fetching admin jobs:", error);
            }
        }
        fetchAllAdminJobs();
    }, [dispatch]);
}

export default useGetAllAdminJobs;