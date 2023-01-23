let executions = 0
let timerID = null
let rowList = null
const rushBatch = 90

const observer = new MutationObserver(() => {
    // ignore if there is no icon list
    if (!document.querySelector(selectors.row)) {
        return
    }

    // start to setup icons
    rowList = document.querySelectorAll(selectors.row)

    rowList.forEach((row) => {
        const callback = () => replaceIconInRow(row)

        if (executions <= rushBatch) {
            callback() // immediately run to prevent visual "blink"

            // run again later to catch any icons that are missed in large repositories
            setTimeout(callback, 20)
            executions += 1
        } else {
            // run without blocking to prevent delayed rendering of large folders too much
            setTimeout(callback)

            clearTimeout(timerID)

            // reset execution tracker
            timerID = setTimeout(() => (executions = 0), 1000)
        }
    })

    // replace all icons that was setup before
    replaceAllIcons()
})

observer.observe(document.body, {
    childList: true,
    subtree: true,
})
