const iconsMap = {
    byFileName: (fileName) =>
        fileIconsMap.find((item) => item.fileNames?.includes(fileName))?.name,
    byFileExtension: (fileExtension) =>
        fileIconsMap.find((item) =>
            item.fileExtensions?.includes(fileExtension),
        )?.name,
    byFolder: (fileName) =>
        folderIconsMap.find((item) => item.folderNames.includes(fileName))
            ?.name,
    byLanguage: (ids) =>
        languageIconsMap.find((item) => item.ids.includes(ids))?.name,
}

const selectors = {
    row: ".js-navigation-container[role=grid] > .js-navigation-item, file-tree .ActionList-content, a.tree-browser-result",
    filename:
        "div[role='rowheader'] > span, .ActionList-item-label, a.tree-browser-result > marked-text",
    icon: ".octicon-file, .octicon-file-directory-fill, .octicon-file-submodule, a.tree-browser-result > svg.octicon.octicon-file",
}

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

    // Get file extension.
    const fileExtension = fileName.match(
        /.*?[.](?<ext>xml.dist|xml.dist.sample|yml.dist|\w+)$/,
    )?.[1]

    // returns icon name if found or undefined.
    let iconName = getIconName(fileName, fileExtension)

    if (!iconName) {
        return
    }

    replaceIcon(iconElement, iconName, fileName)
}

/** Replace icon element source with corresponding icon
 *
 * @param {HTMLElement} iconElement icon element.
 * @param {string} iconName name of icon to replace.
 * @param {string} fileName name of the file.
 */
function replaceIcon(iconElement, iconName, fileName) {
    const newSVG = document.createElement("img")
    newSVG.setAttribute("data-github-material-icons", "icon")
    newSVG.setAttribute("data-github-material-icons-iconname", iconName)
    newSVG.setAttribute("data-github-material-icons-filename", fileName)
    newSVG.src = browser.runtime.getURL(`icons/${iconName}.svg`)

    iconElement.getAttributeNames().forEach((attr) => {
        if (attr !== "src" && !/^data-github-material-icons/.test(attr)) {
            newSVG.setAttribute(attr, iconElement.getAttribute(attr))
        }
    })

    iconElement.replaceWith(newSVG)
}

/**
 * Lookup for matched file/folder icon name.
 *
 * @param {string} fileName File name.
 * @param {string} fileExtension File extension.
 * @returns {string} The matched icon name.
 */
function getIconName(fileName, fileExtension) {
    const isDir = iconElement.getAttribute("aria-label") === "Directory"
    const isSubmodule = iconElement.getAttribute("aria-label") === "Submodule"
    const isSymlink =
        iconElement.getAttribute("aria-label") === "Symlink Directory"

    const lowerFileName = fileName.toLowerCase()

    if (isSubmodule) {
        return "folder-git"
    }

    if (isSymlink) {
        return "folder-symlink"
    }

    // first look in fileNames and folderNames.
    if (iconsMap.byFileName(fileName) && !isDir) {
        return iconsMap.byFileName(fileName)
    }

    if (iconsMap.byFolder(fileName) && isDir) {
        return iconsMap.byFolder(fileName)
    }

    // then check all lowercase.
    if (iconsMap.byFileName(lowerFileName) && !isDir) {
        return iconsMap.byFileName(lowerFileName)
    }

    if (iconsMap.byFolder(lowerFileName) && isDir) {
        return iconsMap.byFolder(lowerFileName)
    }

    // look for extension in fileExtensions
    if (iconsMap.byFileExtension(fileExtension) && !isDir) {
        return iconsMap.byFileExtension(fileExtension)
    }

    // look for filename and extension in language map.
    if (iconsMap.byLanguage(fileName) && !isDir) {
        return iconsMap.byLanguage(fileName)
    }

    if (iconsMap.byLanguage(lowerFileName) && !isDir) {
        return iconsMap.byLanguage(lowerFileName)
    }

    if (iconsMap.byLanguage(fileExtension) && !isDir) {
        return iconsMap.byLanguage(fileExtension)
    }

    // fallback into default file or folder if no matches.
    if (isDir) {
        return "folder"
    }

    return "file"
}
