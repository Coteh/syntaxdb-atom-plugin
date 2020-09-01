'use babel';

// TODO mock request calls using proxyquire or something similar
// https://github.com/thlorenz/proxyquire

import SyntaxAggregator from '../lib/SyntaxAggregator';

describe('SyntaxAggregator', () => {
    let syntaxAggregator;

    describe('when toggled', () => {
        it('should request languages', () => {
            throw new Error('Not implemented');
        });
        it('should show the filter view if hidden', () => {
            throw new Error('Not implemented');
        });
        it('should hide the filter view if shown', () => {
            throw new Error('Not implemented');
        });
    });

    describe('when shown', () => {
        it('should show the view', () => {
            throw new Error('Not implemented');
        });
    });

    describe('when hidden', () => {
        it('hides the view', () => {
            throw new Error('Not implemented');
        });
    });

    describe('when language item selected', () => {
        it('should request categories', () => {
            throw new Error('Not implemented');
        });
    });

    describe('when category item selected', () => {
        it('should request concepts', () => {
            throw new Error('Not implemented');
        });
    });

    describe('when concept item selected', () => {
        it('should request concept', () => {
            throw new Error('Not implemented');
        });
    });

    describe('when resource requested', () => {
        describe('list of languages', () => {
            it('should send list of languages to the view', () => {
                throw new Error('Not implemented');
            });
        });
        describe('list of category', () => {
            it('should send list of categories to the view', () => {
                throw new Error('Not implemented');
            });
        });
        describe('list of concepts', () => {
            it('should send list of concepts to the view', () => {
                throw new Error('Not implemented');
            });
        });
        describe('concept', () => {
            it('should send concept to view', () => {
                throw new Error('Not implemented');
            });
        });
    });

    describe("when views aren't provided", () => {
        beforeEach(() => {
            syntaxAggregator = new SyntaxAggregator();
        });

        describe("when filter view isn't provided", () => {
            beforeEach(() => {
                expect(syntaxAggregator.filterView).not.toExist();
            });

            it("shouldn't attempt to open filter view", () => {
                expect(syntaxAggregator.show).toThrow(
                    new Error('No filter view provided'),
                );
            });

            it("shouldn't attempt to hide filter view", () => {
                expect(syntaxAggregator.hide).toThrow(
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
