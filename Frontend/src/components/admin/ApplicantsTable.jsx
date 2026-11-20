import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '../ui/table';

import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '../ui/popover';

import { Badge } from '../ui/badge';
import { MoreHorizontal } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { setAllApplicants } from '@/redux/applicationSlice';
import axios from 'axios';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);
    const dispatch = useDispatch();

    const statusHandler = async (status, id) => {
        try {
            axios.defaults.withCredentials = true;

            const res = await axios.post(
                `${APPLICATION_API_END_POINT}/status/${id}/update`,
                { status }
            );

            if (res.data.success) {
                toast.success(res.data.message);
                // Update local redux state immediately so status updates on the UI
                if (applicants?.applications) {
                    const updatedApps = applicants.applications.map(app => 
                        app._id === id ? { ...app, status: status.toLowerCase() } : app
                    );
                    dispatch(setAllApplicants({ ...applicants, applications: updatedApps }));
                }
            }
        } catch (error) {
            console.error("Status update error:", error);
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    };

    return (
        <div>
            <Table>
                <TableCaption className="text-gray-700 mt-4">
                    A list of your recent applied users
                </TableCaption>

                <TableHeader>
                    <TableRow className="border-white/30">
                        <TableHead>Full Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {
                        applicants?.applications?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 font-medium text-gray-500">
                                    No applicants yet for this job.
                                </TableCell>
                            </TableRow>
                        ) : (
                            applicants?.applications?.map((item) => (
                                <TableRow
                                    key={item._id}
                                    className="border-white/20 hover:bg-white/10 transition-all"
                                >
                                    <TableCell className="font-bold text-gray-800">
                                        {item?.applicant?.fullname || "Unknown"}
                                    </TableCell>

                                    <TableCell className="font-medium text-gray-700">
                                        {item?.applicant?.email || "N/A"}
                                    </TableCell>

                                    <TableCell className="font-medium text-gray-700">
                                        {item?.applicant?.phoneNumber || "N/A"}
                                    </TableCell>

                                    <TableCell>
                                        {
                                            item?.applicant?.profile?.resume ? (
                                                <a
                                                    className="text-blue-700 font-bold hover:underline"
                                                    href={item?.applicant?.profile?.resume}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {item?.applicant?.profile?.resumeOriginalName || "View Resume"}
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 italic font-medium">NA</span>
                                            )
                                        }
                                    </TableCell>

                                    <TableCell className="font-medium">
                                        {item?.createdAt ? item.createdAt.split("T")[0] : "Recent"}
                                    </TableCell>

                                    <TableCell>
                                        <Badge className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                                            item?.status === 'rejected' ? 'bg-red-500 text-white' :
                                            item?.status === 'accepted' ? 'bg-green-500 text-white' :
                                            'bg-yellow-500 text-white'
                                        }`}>
                                            {item?.status || 'pending'}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button className='hover:bg-white/20 p-2 rounded-full transition-all focus:outline-none'>
                                                    <MoreHorizontal />
                                                </button>
                                            </PopoverTrigger>

                                            <PopoverContent className="w-32 p-2 bg-white/95 backdrop-blur-md rounded-2xl border border-white/50 shadow-clay">
                                                {
                                                    shortlistingStatus.map((status, index) => (
                                                        <div
                                                            key={index}
                                                            onClick={() => statusHandler(status, item?._id)}
                                                            className='flex items-center gap-2 w-full cursor-pointer hover:bg-white/60 p-2 rounded-xl transition-colors'
                                                        >
                                                            <span className="font-bold text-sm text-gray-700">{status}</span>
                                                        </div>
                                                    ))
                                                }
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                </TableRow>
                            ))
                        )
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default ApplicantsTable
