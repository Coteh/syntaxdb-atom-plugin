'use babel';

import KeybindFinder from "../lib/KeybindFinder";

describe("KeybindFinder", () => {
    let activationPromise;

    beforeEach(() => {
        activationPromise = atom.packages.activatePackage('syntaxdb-atom-plugin');
    });

    describe("when KeybindFinder is initialized", () => {
        it("should save the command passed into it as constructor argument", () => {
            var command = "syntaxdb-atom-plugin:test";
            var keybindFinder = new KeybindFinder(command);

            expect(typeof(keybindFinder)).toBe("object");
            expect(keybindFinder.command).toBe(command);
        });
    });

    describe("when KeybindFinder finds bindings", () => {
        it("should return a keymap collection", () => {
            var command = "syntaxdb-atom-plugin:place-example";
            var keybindFinder = new KeybindFinder(command);

            var results = keybindFinder.findBindings();

            expect(typeof(results)).toBe("object");
            expect(results.length).toBe(1);
            expect(typeof(results[0])).toBe("object");
            expect(results[0].command).toBe(command);
        });

        it("should return null if the search did not find any keymaps", () => {
            var keybindFinder = new KeybindFinder("syntaxdb-atom-plugin:not-a-command");

            var results = keybindFinder.findBindings();

            expect(results).not.toExist();
        });
    });

    describe("when KeybindFinder finds the first instance of a binding", () => {
        it("should return a keymap object", () => {
            var command = "syntaxdb-atom-plugin:place-example";
            var keybindFinder = new KeybindFinder(command);

            var result = keybindFinder.findFirstBinding();

            expect(typeof(result)).toBe("object");
            expect(result.command).toBe(command);
        });

        it("should return null if the search did not find any keymaps", () => {
            var keybindFinder = new KeybindFinder("syntaxdb-atom-plugin:not-a-command");

            var result = keybindFinder.findFirstBinding();

            expect(result).not.toExist();
        });
    });
})
