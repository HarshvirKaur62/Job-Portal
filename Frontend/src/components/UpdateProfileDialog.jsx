import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);

    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        bio: "",
        skills: "",
        file: null
    });
    const dispatch = useDispatch();

    useEffect(() => {
        if (user) {
            setInput({
                fullname: user.fullname || "",
                email: user.email || "",
                phoneNumber: user.phoneNumber || "",
                bio: user.profile?.bio || "",
                skills: Array.isArray(user.profile?.skills) ? user.profile.skills.join(", ") : (user.profile?.skills || ""),
                file: null
            });
        }
    }, [user, open]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file })
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);
        if (input.file) {
            formData.append("file", input.file);
        }
        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
                setOpen(false);
            }
        } catch (error) {
            console.error("Profile update error:", error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Dialog open={open}>
                <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-xl rounded-[30px] border-4 border-white/50 shadow-clay p-8" onInteractOutside={() => setOpen(false)}>
                    <DialogHeader>
                        <DialogTitle className="font-extrabold text-2xl text-gray-800">Update Profile</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitHandler}>
                        <div className='grid gap-4 py-4'>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="fullname" className="text-right font-bold text-gray-700">Name</Label>
                                <Input
                                    id="fullname"
                                    name="fullname"
                                    type="text"
                                    value={input.fullname}
                                    onChange={changeEventHandler}
                                    className="col-span-3 rounded-xl border border-gray-200"
                                    required
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="email" className="text-right font-bold text-gray-700">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={input.email}
                                    onChange={changeEventHandler}
                                    className="col-span-3 rounded-xl border border-gray-200"
                                    required
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="phoneNumber" className="text-right font-bold text-gray-700">Phone</Label>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="text"
                                    value={input.phoneNumber}
                                    onChange={changeEventHandler}
                                    className="col-span-3 rounded-xl border border-gray-200"
                                    required
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="bio" className="text-right font-bold text-gray-700">Bio</Label>
                                <Input
                                    id="bio"
                                    name="bio"
                                    value={input.bio}
                                    onChange={changeEventHandler}
                                    placeholder="Short bio"
                                    className="col-span-3 rounded-xl border border-gray-200"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="skills" className="text-right font-bold text-gray-700">Skills</Label>
                                <Input
                                    id="skills"
                                    name="skills"
                                    value={input.skills}
                                    onChange={changeEventHandler}
                                    placeholder="HTML, CSS, React, Node"
                                    className="col-span-3 rounded-xl border border-gray-200"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="file" className="text-right font-bold text-gray-700">Resume / Photo</Label>
                                <Input
                                    id="file"
                                    name="file"
                                    type="file"
                                    accept="application/pdf,image/*"
                                    onChange={fileChangeHandler}
                                    className="col-span-3 rounded-xl border border-gray-200 text-xs"
                                />
                            </div>
                        </div>
                        <DialogFooter className="flex gap-2">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setOpen(false)}
                                className="rounded-full font-bold"
                            >
                                Cancel
                            </Button>
                            {
                                loading ? (
                                    <Button disabled className="rounded-full bg-gray-800 text-white font-bold">
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                                    </Button>
                                ) : (
                                    <Button type="submit" className="rounded-full bg-[#a66a50] hover:bg-[#8e5a44] text-white font-bold shadow-clay">
                                        Update
                                    </Button>
                                )
                            }
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UpdateProfileDialog
