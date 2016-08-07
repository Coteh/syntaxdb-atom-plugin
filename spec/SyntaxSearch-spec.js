'use babel';

import SyntaxSearch from '../lib/SyntaxSearch';

describe('SyntaxSearch', () => {
    let syntaxSearch, workspaceElement, activationPromise;

    beforeEach(() => {
        workspaceElement = atom.views.getView(atom.workspace);
        activationPromise = atom.packages.activatePackage('syntaxdb-atom-plugin');
    });

    describe("when search is toggled", () => {
        it("should display the search panel", () => {
            // Attaching the workspaceElement to the DOM is required to allow the
            // `toBeVisible()` matchers to work. Anything testing visibility or focus
            // requires that the workspaceElement is on the DOM. Tests that attach the
            // workspaceElement to the DOM are generally slower than those off DOM.
            jasmine.attachToDOM(workspaceElement);

            // Expect the SyntaxDB search bar panel to not be there yet
            expect(workspaceElement.querySelector(".syntaxdb-search")).not.toExist();

            // Trigger the SyntaxDB search bar
            atom.commands.dispatch(workspaceElement, 'syntaxdb-atom-plugin:search');

            waitsFor(() => {
                return activationPromise;
            });

            runs(() => {
                var searchPanel = workspaceElement.querySelector(".syntaxdb-search");
                expect(searchPanel).toBeVisible();
            });
        });

        it("should clear out search text from previous search", () => {
            expect('life').toBe('easy');
        });
    });

    describe("when search results are obtained", () => {
        it('sends results to the filter view', () => {
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
            syntaxSearch = new SyntaxSearch();
        });

        describe("when search view isn't provided", () => {
            beforeEach(() => {
                expect(syntaxSearch.searchView).not.toExist();
            });

            it("shouldn't attempt to open the search view", () => {
                expect(syntaxSearch.showSearch).toThrow(new Error("No search view provided"));
            });

            it("shouldn't attempt to hide the search view", () => {
                expect(syntaxSearch.hideSearch).toThrow(new Error("No search view provided"));
            });
        });

        describe("when filter view isn't provided", () => {
            beforeEach(() => {
                expect(syntaxSearch.filterView).not.toExist();
            });

            it("shouldn't attempt to open search results view", () => {
                expect(syntaxSearch.showSearchResults).toThrow(new Error("No filter view provided"));
            });

            it("shouldn't attempt to hide search results view", () => {
                expect(syntaxSearch.hideSearchResults).toThrow(new Error("No filter view provided"));
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
