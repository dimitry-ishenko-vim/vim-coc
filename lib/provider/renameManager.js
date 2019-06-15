"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vscode_languageserver_protocol_1 = require("vscode-languageserver-protocol");
const manager_1 = tslib_1.__importDefault(require("./manager"));
const uuid = require("uuid/v4");
class RenameManager extends manager_1.default {
    register(selector, provider) {
        let item = {
            id: uuid(),
            selector,
            provider
        };
        this.providers.add(item);
        return vscode_languageserver_protocol_1.Disposable.create(() => {
            this.providers.delete(item);
        });
    }
    async provideRenameEdits(document, position, newName, token) {
        let item = this.getProvider(document);
        if (!item)
            return null;
        let { provider } = item;
        return await Promise.resolve(provider.provideRenameEdits(document, position, newName, token));
    }
    async prepareRename(document, position, token) {
        let item = this.getProvider(document);
        if (!item)
            return null;
        let { provider } = item;
        if (provider.prepareRename == null)
            return null;
        let res = await Promise.resolve(provider.prepareRename(document, position, token));
        // can not rename
        if (res == null)
            false;
        return res;
    }
    dispose() {
        this.providers = new Set();
    }
}
exports.default = RenameManager;
//# sourceMappingURL=renameManager.js.map