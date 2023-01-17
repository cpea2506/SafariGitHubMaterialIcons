//
// Created by Do Vien on 17/01/2023 at 16:53.
//
// Copyright © 2023 CPea2506. All rights reserved.
//

import os.log
import SafariServices

let SFExtensionMessageKey = "message"

class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {
    func beginRequest(with context: NSExtensionContext) {
        let item = context.inputItems[0] as! NSExtensionItem
        let message = item.userInfo?[SFExtensionMessageKey]
        os_log(.default, "Received message from browser.runtime.sendNativeMessage: %@", message as! CVarArg)

        let response = NSExtensionItem()
        response.userInfo = [SFExtensionMessageKey: ["Response to": message]]

        context.completeRequest(returningItems: [response], completionHandler: nil)
    }
}
