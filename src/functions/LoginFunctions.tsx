export const handleInputChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
    inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>
) => {
    const value = e.target.value;

    if (value.length > 1) {
        e.target.value = value.slice(0, 1);
    }

    if (value.length === 1 && index < 5) {
        inputRefs.current[index + 1]?.focus();
    }
};

export const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
    inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>
) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
        inputRefs.current[index - 1]?.focus();
    }
};
