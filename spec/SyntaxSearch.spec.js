'use babel';

import SyntaxSearch from '../lib/domain/SyntaxSearch';

describe('SyntaxSearch', () => {
    let syntaxSearch;

    describe('when search is shown', () => {
        it('should prompt search', () => {
            throw new Error('Not implemented');
        });
    });

    describe('when search is hidden', () => {
        it('should hide the search menu', () => {
            throw new Error('Not implemented');
        });
    });

    describe('when concept result is selected', () => {
        it('should request concept info', () => {
            expect('life').toBe('easy');
        });
    });

    describe('when resource requested', () => {
        describe('concept search results', () => {
            it('should send results to the filter view', () => {
                expect('life').toBe('easy');
            });
        });
    });

    describe("when views aren't provided", () => {
        beforeEach(() => {
            syntaxSearch = new SyntaxSearch();
        });

        describe("when search view isn't provided", () => {
            beforeEach(() => {
                expect(syntaxSearch.searchView).not.toExist();
            });

            it("shouldn't attempt to open the search view", () => {
                expect(syntaxSearch.showSearch).toThrow(
                    new Error('No search view provided'),
                );
            });

            it("shouldn't attempt to hide the search view", () => {
                expect(syntaxSearch.hideSearch).toThrow(
                    new Error('No search view provided'),
                );
            });
        });

        describe("when filter view isn't provided", () => {
            beforeEach(() => {
                expect(syntaxSearch.filterView).not.toExist();
            });

            it("shouldn't attempt to open search results view", () => {
                expect(syntaxSearch.showSearchResults).toThrow(
                    new Error('No filter view provided'),
                );
            });

            it("shouldn't attempt to hide search results view", () => {
                expect(syntaxSearch.hideSearchResults).toThrow(
                    new Error('No filter view provided'),
                );
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
