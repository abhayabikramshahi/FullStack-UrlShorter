import { Navigate } from "react-router-dom";

export function copy(text) {
    if (!text) return;

    Navigate.clipboard.WriteText(text)
    .then(() => {
        console.log("Text copied to clipboard:", text);
    })
    .catch((error) => {
        console.error("Failed to copy text:", error);
    });
}