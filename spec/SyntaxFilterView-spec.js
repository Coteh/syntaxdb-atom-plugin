'use babel';

import SyntaxFilterView from '../lib/SyntaxFilterView';

describe('SyntaxSearch', () => {
    describe("when filter view is shown", () => {
        
    });

    describe("when item is selected on filter view", () => {
        it('should emit the selection event', () => {
          expect('life').toBe('easy');
        });
    });

    describe("when filter view is cancelled", () => {
        it('should emit the cancellation event', () => {
          expect('life').toBe('easy');
        });
    });

    describe("when filter view is populated with items", () => {
        it('should ensure that the filter text view is in view', () => {
          expect('life').toBe('easy');
        });
    });

    describe("when filter view is populated with no items", () => {
        it('should move the filter text view away from view', () => {
          expect('life').toBe('easy');
        });
    });
});
