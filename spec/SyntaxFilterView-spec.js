'use babel';

import SyntaxFilterView from '../lib/SyntaxFilterView';

describe('SyntaxFilterView', () => {
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
        it('should ensure that the filter text editor view is in panel view', () => {
            expect('life').toBe('easy');
        });
    });

    describe("when filter view is populated with no items", () => {
        it('should position the filter text editor view away from panel view', () => {
            expect('life').toBe('easy');
        });
    });
});
