import axios from 'axios';

let cachedModel = null;

const getModelToUse = async (apiKey, baseUrl) => {
    if (cachedModel) return cachedModel;
    try {
        const listUrl = `${baseUrl}/models?key=${apiKey}`;
        const listResponse = await axios.get(listUrl);
        const availableModels = listResponse.data.models.map(m => m.name.replace("models/", ""));
        const preferredModels = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
        cachedModel = preferredModels.find(m => availableModels.includes(m)) || availableModels[0];
        console.log(`Discovered and cached AI model: ${cachedModel}`);
        return cachedModel;
    } catch (error) {
        console.error("AI Model Discovery Failed, falling back to gemini-1.5-flash:", error.message);
        return "gemini-1.5-flash"; // Safe fallback
    }
};

// Fallback keyword-based ATS analysis if AI service is unavailable
const fallbackATS = (resumeText, jobDescription) => {
    const resumeWords = new Set((resumeText || "").toLowerCase().match(/\b[a-z]{3,}\b/g) || []);
    const jobWords = Array.from(new Set((jobDescription || "").toLowerCase().match(/\b[a-z]{3,}\b/g) || []));
    
    // Filter common stop words
    const stopWords = new Set(["the", "and", "for", "with", "that", "this", "from", "have", "are", "will", "you", "your"]);
    const relevantJobWords = jobWords.filter(w => !stopWords.has(w));
    
    const matched = relevantJobWords.filter(w => resumeWords.has(w));
    const missing = relevantJobWords.filter(w => !resumeWords.has(w)).slice(0, 5);
    
    const score = relevantJobWords.length > 0 
        ? Math.min(100, Math.round((matched.length / relevantJobWords.length) * 100) + 20)
        : 75;

    return {
        score: Math.max(40, score),
        summary: `Resume matches ${matched.length} key requirements identified in the job description.`,
        missingSkills: missing.length > 0 ? missing : ["Communication", "Domain Knowledge"],
        matchReasons: matched.slice(0, 4).map(w => `Demonstrated skill/mention of '${w}' matching job needs.`)
    };
};

export const analyzeResume = async (resumeText, jobDescription) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.log("No GEMINI_API_KEY provided, using ATS engine fallback.");
            return fallbackATS(resumeText, jobDescription);
        }

        const baseUrl = "https://generativelanguage.googleapis.com/v1";
        const modelToUse = await getModelToUse(apiKey, baseUrl);

        const genUrl = `${baseUrl}/models/${modelToUse}:generateContent?key=${apiKey}`;
        const prompt = `
        You are an expert ATS (Applicant Tracking System).
        Compare the Resume Text against the Job Description.
        You must return a JSON object matching this schema:
        {
          "score": number, (percentage match from 0 to 100)
          "summary": string, (brief explanation of the match status)
          "missingSkills": string[], (key skills missing from the resume)
          "matchReasons": string[] (reasons why the resume matches the job)
        }
        
        Resume: ${resumeText}
        Job Description: ${jobDescription}
        `;

        const response = await axios.post(genUrl, {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json"
            }
        });

        const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!responseText) {
            return fallbackATS(resumeText, jobDescription);
        }

        // Clean any potential markdown code blocks (```json ... ```)
        const cleanedText = responseText.replace(/```json\n?|\n?```/g, "").trim();
        return JSON.parse(cleanedText);

    } catch (error) {
        console.error("AI Analysis error, using fallback ATS engine:", error.message);
        return fallbackATS(resumeText, jobDescription);
    }
};
