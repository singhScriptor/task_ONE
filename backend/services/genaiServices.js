const { GoogleGenerativeAI } =  require('@google/genai')

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)

exports.categorizeExpenses = async(description)=>{
    try{
        const model= genAI.getGenerativeModel({model :'gemini-1.5-flash'})
        const prompt = `Categorize this expense: " ${description}" into food, travel, shopping, bills, salary, petrol, or other`
        const result = await model.generateContent(prompt)
        return result.response.text()
    }
    catch(err){
        throw err
    }
}

exports.summarizeExpenses = async(expenses)=>{
    const model  = genAI.getGenerativeModel({model : "gemini-1.5-flash" })
    const prompt = `Summarize these expense: ${JSON.stringify(expenses)}
    Highlight top categories, overspending area, and give saving advice.`
    const result = await model.generateContent(prompt)
    return result.response.text()
}
