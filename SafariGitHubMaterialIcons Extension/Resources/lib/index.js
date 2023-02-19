/**
 * Replace file/folder icons in a row.
 *
 * @param {HTMLElement} row item in row.
 */
function replaceIconInRow(row) {
    // Get file/folder name.
    /** @type string */
    const fileName = row
        .querySelector(selectors.filename)
        ?.innerText?.split("/")[0]
        .trim()

    // fileName couldn't be found or we don't have a match for it.
    if (!fileName) {
        return
    }

    // SVG to be replaced.
    const iconElement = row.querySelector(selectors.icon)

    if (
        !iconElement ||
        // already exists one
        iconElement?.getAttribute("data-github-material-icons")
    ) {
        return
    }

    // returns icon name if found or undefined.
    const iconName = getIconName(iconElement, fileName)

    if (!iconName) {
        return
    }

    replaceIcon(iconElement, iconName, fileName)
}

/** Replace old icon with new corresponding icon
 *
 * @param {HTMLElement} oldSVG icon element.
 * @param {string} iconName name of icon to replace.
 * @param {string} fileName name of the file.
 */
function replaceIcon(oldSVG, iconName, fileName) {
    const newSVG = new Image()
    newSVG.setAttribute("data-github-material-icons", "icon")
    newSVG.setAttribute("data-github-material-icons-iconname", iconName)
    newSVG.setAttribute("data-github-material-icons-filename", fileName)
    newSVG.src = browser.runtime.getURL(`icons/${iconName}.svg`)

    // foward all attributes from old svg to new svg
    for (const attr of oldSVG.attributes) {
        newSVG.setAttribute(attr.name, attr.value)
    }

    // replace the old one with new one
    oldSVG.replaceWith(newSVG)
}

/**
 * Lookup for matched file/folder icon name in material design icon.
 * @param {HTMLElement} iconElement icon element
 * @param {string} fileName File name.
 * @returns {string} The matched icon name.
 */
function getIconName(iconElement, fileName) {
    const ariaLabel = iconElement.getAttribute("aria-label")
    const isDir = ariaLabel === "Directory"
    const isSubmodule = ariaLabel === "Submodule"
    const isSymlink = ariaLabel === "Symlink Directory"
    const lowerFileName = fileName.toLowerCase()
    const fileExtension = fileName.match(
        /.*?[.](?<ext>xml.dist|xml.dist.sample|yml.dist|\w+)$/,
    )?.[1]

    if (isSubmodule) {
        return "folder-git"
    }

    if (isSymlink) {
        return "folder-symlink"
    }

    // first look in fileNames and folderNames.
    if (getIcon.byFileName(fileName) && !isDir) {
        return getIcon.byFileName(fileName)
    }

    if (getIcon.byFolder(fileName) && isDir) {
        return getIcon.byFolder(fileName)
    }

    // then check all lowercase.
    if (getIcon.byFileName(lowerFileName) && !isDir) {
        return getIcon.byFileName(lowerFileName)
    }

    if (getIcon.byFolder(lowerFileName) && isDir) {
        return getIcon.byFolder(lowerFileName)
    }

    // look for extension in fileExtensions
    if (getIcon.byFileExtension(fileExtension) && !isDir) {
        return getIcon.byFileExtension(fileExtension)
    }

    // look for filename and extension in language map.
    if (getIcon.byLanguage(fileName) && !isDir) {
        return getIcon.byLanguage(fileName)
    }

    if (getIcon.byLanguage(lowerFileName) && !isDir) {
        return getIcon.byLanguage(lowerFileName)
    }

    if (getIcon.byLanguage(fileExtension) && !isDir) {
        return getIcon.byLanguage(fileExtension)
    }

    // fallback into default file or folder if no matches.
    if (isDir) {
        return "folder"
    }

    return "file"
}
