import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'

// The missing data array that caused your error
const fitlerData = [
    {
        fitlerType: "Location",
        array: ["Chandigarh", "Mohali", "Hyderabad", "Pune", "Mumbai", "Banglore"]
    },
    {
        fitlerType: "Industry",
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer", "Data Scientist", "DevOps Developer"]
    },
    {
        fitlerType: "Salary",
        array: ["0-40k", "42-1lakh", "1lakh to 5lakh"]
    },
]

const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const dispatch = useDispatch();

    const changeHandler = (value) => {
        setSelectedValue(value);
    }

    useEffect(() => {
        dispatch(setSearchedQuery(selectedValue));
    }, [selectedValue, dispatch]);

    return (
        <div className='w-full bg-sage-light/30 backdrop-blur-sm p-6 rounded-[35px] shadow-clay-inner border border-sage-dark/10 h-fit'>
            <h1 className='font-extrabold text-2xl text-gray-800 mb-2'>Filter Jobs</h1>
            <div className='h-1 w-12 bg-clay-peach rounded-full mb-6' />
            
            {/* value prop ensures the selected dot shows up */}
            <RadioGroup value={selectedValue} onValueChange={changeHandler}>
                {fitlerData.map((data, index) => (
                    <div key={index} className='mb-6'>
                        <h1 className='font-bold text-lg text-gray-700 mb-3'>{data.fitlerType}</h1>
                        <div className='space-y-3'>
                            {data.array.map((item, idx) => {
                                const itemId = `id${index}-${idx}`;
                                return (
                                    <div key={itemId} className='flex items-center space-x-3 group cursor-pointer'>
                                        <RadioGroupItem value={item} id={itemId} />
                                        <Label 
                                            htmlFor={itemId} 
                                            className="text-gray-600 font-medium group-hover:text-clay-terracotta transition-colors cursor-pointer"
                                        >
                                            {item}
                                        </Label>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </RadioGroup>
        </div>
    )
}

export default FilterCard;