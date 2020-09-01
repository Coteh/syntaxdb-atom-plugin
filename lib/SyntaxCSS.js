'use babel';

export default class SyntaxCSS {
    static visibleFocusElement() {
        return {
            position: 'static',
            top: 'auto',
            opacity: 'initial',
        };
    }

    static invisibleFocusElement() {
        return {
            position: 'absolute',
            top: '-100px',
            opacity: '0',
        };
    }
}
