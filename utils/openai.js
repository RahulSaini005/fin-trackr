// utils/openai.js
const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function detectCategoryFromTitle(title) {
  const prompt = `
    You are an intelligent expense manager. Categorize the following transaction title into one of the categories:
    
    Food, Travel, Health, Education, Shopping, Rent, Salary, Freelance, Investment, Bills, Entertainment, 
    Subscriptions, Gift, Bonus, Refund, Maintenance, Insurance, Kids, Pet care, Internet, Mobile Recharge, 
    Essentials, Family, Others.
    
    Title: "${title}"

    Give only the category name.
  `;


  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const category = response.choices[0].message.content.trim();
    return category;
  } catch (err) {
    console.error("GPT Error:", err);
    return "Others";
  }
}

module.exports = detectCategoryFromTitle;
