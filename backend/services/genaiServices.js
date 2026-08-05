require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

// const ai = new GoogleGenAI({});
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });


exports.categorizeExpenses = async (description) => {
    try {
        const interaction = await ai.interactions.create({
            model: "gemini-3.6-flash",
            input: `Categorize this expense description accurately into a single category (e.g. Food, Utilities, Transport): "${description}"`,
        });

        return interaction.output_text;
    } catch (err) {
        throw err;
    }
};

// In services/genaiServices.js
exports.summarizeExpenses = async (expenses) => {
    if (!expenses || expenses.length === 0) {
        return "No expenses available to summarize.";
    }

    try {
        const cleanExpenses = expenses.map(item => ({
            description: item.description,
            price: item.price,
            category: item.category
        }));

        const interaction = await ai.interactions.create({
            model: "gemini-3.6-flash",
            input: `Summarize these expenses in plain text only.
            No markdown, no headings, no lists.
            Keep it under 3 sentences.
            Highlight top category,
            overspending area, and give one saving tip:
            ${JSON.stringify(cleanExpenses)}`,
            //stream: true
        });
        return interaction.output_text || "No summary generated."
    } catch (err) {
        console.error("Summarize Expenses Error:", err);
        throw err; // Let express errorHandler send proper HTTP status
    }
};