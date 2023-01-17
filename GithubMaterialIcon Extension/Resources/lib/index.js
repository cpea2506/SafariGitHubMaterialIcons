const selectors = {
    row: ".js-navigation-container[role=grid] > .js-navigation-item, file-tree .ActionList-content, a.tree-browser-result",
    filename: "div[role='rowheader'] > span, .ActionList-item-label, a.tree-browser-result > marked-text",
    icon: ".octicon-file, .octicon-file-directory-fill, .octicon-file-submodule, a.tree-browser-result > svg.octicon.octicon-file",
}

/**
 * Replace file/folder icons in a row.
 *
 * @param {HTMLElement} rowItem Item in row.
 */
function replaceIconInRow(rowItem) {
    // Get file/folder name.
    const fileName = rowItem.querySelector(selectors.filename)?.innerText?.split("/")[0].trim();

    // fileName couldn't be found or we don't have a match for it.
    if (!fileName) {
        return;
    }

    // SVG to be replaced.
    const iconElement = rowItem.querySelector(selectors.icon);

    if (iconElement?.getAttribute("data-github-material-icons")) {
        return;
    }

    const isDir = iconElement.getAttribute("aria-label") === "Directory";
    const isSubmodule = iconElement.getAttribute("aria-label") === "Submodule";
    const isSymlink = iconElement.getAttribute("aria-label") === "Symlink Directory";
    const lowerFileName = fileName.toLowerCase();

    // Get file extension.
    const fileExtension = fileName.match(/.*?[.](?<ext>xml.dist|xml.dist.sample|yml.dist|\w+)$/)?.[1];

    // returns icon name if found or undefined.
    let iconName = lookForMatch(fileName, lowerFileName, fileExtension, isDir, isSubmodule, isSymlink);

    replaceElementWithIcon(iconElement, iconName, fileName)

}

const replaceElementWithIcon = (iconElement, iconName, fileName) => {
    if (!iconName) {
        return;
    }
    // Get folder icon from active icon pack.
    const newSVG = document.createElement("img");
    newSVG.setAttribute("data-github-material-icons", "icon");
    newSVG.setAttribute("data-github-material-icons-iconname", iconName);
    newSVG.setAttribute("data-github-material-icons-filename", fileName);
    newSVG.src = browser.runtime.getURL(`icons/${iconName}.svg`)
    console.log(browser.runtime.getURL(`icons/${iconName}.svg`))

    iconElement.parentNode.replaceChild(newSVG, iconElement);
}

/**
 * Lookup for matched file/folder icon name.
 *
 * @since 1.0.0
 * @param {string} fileName File name.
 * @param {string} lowerFileName Lowercase file name.
 * @param {string} fileExtension File extension.
 * @param {boolean} isDir Check if directory type.
 * @param {boolean} isSubmodule Check if submodule type.
 * @param {boolean} isSymlink Check if symlink
 * @returns {string} The matched icon name.
 */
function lookForMatch(fileName, lowerFileName, fileExtension, isDir, isSubmodule, isSymlink) {
    if (isSubmodule) {
        return "folder-git"
    };

    if (isSymlink) {
        return "folder-symlink";
    }

    // First look in fileNames and folderNames.
    if (fileIcons.names(fileName) && !isDir) {
        return fileIcons.names(fileName).name;
    }

    if (folderIcons(fileName) && isDir) {
        return folderIcons(fileName).name;
    }

    // Then check all lowercase.
    if (fileIcons.names(lowerFileName) && !isDir) {
        return fileIcons.names(lowerFileName).name;
    }

    if (folderIcons(lowerFileName) && isDir) {
        return folderIcons(lowerFileName).name;
    }

    // Look for extension in fileExtensions
    if (fileIcons.extensions(fileExtension) && !isDir) {
        return fileIcons.extensions(fileExtension).name;
    }

    // Look for filename and extension in VSCode language map.
    if (languageIcons(fileName) && !isDir) {
        return languageIcons(fileName).name;
    }

    if (languageIcons(lowerFileName) && !isDir) {
        return languageIcons(lowerFileName).name;
    }

    if (languageIcons(fileExtension) && !isDir) {
        return languageIcons(fileExtension).name;
    }

    // Fallback into default file or folder if no matches.
    if (isDir) {
        return "folder"
    };

    return "file";
}

const replaceAllIcons = () => {
    const iconElements = document.querySelectorAll("img[data-github-material-icons]");

    iconElements.forEach(iconElement => {
        const iconName = iconElement.getAttribute("data-github-material-icons-iconname");
        const fileName = iconElement.getAttribute("data-github-material-icons-filename");

        replaceElementWithIcon(iconElement, iconName, fileName);
    });
}
