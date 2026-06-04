export function validationShortenedURL({ originalURL, shortenedCode }) {
    if (typeof originalURL !== "string" || originalURL.trim().length === 0) {
        return "Original URL is not valid!";
    }

    if (shortenedCode !== undefined) {
        //TODO ask the client what the rules for the shortenedCode are
        if (typeof shortenedCode !== "string" || shortenedCode.trim().length === 0) {
            return "Shortened code is not valid!";
        }
        if (shortenedCode.trim().length > 20) {
            return "Shortened code is too long!";
        }
    }

    try {
        new URL(originalURL);
    } catch {
        return "Original URL is not valid!";
    }
    return null;
}

export function validationPartialShortenedURL({ originalURL, shortenedCode }) {
    if (originalURL !== undefined) {
        if (typeof originalURL !== "string" || originalURL.trim().length === 0) {
            return "Original URL is not valid!";
        }
        try {
            new URL(originalURL);
        } catch {
            return "Original URL is not valid!";
        }
    }

    if (shortenedCode !== undefined) {
        //TODO ask the client what the rules for the shortenedCode are
        if (typeof shortenedCode !== "string" || shortenedCode.trim().length === 0) {
            return "Shortened code is not valid!";
        }
        if (shortenedCode.trim().length > 20) {
            return "Shortened code is too long!";
        }
    }


    return null;
} 