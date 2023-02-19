const selectors = {
    row: ".js-navigation-container[role=grid] > .js-navigation-item, file-tree .ActionList-content, a.tree-browser-result",
    icon: ".octicon-file, .octicon-file-directory-fill, .octicon-file-submodule, a.tree-browser-result > svg.octicon.octicon-file",
    filename:
        "div[role='rowheader'] > span, .ActionList-item-label, a.tree-browser-result > marked-text",
}

const getIcon = {
    byFileName: (fileName) => {
        const fileIcon = fileIcons.find((item) =>
            item.fileNames?.includes(fileName),
        )

        return fileIcon?.name
    },

    byFileExtension: (fileExtension) => {
        const fileIcon = fileIcons.find((item) =>
            item.fileExtensions?.includes(fileExtension),
        )
        return fileIcon?.name
    },
    byFolder: (fileName) => {
        const folderIcon = folderIcons.find((item) =>
            item.folderNames.includes(fileName),
        )

        return folderIcon?.name
    },
    byLanguage: (ids) => {
        const languageIcon = languageIcons.find((item) =>
            item.ids.includes(ids),
        )

        return languageIcon?.name
    },
}
