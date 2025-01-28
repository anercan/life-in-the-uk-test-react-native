export const getShortenText = (title: string | undefined, number: number) => {
    if (!title) return '';
    if (title.length > number) {
        return title.slice(0, number - 3) + '...';
    }
    return title;
}

export const capitalizeWords = (str) => {
    return str
        .split(' ')
        .map((word) => {
            if (word === 'and' || word === 'And') {
                return word;
            }
            return word.charAt(0).toUpperCase() + word.slice(1)
        })
        .join(' ');
}
