import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector(store => store.company);
    const [filterCompany, setFilterCompany] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const safeCompanies = companies || [];
        const filteredCompany = safeCompanies.filter((company) => {
            if (!searchCompanyByText) return true;
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
        });
        setFilterCompany(filteredCompany);
    }, [companies, searchCompanyByText]);

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent registered companies</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Logo</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {(!filterCompany || filterCompany.length === 0) ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 font-medium text-gray-500">
                                No companies found. Click "New Company" to register your first company!
                            </TableCell>
                        </TableRow>
                    ) : (
                        filterCompany.map((company) => (
                            <TableRow key={company?._id}>
                                <TableCell>
                                    <Avatar className="h-10 w-10 border border-white/50">
                                        <AvatarImage src={company?.logo || "https://github.com/shadcn.png"} />
                                    </Avatar>
                                </TableCell>
                                <TableCell className="font-bold text-gray-800">{company?.name}</TableCell>
                                <TableCell>{company?.createdAt ? company.createdAt.split("T")[0] : "Recent"}</TableCell>
                                <TableCell className="text-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <button className='hover:bg-white/20 p-2 rounded-full transition-all focus:outline-none'>
                                                <MoreHorizontal />
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32 p-2 bg-white/90 backdrop-blur-md rounded-2xl border border-white/40 shadow-clay">
                                            <div 
                                                onClick={() => navigate(`/admin/companies/${company._id}`)} 
                                                className='flex items-center gap-2 w-full cursor-pointer hover:bg-white/60 p-2 rounded-xl transition-colors'
                                            >
                                                <Edit2 className='w-4 h-4 text-gray-700' />
                                                <span className='font-bold text-gray-700 text-sm'>Edit</span>
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

export default CompaniesTable
