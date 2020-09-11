'use babel';

const proxyquire = require('proxyquire');
const sinon = require('sinon');
const getStub = sinon.stub();
const SyntaxAggregator = proxyquire('../lib/domain/SyntaxAggregator', {
    request: {
        get: getStub,
    },
}).default;
const { expect } = require('chai');

describe('SyntaxAggregator', () => {
    let syntaxAggregator;

    beforeEach(() => {
        syntaxAggregator = new SyntaxAggregator();
    });

    describe('when it goes from untoggled to toggled', () => {
        it('should request languages', () => {
            syntaxAggregator.setViews({ filterView: {}, resultView: {} });
            syntaxAggregator.toggle();
            expect(getStub).to.have.been.calledOnce;
        });
        it('should show the filter view', () => {
            throw new Error('Not implemented');
        });
    });

    describe('when it goes from toggled to untoggled', () => {
        it('should hide the filter view', () => {
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
        describe("when filter view isn't provided", () => {
            beforeEach(() => {
                expect(syntaxAggregator.filterView).not.exist;
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
                throw new Error('Not implemented');
            });

            it("shouldn't attempt to hide search results view", () => {
                throw new Error('Not implemented');
            });
        });
    });
});
