const observer = new MutationObserver(() => {
    // ignore if there is no icon list
    // or icons are already replaced
    if (
        !document.querySelector(selectors.row) ||
        document.querySelector("img[data-github-material-icons]")
    ) {
        return
    }

    // start to setup icons
    document.querySelectorAll(selectors.row).forEach(replaceIconInRow)
})

observer.observe(document.body, { childList: true, subtree: true })
