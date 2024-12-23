import { GoogleGenerativeAI } from "@google/generative-ai";
import { marked } from "marked";

const API_KEY = import.meta.env.VITE_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

let question = "";
let response = "Ask Your Question ... ";
document.getElementById(
    "response"
).innerHTML = `<p id="empty-text">${response}</p>`;
document.getElementById(
    "question-blob"
).innerHTML = `<p id="empty-text">...</p>`;

document.getElementById("prompt-textarea").addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSubmit();
    }
});

document.getElementById("generate-button").addEventListener("click", handleSubmit);

async function GenerateResponse() {
    try {
        const result = await model.generateContentStream(question);

        response = "";
        document.getElementById("prompt-textarea").value = "";

        console.log("Generating...");
        for await (const chunk of result.stream) {
            response = response + chunk.text();
            document.getElementById("response").innerHTML = marked(response);
        }
        console.clear();
        console.log("Generated");
    } catch (error) {
        console.log("error", error);
    }
    
    document.getElementById("question-blob").innerHTML = `<p>${question}</p>`;
}

function handleSubmit() {
    const userPrompt = document.getElementById("prompt-textarea").value.trim();
    if (userPrompt) {
        question = document.getElementById("prompt-textarea").value;
        document.getElementById(
            "question-blob"
        ).innerHTML = `<p>${question}  ⏳️</p>`;

        GenerateResponse();
    }
}
