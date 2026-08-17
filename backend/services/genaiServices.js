require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const categorizeExpenses = async (description) => {
    try {
        const interaction = await ai.interactions.create({
            model: "gemini-3.6-flash",
            input: `Categorize this expense description accurately into a single category (e.g. Food, Utilities, Transport): "${description}"`,
        });

        return interaction.output_text;
    } catch (err) {
        console.error("Categorize expense error:", err.message);
        throw err;
    }
};

const summarizeExpenses = async (expenses) => {
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
            input: `Summarize these expenses in plain text (under 3 sentences, no markdown/lists).Use the Indian Rupee symbol (₹) for all monetary values instead of any other currency symbol. Highlight the top category, overspending area, and one saving tip: ${JSON.stringify(cleanExpenses)}`,
        });

        return interaction.output_text || "No summary generated.";
    } catch (err) {
        console.error("Summarize expenses error:", err.message);
        throw  err;
    }
};

module.exports = {
    categorizeExpenses,
    summarizeExpenses
};