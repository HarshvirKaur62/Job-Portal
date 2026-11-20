import React from 'react'
import Navbar from '../shared/Navbar'

const MainLayout = ({ children }) => {
    return (
        <div className='min-h-screen bg-[#bcc6bc] relative overflow-hidden flex flex-col'>
            
            {/* Global Clay Sphere Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-10 left-10 w-32 h-32 bg-[#d1d8d1] rounded-full shadow-clay" />
                <div className="absolute top-16 right-20 w-16 h-16 bg-[#e4b293] rounded-full shadow-clay opacity-80" />
                <div className="absolute top-48 right-[15%] w-24 h-24 bg-[#a66a50] rounded-full shadow-clay" />
                <div className="absolute top-[15%] left-[5%] w-48 h-48 bg-[#a66a50] rounded-full shadow-clay opacity-90" />
                <div className="absolute top-[60%] right-[-100px] w-[500px] h-[500px] bg-[#a66a50] rounded-full shadow-clay opacity-80" />
                <div className="absolute bottom-12 right-[25%] w-28 h-28 bg-[#e4b293] rounded-full shadow-clay" />
                <div className="absolute bottom-8 left-10 w-32 h-32 bg-[#a66a50] rounded-full shadow-clay opacity-80" />
            </div>

            <Navbar />

            <main className='relative z-10 flex flex-col w-full pt-32 pb-20'>
                {children}
            </main>
        </div>
    )
}

export default MainLayout