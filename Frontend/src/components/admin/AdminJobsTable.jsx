import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '../ui/table'
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '../ui/popover'
import { Edit2, Eye, MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const AdminJobsTable = () => {
    const { allAdminJobs, searchJobByText } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const safeJobsList = allAdminJobs || [];
        
        const filteredJobs = safeJobsList.filter((job) => {
            if (!searchJobByText) return true;

            return (
                job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
                job?.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase())
            );
        });

        setFilterJobs(filteredJobs);
    }, [allAdminJobs, searchJobByText]);

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent posted jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filterJobs?.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 font-medium text-gray-500">
                                No jobs found. Click "New Jobs" to post your first listing!
                            </TableCell>
                        </TableRow>
                    ) : (
                        filterJobs.map((job) => (
                            <TableRow key={job._id}>
                                <TableCell className="font-bold text-gray-800">
                                    {job?.company?.name || "N/A"}
                                </TableCell>
                                <TableCell>{job?.title}</TableCell>
                                <TableCell>
                                    {job?.createdAt ? job.createdAt.split("T")[0] : "Recent"}
                                </TableCell>
                                <TableCell className="text-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <button className='hover:bg-white/20 p-2 rounded-full transition-all focus:outline-none'>
                                                <MoreHorizontal />
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-40 p-2 bg-white/90 backdrop-blur-md rounded-2xl border border-white/40 shadow-clay">
                                            
                                            {/* Navigate to edit page */}
                                            <div
                                                onClick={() => navigate(`/admin/jobs/${job._id}/edit`)}
                                                className='flex items-center gap-2 w-full cursor-pointer hover:bg-white/60 p-2 rounded-xl transition-colors'
                                            >
                                                <Edit2 className='w-4 h-4 text-gray-700' />
                                                <span className='font-bold text-gray-700 text-sm'>Edit</span>
                                            </div>

                                            <div
                                                onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                                                className='flex items-center gap-2 w-full cursor-pointer hover:bg-white/60 p-2 rounded-xl transition-colors mt-1'
                                            >
                                                <Eye className='w-4 h-4 text-gray-700' />
                                                <span className='font-bold text-gray-700 text-sm'>Applicants</span>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default AdminJobsTable
