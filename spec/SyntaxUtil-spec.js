'use babel';

import SyntaxUtil from '../lib/SyntaxUtil';

describe('SyntaxUtil', () => {
    describe('when newLineizeEditorText util func is used', () => {
        it('should append a newline to pieces of text without a newline at the end', () => {
            var beforeText = 'This text has no newline.';
            var expectedText = 'This text has no newline.\n';
            var afterText = SyntaxUtil.newLineizeEditorText(beforeText);

            expect(afterText).toBe(expectedText);
        });

        it('should NOT append a newline to pieces of text with a newline at the end', () => {
            var beforeText = 'This text has a newline.\n';
            var expectedText = 'This text has a newline.\n';
            var afterText = SyntaxUtil.newLineizeEditorText(beforeText);

            expect(afterText).toBe(expectedText);
        });
    });
});
