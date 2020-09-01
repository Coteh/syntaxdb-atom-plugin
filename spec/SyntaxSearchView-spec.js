'use babel';

describe('SyntaxSearchView', () => {
    let workspaceElement, activationPromise;

    beforeEach(() => {
        workspaceElement = atom.views.getView(atom.workspace);
        activationPromise = atom.packages.activatePackage(
            'syntaxdb-atom-plugin',
        );
    });

    describe('when search is toggled', () => {
        it('should display the search panel', () => {
            // Attaching the workspaceElement to the DOM is required to allow the
            // `toBeVisible()` matchers to work. Anything testing visibility or focus
            // requires that the workspaceElement is on the DOM. Tests that attach the
            // workspaceElement to the DOM are generally slower than those off DOM.
            jasmine.attachToDOM(workspaceElement);

            // Expect the SyntaxDB search bar panel to not be there yet
            expect(
                workspaceElement.querySelector('.syntaxdb-search'),
            ).not.toExist();

            // Trigger the SyntaxDB search bar
            atom.commands.dispatch(
                workspaceElement,
                'syntaxdb-atom-plugin:search',
            );

            waitsFor(() => {
                return activationPromise;
            });

            runs(() => {
                var searchPanel = workspaceElement.querySelector(
                    '.syntaxdb-search',
                );
                expect(searchPanel).toBeVisible();
            });
        });

        it('should clear out search text from previous search', () => {
            expect('life').toBe('easy');
        });
    });

    describe('when search results are returned', () => {
        it('should display search results', () => {
            expect('life').toBe('easy');
        });
    });

    describe('when concept result is selected', () => {
        it('should display concept info', () => {
            expect('life').toBe('easy');
        });
    });
});
