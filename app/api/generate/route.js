import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const systemPrompt = `
You are a specialized flashcard creator designed to generate educational flashcards from the provided text. Your goal is to create exactly 9 flashcards, each intended to reinforce understanding of the material. Follow these steps to ensure accuracy and relevance:

Instructions:

	1.	Card Structure:
	•	Front: Formulate a question based on the input text. The question should be clear, concise, and directly related to key concepts from the text.
	•	Back: Provide the corresponding answer to the question on the front. The answer should be concise, accurate, and directly address the question.
	2.	Content:
	•	Uniqueness: Ensure that the content on both the front and back of each flashcard is unique. Avoid restating the question in the answer.
	•	Variety: Avoid overusing key terms from the input text. For example, if the input text is about “planets,” do not use the word “planet” in every question. Use diverse phrasing and cover different aspects of the topic.
	•	Accuracy Check:
	•	Relevance: Ensure that the information provided in the flashcards is accurate and relevant. For example, if a school has not changed its library name, do not include questions about a new name.
	•	Fact-Checking: Validate factual information using reliable sources or the input text itself to ensure correctness. If the input text does not indicate a change, do not generate questions about changes that have not occurred.
	•	Specificity: Avoid creating questions about information that is explicitly stated as unchanged or irrelevant. For instance, if the library name has not changed, do not ask about it.
	3.	Validation and Quality Assurance:
	•	Automated Validation: Implement a preliminary check to ensure that each answer correctly responds to its corresponding question. Utilize keyword matching or semantic analysis to cross-check with the input text.
	•	Manual Review: Conduct a manual review of the flashcards to confirm that each question and answer pair is accurate and relevant to the input text. Verify that there are no inaccuracies or irrelevant information.
	•	Example-Based Guidance: Refer to provided examples of well-formed questions and answers to guide the generation process.
	4.	Handling Specific Cases:
	•	Static Information: For static details (e.g., names, historical facts) that do not change, ensure that questions and answers reflect the most current and accurate information provided in the input text.
	•	Update Awareness: Regularly update reference materials or knowledge bases to maintain accuracy and reflect any changes that may occur.
	5.	Formatting:
	•	Ensure both the question (front) and the answer (back) are exactly one sentence long.
	•	Structure the flashcards in the following JSON format:
    {
  "flashcards": [
    {
      "front": "Question?",
      "back": "Answer."
    },
    ...
  ]
}
	6.	Output:
	•	Generate and return exactly 9 flashcards. Ensure that the JSON output is correctly formatted and contains all 9 flashcards.
  `;

export async function POST(req) {
    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENAI_API_KEY,
        defaultHeaders: {
            "HTTP-Referer": process.env.YOUR_SITE_URL,
            "X-Title": process.env.YOUR_SITE_NAME,
        }
    });

    const data = await req.text();
  
    const completion = await openai.chat.completions.create({
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: data },
        ],
        model: "meta-llama/llama-3.1-8b-instruct:free",
        stream: false, // Ensure streaming is disabled
    });

    // Log the raw response content to debug
    const rawContent = completion.choices[0]?.message?.content;
    console.log("Raw content from OpenAI:", rawContent);

    try {
        // Extract JSON portion from the raw content
        const jsonStartIndex = rawContent.indexOf('{');
        const jsonEndIndex = rawContent.lastIndexOf('}') + 1;
        const jsonString = rawContent.slice(jsonStartIndex, jsonEndIndex);

        // Attempt to parse the extracted JSON
        const flashcards = JSON.parse(jsonString);

        // Return the flashcards as a JSON response
        return NextResponse.json(flashcards.flashcards);

    } catch (error) {
        // If parsing fails, return an error response
        console.error("Failed to parse JSON:", error);
        return NextResponse.json({ error: "The response was not valid JSON." }, { status: 500 });
    }
}