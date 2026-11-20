import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Mail, Contact, FileText, Pen } from 'lucide-react'
import { useSelector } from 'react-redux'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import { Button } from './ui/button'
import UpdateProfileDialog from './UpdateProfileDialog'

const Profile = () => {
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const isHaveResume = user?.profile?.resume;

    return (
        <div className='bg-[#bcc6bc] min-h-screen relative overflow-hidden flex flex-col'>
            <Navbar />
            
            <div className="fixed top-20 -right-20 w-96 h-96 bg-[#a66a50] rounded-full shadow-clay z-0 opacity-80" />
            <div className="fixed top-60 left-10 w-20 h-20 bg-[#e4b293] rounded-full shadow-clay z-0" />

            <div className='max-w-4xl mx-auto my-10 relative z-10 w-full px-4 pt-20'>
                <div className='bg-white/25 backdrop-blur-2xl border-4 border-white/30 rounded-[50px] p-10 shadow-2xl relative'>
                    
                    {/* Edit Profile Button */}
                    <div className="absolute top-10 right-10">
                        <Button 
                            onClick={() => setOpen(true)}
                            variant="outline" 
                            className="rounded-full bg-white/60 hover:bg-white/80 border-2 border-white/60 font-bold flex items-center gap-2 shadow-sm"
                        >
                            <Pen className="w-4 h-4 text-[#a66a50]" />
                            <span>Edit Profile</span>
                        </Button>
                    </div>

                    <div className='flex items-center gap-6 mb-10'>
                        <Avatar className="h-32 w-32 border-4 border-white shadow-clay">
                            <AvatarImage src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"} alt="profile" />
                        </Avatar>
                        <div>
                            <h1 className='font-black text-4xl text-gray-800'>{user?.fullname}</h1>
                            <p className='text-[#a66a50] font-bold capitalize text-xl'>{user?.role}</p>
                            {user?.profile?.bio && (
                                <p className='text-gray-600 italic mt-2 font-medium'>{user?.profile?.bio}</p>
                            )}
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div className='flex items-center gap-4 bg-white/40 p-5 rounded-3xl border border-white/20 shadow-sm'>
                            <Mail className='text-[#a66a50]' />
                            <span className='font-bold text-gray-700'>{user?.email}</span>
                        </div>
                        <div className='flex items-center gap-4 bg-white/40 p-5 rounded-3xl border border-white/20 shadow-sm'>
                            <Contact className='text-[#a66a50]' />
                            <span className='font-bold text-gray-700'>{user?.phoneNumber || "Not provided"}</span>
                        </div>
                    </div>

                    {user?.role === 'student' && (
                        <div className='mt-10 space-y-8'>
                            {/* Skills Section */}
                            <div className='bg-white/30 p-8 rounded-[35px] border border-white/20 shadow-sm'>
                                <h2 className='text-2xl font-black text-gray-800 mb-5'>Skills</h2>
                                <div className='flex flex-wrap gap-3'>
                                    {user?.profile?.skills && user.profile.skills.length > 0 ? (
                                        user.profile.skills.map((s, i) => (
                                            <Badge key={i} className="bg-[#a66a50] text-white px-6 py-2 rounded-full font-bold text-sm shadow-sm">
                                                {s}
                                            </Badge>
                                        ))
                                    ) : <span className='text-gray-500 font-bold italic'>No skills added yet. Click "Edit Profile" to add.</span>}
                                </div>
                            </div>

                            {/* Resume Section */}
                            <div className='bg-white/30 p-8 rounded-[35px] border border-white/20 shadow-sm'>
                                <Label className="text-2xl font-black text-gray-800">Resume</Label>
                                <div className='mt-5'>
                                    {isHaveResume ? (
                                        <a href={user?.profile?.resume} target='_blank' rel='noreferrer' className='flex items-center gap-4 w-fit bg-white/60 hover:bg-white/80 p-4 rounded-3xl border-2 border-[#a66a50]/20 transition-all group shadow-sm'>
                                            <FileText className='text-[#a66a50]' />
                                            <span className='font-black text-gray-700 group-hover:text-[#a66a50]'>{user?.profile?.resumeOriginalName || "Download Resume"}</span>
                                        </a>
                                    ) : <div className='text-gray-500 font-bold italic'>No resume uploaded. Click "Edit Profile" to upload.</div>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Profile update modal */}
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile
