'use babel';

import SyntaxSearch from '../lib/SyntaxSearch';

describe('SyntaxSearch', () => {
    describe("when search is toggled", () => {
        it('should not error out if no search view provided', () => {
          expect('life').toBe('easy');
        });

        it('should not error out if no filter view provided', () => {
          expect('life').toBe('easy');
        });

        it('should not error out if no result view provided', () => {
          expect('life').toBe('easy');
        });

        it('clears search text from previous search', () => {
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
});
