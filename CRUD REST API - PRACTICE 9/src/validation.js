import { FREQUENCY } from "./constants";
import { DIFFICULTY } from "./constants";

export function validateCompletion({ habitID }) {
    if (typeof habitID !== "number" || !Number.isFinite(habitID) || habitID < 1) {
        return "";
    }

    return null;
}

export function validateHabits({ name, frequency, difficulty }) {
    if (typeof name !== "string") {
        return "";
    }

    const trimmedName = name.trim();
    if (trimmedName.length > 50 || trimmedName.length < 1) {
        return ""
    }

    if (typeof frequency !== "string" || !FREQUENCY.includes(frequency)) {
        return "";
    }

    if (typeof difficulty !== "string" || !DIFFICULTY.includes(difficulty)) {
        return "";
    }

    return null;
}

export function validateHabitsPartial({ name, frequency, difficulty }) {
    if (name !== undefined) {
        const trimmedName = name.trim();
        if (typeof name !== "string" || trimmedName.length > 50 || trimmedName.length < 1) {
            return ""
        }
    }

    if (frequency !== undefined) {
        if (typeof frequency !== "string" || !FREQUENCY.includes(frequency)) {
            return "";
        }
    }


    if (difficulty !== undefined) {
        if (typeof difficulty !== "string" || !DIFFICULTY.includes(difficulty)) {
            return "";
        }
    }

    //If habit updated, the creation date should not be updatable. We probably should add an edited date.

    return null;
}

