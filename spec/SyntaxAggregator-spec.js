'use babel';

// TODO mock request calls using proxyquire or something similar
// https://github.com/thlorenz/proxyquire

import SyntaxAggregator from '../lib/SyntaxAggregator';

describe('SyntaxAggregator', () => {
    let syntaxAggregator, workspaceElement, activationPromise;

    beforeEach(() => {
        workspaceElement = atom.views.getView(atom.workspace);

        // Attaching the workspaceElement to the DOM is required to allow the
        // `toBeVisible()` matchers to work. Anything testing visibility or focus
        // requires that the workspaceElement is on the DOM. Tests that attach the
        // workspaceElement to the DOM are generally slower than those off DOM.
        jasmine.attachToDOM(workspaceElement);

        waitsForPromise(() => atom.workspace.open());

        runs(() => {
            // Atom packages with "activationCommands" in package.json are lazy loaded
            activationPromise = atom.packages.activatePackage('syntaxdb-atom-plugin');
        });
    });

    describe("when aggregator is toggled", () => {
        it("should display a syntaxdb filter view", () => {
            // Expect the SyntaxDB filter panel to not be there yet
            expect(workspaceElement.querySelector(".syntaxdb-filter")).not.toExist();
            // Trigger the SyntaxDB language filter bar
            atom.commands.dispatch(workspaceElement, 'syntaxdb-atom-plugin:language-filter');
            // Dispatch should now trigger the package. Wait for package to be loaded
            waitsForPromise(() => activationPromise);

            waits(2000);

            runs(() => {
                // Should now be visible
                expect(workspaceElement.querySelector(".syntaxdb-filter")).toBeVisible();
            });
        });

        it("should display a list of languages that are covered by SyntaxDB", () => {
            // Expect the SyntaxDB filter panel to not be there yet
            expect(workspaceElement.querySelector(".syntaxdb-filter")).not.toExist();
            // Trigger the SyntaxDB language filter bar
            atom.commands.dispatch(workspaceElement, 'syntaxdb-atom-plugin:language-filter');
            // Dispatch should now trigger the package. Wait for package to be loaded
            waitsForPromise(() => activationPromise);

            waits(2000);

            runs(() => {
                // Should now be visible
                expect(workspaceElement.querySelector(".syntaxdb-filter")).toBeVisible();
            });
        });
    });

    describe("when language result is selected", () => {
        it('should display categories pretaining to that language', () => {
            expect('life').toBe('easy');
        });
    });

    describe("when category result is selected", () => {
        it('should display concepts pretaining to that category', () => {
            expect('life').toBe('easy');
        });
    });

    describe("when concept result is selected", () => {
        it('should display concept info in results view', () => {
            expect('life').toBe('easy');
        });
    });

    describe("when appropriate views aren't provided", () => {
        beforeEach(() => {
            syntaxAggregator = new SyntaxAggregator();
        });

        describe("when filter view isn't provided", () => {
            beforeEach(() => {
                expect(syntaxAggregator.filterView).not.toExist();
            });

            it("shouldn't attempt to open filter view", () => {
                expect(syntaxAggregator.show).toThrow(new Error("No filter view provided"));
            });

            it("shouldn't attempt to hide filter view", () => {
                expect(syntaxAggregator.hide).toThrow(new Error("No filter view provided"));
            });
        });

        describe("when result view isn't provided", () => {
            it("shouldn't attempt to open search results view", () => {
                expect('life').toBe('easy');
            });

            it("shouldn't attempt to hide search results view", () => {
                expect('life').toBe('easy');
            });
        });
    });
});
