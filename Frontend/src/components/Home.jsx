import React from 'react'
import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import Footer from './shared/Footer'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import MainLayout from './layout/MainLayout'

const Home = () => {
  // Fetch jobs dynamically for the landing display
  useGetAllJobs();

  return (
    <MainLayout>
        <HeroSection />
        <CategoryCarousel />
        <LatestJobs />
        <Footer />
    </MainLayout>
  )
}

export default Home