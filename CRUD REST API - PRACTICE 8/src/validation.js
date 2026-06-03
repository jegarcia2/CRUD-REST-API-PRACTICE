import { CATEGORIES } from "./constants";

export function validateFullExpense({ amount, category, description }) {
    if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
        return "amount must be a positive number!";
    }
    if (!CATEGORIES.includes(category)) {
        return `category must be one of the following: ${CATEGORIES.join(", ")}`;
    }
    if (typeof description !== "string" || description.trim().length === 0) {
        return "description must be a non-empty string";
    }
    return null;
}

export function validatePartialExpense(body) {
    const { amount, category, description } = body;
    if (amount !== undefined) {
        if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
            return "amount must be a positive number!";
        }
    }
    if (category !== undefined) {
        if (!CATEGORIES.includes(category)) {
            return `category must be one of the following: ${CATEGORIES.join(", ")}`;
        }
    }
    if (description !== undefined) {
        if (typeof description !== "string" || description.trim().length === 0) {
            return "description must be a non-empty string";
        }
    }
    return null;
}

