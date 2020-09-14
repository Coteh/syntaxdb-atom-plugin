'use babel';

import request from 'request';
import SyntaxFilterView from '../lib/view/SyntaxFilterView';
import SyntaxResultView from '../lib/view/SyntaxResultView';
import { LanguageFilterMode } from '../lib/domain/SyntaxModes';
const sinon = require('sinon');
const SyntaxAggregator = require('../lib/domain/SyntaxAggregator');
const fs = require('fs');
const chai = require('chai');
const { expect } = require('chai');
chai.use(require('sinon-chai'));

describe('SyntaxAggregator', () => {
    let syntaxAggregator;
    let filterView;
    let resultView;

    beforeEach(() => {
        syntaxAggregator = new SyntaxAggregator();
        filterView = sinon.createStubInstance(SyntaxFilterView);
        resultView = sinon.createStubInstance(SyntaxResultView);
        syntaxAggregator.setViews({
            filterView: filterView,
            resultView: resultView,
        });
    });

    describe('when it goes from untoggled to toggled', () => {
        let getStub;
        const languagesJSONStr = fs.readFileSync(
            './spec/items/languages.json',
            'utf8',
        );
        const languagesJSON = JSON.parse(languagesJSONStr);

        beforeEach(() => {
            getStub = sinon.stub(request, 'get');
        });
        it('should send language items to filter view', () => {
            expect(getStub).to.not.have.been.called;

            syntaxAggregator.toggle();
            getStub.yield(null, null, languagesJSONStr);

            expect(getStub).to.have.been.calledOnce;
            expect(filterView.setItems).to.have.been.calledWith(languagesJSON);
        });
        it('should be in language select mode', () => {
            expect(syntaxAggregator.currentMode).to.equal(
                LanguageFilterMode.NONE,
            );

            syntaxAggregator.toggle();
            getStub.yield(null, null, languagesJSONStr);

            expect(syntaxAggregator.currentMode).to.equal(
                LanguageFilterMode.SELECT_LANGUAGE,
            );
        });
        it('should show the filter view', () => {
            expect(filterView.showPanel).to.not.have.been.called;

            syntaxAggregator.toggle();
            getStub.yield(null, null, languagesJSONStr);

            expect(filterView.showPanel).to.have.been.calledOnce;
        });
        afterEach(() => {
            getStub.restore();
        });
    });

    describe('when it goes from toggled to untoggled', () => {
        let getStub;
        const languagesJSONStr = fs.readFileSync(
            './spec/items/languages.json',
            'utf8',
        );
        const languagesJSON = JSON.parse(languagesJSONStr);

        beforeEach(() => {
            getStub = sinon.stub(request, 'get');

            expect(filterView.showPanel).to.not.have.been.called;
            expect(filterView.hidePanel).to.not.have.been.called;

            syntaxAggregator.toggle();
            getStub.yield(null, null, languagesJSONStr);

            expect(filterView.showPanel).to.have.been.calledOnce;
            expect(filterView.hidePanel).to.not.have.been.called;
        });
        it('should hide the filter view', () => {
            filterView.isPanelVisible = sinon.stub().returns(true);
            syntaxAggregator.toggle();

            expect(filterView.showPanel).to.have.been.calledOnce;
            expect(filterView.hidePanel).to.have.been.calledOnce;
        });
        afterEach(() => {
            getStub.restore();
        });
    });

    describe('when show triggered', () => {
        it('should show the filter view', () => {
            expect(filterView.showPanel).to.not.have.been.called;

            syntaxAggregator.show();

            expect(filterView.showPanel).to.have.been.calledOnce;
        });
    });

    describe('when hidden', () => {
        it('hides the view', () => {
            expect(filterView.hidePanel).to.not.have.been.called;

            syntaxAggregator.hide();

            expect(filterView.hidePanel).to.have.been.calledOnce;
        });
    });

    describe('when language item selected', () => {
        let getStub;
        const categoriesJSONStr = fs.readFileSync(
            './spec/items/categories.json',
            'utf8',
        );
        const categoriesJSON = JSON.parse(categoriesJSONStr);

        beforeEach(() => {
            getStub = sinon.stub(request, 'get');
        });
        it('should request categories', () => {
            syntaxAggregator.onSelect({
                item: {
                    language_permalink: 'csharp',
                },
                mode: LanguageFilterMode.SELECT_LANGUAGE,
            });
            getStub.yield(null, null, categoriesJSONStr);

            expect(getStub).to.have.been.calledOnce;
            expect(filterView.setItems).to.have.been.calledWith(categoriesJSON);
        });
        it('should show the results in a new panel', () => {
            syntaxAggregator.onSelect({
                item: {
                    language_permalink: 'csharp',
                },
                mode: LanguageFilterMode.SELECT_LANGUAGE,
            });
            getStub.yield(null, null, categoriesJSONStr);

            expect(filterView.showPanel).to.have.been.calledOnce;
        });
        afterEach(() => {
            getStub.restore();
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
