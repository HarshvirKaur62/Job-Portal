import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import MainLayout from './layout/MainLayout'

const AppliedJobTable = () => {
    useGetAppliedJobs();
    const { allAppliedJobs } = useSelector(store => store.job);
    const appliedList = allAppliedJobs || [];

    return (
        <MainLayout>
            <div className='max-w-7xl mx-auto px-4'>
                <div className='bg-white/30 backdrop-blur-md border-4 border-white/30 rounded-[40px] p-10 shadow-clay'>
                    <h1 className='font-black text-3xl mb-8 text-gray-800'>My Applied Jobs</h1>
                    
                    <Table>
                        <TableCaption className="mt-4">A complete history of your applications</TableCaption>
                        <TableHeader className="bg-gray-100/50">
                            <TableRow>
                                <TableHead className="font-bold py-4">Date</TableHead>
                                <TableHead className="font-bold py-4">Job Role</TableHead>
                                <TableHead className="font-bold py-4">Company</TableHead>
                                <TableHead className="text-right font-bold py-4">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {appliedList.length <= 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-20 text-gray-400 font-medium">
                                        You haven't applied to any jobs yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                appliedList.map((appliedJob) => (
                                    <TableRow key={appliedJob._id} className="hover:bg-white/50 transition-colors">
                                        <TableCell className="py-4 font-medium">{appliedJob?.createdAt?.split("T")[0] || "Recent"}</TableCell>
                                        <TableCell className="font-bold text-gray-800">{appliedJob?.job?.title || "N/A"}</TableCell>
                                        <TableCell>{appliedJob?.job?.company?.name || "N/A"}</TableCell>
                                        <TableCell className="text-right py-4">
                                            <Badge className={`rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider ${
                                                appliedJob.status === "rejected" ? 'bg-red-500 text-white' : 
                                                appliedJob.status === 'pending' ? 'bg-gray-500 text-white' : 
                                                'bg-green-500 text-white'
                                            }`}>
                                                {appliedJob.status || 'pending'}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </MainLayout>
    )
}

export default AppliedJobTable;
