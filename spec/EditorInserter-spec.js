'use babel';

import EditorInserter, {
    EmptyInsertionTextError,
    MissingEditorError,
} from '../lib/editor/EditorInserter';
import sinon from 'sinon';
import chai from 'chai';
import { expect } from 'chai';

chai.use(require('sinon-chai'));

class EditorStub {
    getSelections() {}
}

class SelectionStub {
    getText() {}
    selectToBeginningOfLine() {}
    selectRight() {}
    insertText() {}
}

describe('EditorInserter', () => {
    let editorInserter;
    let editorStub;

    beforeEach(() => {
        editorStub = sinon.createStubInstance(EditorStub);
        editorInserter = new EditorInserter(editorStub);
    });

    describe('when text insertion performed', () => {
        it('should invoke text editor insertion', () => {
            // Stubs
            let stubSelection = sinon.createStubInstance(SelectionStub);
            stubSelection.getText = sinon.stub().returns('');
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
            expect(stubSelection.getText).to.have.been.calledOnce;
            expect(stubSelection.getText).to.have.returned('');
            expect(stubSelection.insertText).to.have.been.calledTwice;
            expect(
                stubSelection.insertText
                    .getCall(0)
                    .calledWithExactly('Hello World'),
            ).to.be.true;
            expect(stubSelection.insertText.getCall(1).calledWithExactly('')).to
                .be.true;
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
            // Stubs
            let stubSelections = new Array(3);
            for (let i = 0; i < stubSelections.length; i++) {
                stubSelections[i] = sinon.createStubInstance(SelectionStub);
                stubSelections[i].getText = sinon.stub().returns('');
            }
            editorStub.getSelections = sinon.stub().returns(stubSelections);

            // Precondition
            expect(editorStub.getSelections).to.not.have.been.called;
            for (let i = 0; i < stubSelections.length; i++) {
                expect(stubSelections[i].insertText).to.not.have.been.called;
                expect(stubSelections[i].getText).to.not.have.been.called;
            }

            // Action
            editorInserter.insertText('Hello World');

            // Postconditions
            expect(editorStub.getSelections).to.have.been.calledOnce;
            expect(editorStub.getSelections).to.have.returned(stubSelections);
            for (let i = 0; i < stubSelections.length; i++) {
                expect(stubSelections[i].insertText).to.have.been.calledTwice;
                expect(
                    stubSelections[i].insertText
                        .getCall(0)
                        .calledWithExactly('Hello World'),
                ).to.be.true;
                expect(
                    stubSelections[i].insertText
                        .getCall(1)
                        .calledWithExactly(''),
                ).to.be.true;
            }
        });
        it('should prepend the same spacing as the first line to all other lines', () => {
            // Stubs
            let stubSelection = sinon.createStubInstance(SelectionStub);
            stubSelection.getText = sinon.stub().returns('\t\t\t');
            editorStub.getSelections = sinon.stub().returns([stubSelection]);

            // Precondition
            expect(editorStub.getSelections).to.not.have.been.called;
            expect(stubSelection.insertText).to.not.have.been.called;
            expect(stubSelection.getText).to.not.have.been.called;

            // Action
            editorInserter.insertText(
                'for (int i = 0; i < 5; i++) {\n\tcout << i;\n}',
            );

            // Postconditions
            expect(stubSelection.insertText).to.have.been.calledTwice;
            expect(stubSelection.getText).to.have.returned('\t\t\t');
            expect(stubSelection.insertText).to.have.been.calledWith(
                'for (int i = 0; i < 5; i++) {',
            );
            expect(stubSelection.insertText).to.have.been.calledWith(
                '\t\t\t\tcout << i;\n\t\t\t}',
            );
        });
    });
});
