const observer = new MutationObserver(() => {
    // ignore if there is no icon list
    // or icons are already replaced
    if (
        !document.querySelector(selectors.row) ||
        document.querySelector("img[data-github-material-icons]")
    ) {
        return
    }

    setTimeout(() => {
        // start to setup icons
        const rowList = document.querySelectorAll(selectors.row)
        rowList.forEach(replaceIconInRow)

        // replace all icons that was setup before
        replaceAllIcons()
    })
})

observer.observe(document.body, { childList: true, subtree: true })
