import React from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from './ui/carousel';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';

const categories = [
    "Frontend Developer",
    "Backend Developer",
    "Data Engineer",
    "Graphic Designer",
    "FullStack Developer"
];

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    };

    return (
        <div className="my-8"> {/* Reduced margin from 16 to 8 */}
            <Carousel className="w-full max-w-2xl mx-auto relative">
                <CarouselPrevious className="left-[-40px] bg-white shadow-clay border-none" />
                <CarouselContent>
                    {categories.map((cat, index) => (
                        <CarouselItem
                            key={index}
                            className="basis-1/2 md:basis-1/3 flex justify-center"
                        >
                            <button
                                onClick={() => searchJobHandler(cat)}
                                className="px-6 py-3 bg-white text-gray-700 font-bold rounded-full shadow-clay hover:bg-clay-peach hover:text-white transition-all duration-300"
                            >
                                {cat}
                            </button>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselNext className="right-[-40px] bg-white shadow-clay border-none" />
            </Carousel>
        </div>
    );
};

export default CategoryCarousel;


