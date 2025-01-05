export const getShortenText = (title: string | undefined, number: number) => {
    if (!title) return '';
    if (title.length > number) {
        return title.slice(0, number - 3) + '...';
    }
    return title;
}
