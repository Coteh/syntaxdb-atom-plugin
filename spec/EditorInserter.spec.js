'use babel';

import EditorInserter, {
    EmptyInsertionTextError,
    MissingEditorError,
} from '../lib/editor/EditorInserter';
import sinon from 'sinon';
import chai from 'chai';
import { expect } from 'chai';

chai.use(require('sinon-chai'));

class Editor {
    getSelections() {}
}

class Selection {
    getText() {}
    selectToBeginningOfLine() {}
    selectRight() {}
    insertText() {}
}

describe('EditorInserter', () => {
    let editorInserter;
    let editorStub;

    beforeEach(() => {
        editorStub = sinon.createStubInstance(Editor);
        editorInserter = new EditorInserter(editorStub);
    });

    describe('when text insertion performed', () => {
        it('should invoke text editor insertion', () => {
            // Stubs
            let stubSelection = sinon.createStubInstance(Selection);
            stubSelection.getText = sinon.stub().returns(['']);
            editorStub.getSelections = sinon.stub().returns([stubSelection]);

            // Precondition
            expect(editorStub.getSelections).to.not.have.been.called;
            expect(stubSelection.insertText).to.not.have.been.called;
            expect(stubSelection.getText).to.not.have.been.called;

            // Action
            editorInserter.insertText('Hello World');

            // Postconditions
            expect(editorStub.getSelections).to.have.been.calledOnce;
            expect(editorStub.getSelections).to.have.returned([stubSelection]);
            expect(stubSelection.insertText).to.have.been.calledTwice;
            expect(stubSelection.getText).to.have.been.calledOnce;
            expect(stubSelection.getText).to.have.returned(['']);
        });
        it('should throw error if text is empty', () => {
            expect(() => editorInserter.insertText('')).to.throw(
                EmptyInsertionTextError,
            );
        });
        it('should throw error if text is null', () => {
            expect(() => editorInserter.insertText(null)).to.throw(
                EmptyInsertionTextError,
            );
        });
        it('should throw error if text is undefined', () => {
            expect(() => editorInserter.insertText(undefined)).to.throw(
                EmptyInsertionTextError,
            );
        });
        it('should throw error if no editor provided', () => {
            editorInserter = new EditorInserter(null);
            expect(() => editorInserter.insertText('Hello World')).to.throw(
                MissingEditorError,
            );
        });
        it('should insert into multiple selections', () => {
            throw new Error('Not implemented');
        });
        it('should prepend the same spacing as the first line to all other lines', () => {
            throw new Error('Not implemented');
        });
    });
});
