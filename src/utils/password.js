export const validatePassword = (value) => {
    if (value.length < 8) {
        throw new Error("password must be at least 8 characters!!");
    }

    if (!/[A-Z]/.test(value)) {
        throw new Error("password must contain a capital letter!!");
    }

    if (!/[a-z]/.test(value)) {
        throw new Error("password must contain a letter!!");
    }

    if (!/\d/.test(value)) {
        throw new Error("password must contain at least one digit!!");
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        throw new Error("password must contain at least one special character!!");
    }

    return value;
};
