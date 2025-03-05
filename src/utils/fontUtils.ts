export const cleanFontName = (fileName: string): string => {
    const nameWithoutExt = fileName.split('.')[0];
    const nameWithSpaces = nameWithoutExt.replace(/[-_]/g, ' ');
    return nameWithSpaces
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};