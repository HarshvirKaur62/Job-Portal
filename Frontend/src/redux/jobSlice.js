import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name: "job",
    initialState: {
        allJobs: [],
        allAdminJobs: [],
        singleJob: null,
        searchedQuery: "",
        allAppliedJobs: [],
        searchJobByText: "", // ✨ ADDED THIS FOR ADMIN FILTERING
    },
    reducers: {
        setAllJobs: (state, action) => {
            state.allJobs = action.payload;
        },
        setAllAdminJobs: (state, action) => {
            state.allAdminJobs = action.payload;
        },
        setSingleJob: (state, action) => {
            state.singleJob = action.payload;
        },
        setSearchedQuery: (state, action) => {
            state.searchedQuery = action.payload;
        },
        setAllAppliedJobs: (state, action) => {
            state.allAppliedJobs = action.payload;
        },
        setSearchJobByText: (state, action) => { // ✨ ADDED THIS REDUCER FUNCTION
            state.searchJobByText = action.payload;
        },
        toggleSaveJob: (state, action) => {
            const jobId = action.payload;
            const job = state.allJobs.find(j => j._id === jobId);
            if (job) {
                job.isSaved = !job.isSaved;
            }
        }
    }
});

export const {
    setAllJobs,
    setAllAdminJobs,
    setSingleJob,
    setSearchedQuery,
    setAllAppliedJobs,
    setSearchJobByText, // ✨ EXPORTED THIS FOR ADMINJOBS.JSX
    toggleSaveJob
} = jobSlice.actions;

export default jobSlice.reducer;