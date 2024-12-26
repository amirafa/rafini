import { GoogleGenerativeAI } from "@google/generative-ai";
import { marked } from "marked";

const API_KEY = import.meta.env.VITE_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
const textarea = document.getElementById("prompt-textarea");

const history = [
    {
        role: "user",
        parts: [{ text: "if I ask you about your name, call yourself 'Rafini, an AI chatbot powered by Google Gemini Flash 2.0'" }],
    },
    {
        role: "user",
        parts: [{ text: "تلفظ Rafini به فارسی میشود رَفینی" }],
    },
];

let chat = model.startChat({
    history: history,
});

let question = "";
let response = "Hey, What can i do for you?";
document.getElementById("question-blob").innerHTML = `<p>...</p>`;
document.getElementById("response").innerHTML = `<p>${response}</p>`;

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

document.getElementById("new-button").addEventListener("click", () => {
    if (confirm("Do you want to start a new chat?") == true) {
        let response = "Hey, What can i do for you?";
        document.getElementById("question-blob").innerHTML = `<p>...</p>`;
        document.getElementById("response").innerHTML = `<p>${response}</p>`;
        chat = model.startChat({ history: history });
    }
});

document
    .getElementById("prompt-button")
    .addEventListener("click", handleSubmit);

async function GenerateResponse() {
    try {
        let result = await chat.sendMessage(/*Stream*/ question);

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
