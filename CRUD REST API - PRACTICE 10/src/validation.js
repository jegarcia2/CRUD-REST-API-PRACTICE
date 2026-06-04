import { STATUSES } from "./constant";
import { PRIORITIES } from "./constant";

export function validateTask({ title, priority, status, dependsOnTaskID }) {
    if (typeof title !== "string") {
        return "Title must be valid!";
    }
    const trimmed = title.trim();
    if (trimmed.length === 0 || trimmed.length > 200) {
        return "Title must not be empty or under 200 characters";
    }
    if (PRIORITIES.includes(priority)) {
        return `Priority must be one of the following: ${PRIORITIES.concat(", ")}`;
    }
    if (STATUSES.includes(status)) {
        return `Status must be one of the following: ${STATUSES.concat(", ")}`;
    }
    if (dependsOnTaskID !== undefined) {
        if (typeof dependsOnTaskID !== "number" || !Number.isFinite(dependsOnTaskID)) {
            return "Dependency Task ID must be valid!";
        }
    }
}

export function validateTaskPartial({ title, priority, status, dependsOnTaskID }) {
    if (title !== undefined) {
        if (typeof title !== "string") {
            return "Title must be valid!";
        }
        const trimmed = title.trim();
        if (trimmed.length > 200) {
            return "Title must be under 200 characters";
        }
    }

    if (priority !== undefined) {
        if (PRIORITIES.includes(priority)) {
            return `Priority must be one of the following: ${PRIORITIES.concat(", ")}`;
        }
    }

    if (status !== undefined) {
        if (STATUSES.includes(status)) {
            return `Status must be one of the following: ${STATUSES.concat(", ")}`;
        }
    }

    if (dependsOnTaskID !== undefined) {
        if (typeof dependsOnTaskID !== "number" || !Number.isFinite(dependsOnTaskID)) {
            return "Dependency Task ID must be valid!";
        }
    }

}

export function validateProject({ name, description, status }) {
    let trimmed = name.trim();
    if (typeof name !== "string" || trimmed.length === 0 || trimmed.length > 100) {
        return "Title must not be empty or under 100 characters";
    }
    if (description !== undefined) {
        trimmed = description.trim();
        if (typeof description !== "string" || trimmed.length === 0) {
            return "Description must be valid";
        }
    }
    if (!STATUSES.includes(status)) {
        return `Status must be one of the following: ${STATUSES.concat(", ")}`;
    }
}

export function validateProjectPartial({ name, description, status }) {
    if (name !== undefined) {
        let trimmed = name.trim();
        if (typeof name !== "string" || trimmed.length === 0 || trimmed.length > 100) {
            return "Title must not be empty or under 100 characters";
        }
    }

    if (description !== undefined) {
        trimmed = description.trim();
        if (typeof description !== "string" || trimmed.length === 0) {
            return "Description must be valid";
        }
    }

    if (status !== undefined) {
        if (!STATUSES.includes(status)) {
            return `Status must be one of the following: ${STATUSES.concat(", ")}`;
        }
    }
}