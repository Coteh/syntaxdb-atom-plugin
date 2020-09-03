'use babel';

export default class KeybindFinder {
    constructor(command) {
        this.command = command;
    }

    findBindings() {
        let keymap = atom.keymaps.findKeyBindings({
            command: this.command,
        });
        return keymap ? keymap : null;
    }

    findFirstBinding() {
        let keymap = this.findBindings();
        if (keymap) {
            let firstKey = keymap[0];
            if (firstKey) {
                return firstKey;
            }
        }
        return null;
    }
}
