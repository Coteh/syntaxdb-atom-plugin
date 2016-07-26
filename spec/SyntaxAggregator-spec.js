'use babel';

import SyntaxAggregator from '../lib/SyntaxAggregator';

describe('SyntaxSearch', () => {
    describe("when aggregator is toggled", () => {
        it('should not error out if no filter view provided', () => {
          expect('life').toBe('easy');
        });

        it('should not error out if no result view provided', () => {
          expect('life').toBe('easy');
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
});
