/**
 * Converts a wildcard pattern to a regular expression.
 * - `*` matches any sequence of characters (except `/`).
 * - `?` matches a single character.
 * - Escapes other special regex characters.
 * @param {string} wildcardPattern - A glob-style pattern (e.g., "*.js").
 * @returns {RegExp} A regex equivalent of the pattern.
 */
function wildcardToRegex(wildcardPattern) {
    const regexString = wildcardPattern
        .replace(/[.+^${}()|[\]\\]/g, '\\$&') // Escape special regex characters
        .replace(/\*/g, '.*') // Convert `*` to `.*` (match anything)
        .replace(/\?/g, '.'); // Convert `?` to `.` (match one character)
    
    return new RegExp(`^${regexString}$`); // Match the whole filename
}

/**
 * Recursively finds files matching a wildcard pattern in a directory.
 * @param {string} patternPath - A string in the form "dir/pattern" (e.g., "data/*.md").
 * @param {string[]} fileList - Internal list of matched files.
 * @returns {string[]} List of matching file paths.
 */
function globLike(patternPath, fileList = []) {
    const dir = path.dirname(patternPath); // Extract directory
    const pattern = path.basename(patternPath); // Extract pattern
    const regexPattern = wildcardToRegex(pattern);
    
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            globLike(path.join(filePath, pattern), fileList); // Recursively search subdirectories
        } else if (regexPattern.test(file)) {
            fileList.push(filePath);
        }
    }

    return fileList;
}
export { wildcardToRegex, globLike };
