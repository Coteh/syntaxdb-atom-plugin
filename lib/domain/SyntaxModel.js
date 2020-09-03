'use babel';

/*
 * A SyntaxModel represents a model representing
 * SyntaxDB plugin logic.
 */
export default class SyntaxModel {
    /*
     * Set views for the SyntaxModel.
     * The views object will contain views to pass.
     * Overridden by child classes to
     * define how they will handle the views.
     */
    setViews(views) {}

    /*
     * Children of SyntaxModel can override this
     * to define their own way of displaying message
     * to their views
     */
    displayMessage(message) {}

    /**********
     * Callbacks
     ***********/

    /*
     * A callback that will handle a response from SyntaxDB
     */
    onRequestReceived(results, options) {}

    /*
     * A callback that can handle selection events
     */
    onSelect(result) {}

    /*
     * A callback that can handle cancellation/back events
     */
    onCancel() {}
}
