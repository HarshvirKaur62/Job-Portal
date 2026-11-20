import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button' 
import { useNavigate } from 'react-router-dom' 
import { useDispatch } from 'react-redux' 
import AdminJobsTable from './AdminJobsTable'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import { setSearchJobByText } from '@/redux/jobSlice'

const AdminJobs = () => {
  useGetAllAdminJobs();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]);

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', backgroundColor: '#bcc6bc', blockBehavior: 'none' }}>
      {/* Absolute high-priority Navbar positioning layer */}
      <div style={{ position: 'relative', zIndex: 9999 }}>
        <Navbar />
      </div>

      {/* Content wrapper with built-in top spacing pushing past the header boundaries */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '120px', paddingLeft: '20px', paddingRight: '20px', position: 'relative', zIndex: 100 }}>
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(12px)', borderRadius: '40px', padding: '32px', border: '4px solid rgba(255,255,255,0.3)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '20px', gap: '16px' }}>
            <Input
              style={{ width: '300px', backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: '9999px', padding: '12px 24px' }}
              placeholder="Filter by name, role"
              onChange={(e) => setInput(e.target.value)}
            />
            <Button 
              style={{ borderRadius: '9999px', backgroundColor: '#1f2937', color: '#ffffff', fontWeight: 'bold', padding: '12px 32px', cursor: 'pointer' }}
              onClick={() => navigate("/admin/jobs/create")}
            >
                New Jobs
            </Button>
          </div>

          <AdminJobsTable />
        </div>
      </div>
    </div>
  )
}

export default AdminJobs