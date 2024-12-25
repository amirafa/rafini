import { GoogleGenerativeAI } from "@google/generative-ai";
import { marked } from "marked";

const API_KEY = import.meta.env.VITE_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
const textarea = document.getElementById("prompt-textarea");

const chat = model.startChat();

let question = "";
let response = "Ask Your Question ... ";
document.getElementById(
    "response"
).innerHTML = `<p id="empty-text">${response}</p>`;
document.getElementById(
    "question-blob"
).innerHTML = `<p id="empty-text">...</p>`;

document
    .getElementById("prompt-textarea")
    .addEventListener("keydown", (event) => {
        if (
            event.key === "Enter" &&
            !event.shiftKey &&
            window.innerWidth > 768
        ) {
            event.preventDefault();
            handleSubmit();
        }
    });

document
    .getElementById("prompt-button")
    .addEventListener("click", handleSubmit);

async function GenerateResponse() {
    try {
        let result = await chat.sendMessage/*Stream*/(question);
        
        response = "";
        console.log("Generating...");

        response = response + result.response.text();
        document.getElementById("response").innerHTML = marked(response);
        // for await (const chunk of result.stream) {
        //     response = response + chunk.text();
        //     document.getElementById("response").innerHTML = marked(response);
        // }

        textarea.style.height = `19px`;
        textarea.value = "";

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

document.addEventListener("DOMContentLoaded", function () {
    function adjustTextareaHeight() {
        textarea.style.height = "auto";
        const newHeight = Math.min(
            500,
            Math.max(19, textarea.scrollHeight - 32)
        );
        textarea.style.height = `${newHeight}px`;
    }

    textarea.addEventListener("input", adjustTextareaHeight);

    adjustTextareaHeight();
});
