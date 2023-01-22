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
 * @param {HTMLElement} rowItem item in row.
 */
function replaceIconInRow(rowItem) {
    // Get file/folder name.
    const fileName = rowItem
        .querySelector(selectors.filename)
        ?.innerText?.split("/")[0]
        .trim()

    // fileName couldn't be found or we don't have a match for it.
    if (!fileName) {
        return
    }

    // SVG to be replaced.
    const iconElement = rowItem.querySelector(selectors.icon)

    if (!iconElement?.getAttribute("data-github-material-icons")) {
        return
    }

    const isDir = iconElement.getAttribute("aria-label") === "Directory"
    const isSubmodule = iconElement.getAttribute("aria-label") === "Submodule"
    const isSymlink =
        iconElement.getAttribute("aria-label") === "Symlink Directory"

    // Get file extension.
    const fileExtension = fileName.match(
        /.*?[.](?<ext>xml.dist|xml.dist.sample|yml.dist|\w+)$/,
    )?.[1]

    // returns icon name if found or undefined.
    let iconName = lookForMatch(
        fileName,
        fileExtension,
        isDir,
        isSubmodule,
        isSymlink,
    )

    if (!iconName) {
        return
    }

    replaceElementWithIcon(iconElement, iconName, fileName)
}

/** Replace icon element source with correspoding icon
 *
 * @param {HTMLElement} iconElement icon element.
 * @param {string} iconName name of icon to replace.
 * @param {string} fileName name of the file.
 */
function replaceElementWithIcon(iconElement, iconName, fileName) {
    const newSVG = document.createElement("img")
    newSVG.setAttribute("data-github-material-icons", "icon")
    newSVG.setAttribute("data-github-material-icons-iconname", iconName)
    newSVG.setAttribute("data-github-material-icons-filename", fileName)
    newSVG.src = browser.runtime.getURL(`icons/${iconName}.svg`)

    iconElement.parentNode.replaceChild(newSVG, iconElement)
}

/**
 * Lookup for matched file/folder icon name.
 *
 * @param {string} fileName File name.
 * @param {string} fileExtension File extension.
 * @param {boolean} isDir Check if directory type.
 * @param {boolean} isSubmodule Check if submodule type.
 * @param {boolean} isSymlink Check if symlink
 * @returns {string} The matched icon name.
 */
function lookForMatch(fileName, fileExtension, isDir, isSubmodule, isSymlink) {
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

const replaceAllIcons = () => {
    const iconElements = document.querySelectorAll(
        "img[data-github-material-icons]",
    )

    iconElements.forEach((element) => {
        const iconName = element.getAttribute(
            "data-github-material-icons-iconname",
        )
        const fileName = element.getAttribute(
            "data-github-material-icons-filename",
        )

        console.log(iconName)
        replaceElementWithIcon(element, iconName, fileName)
    })
}
