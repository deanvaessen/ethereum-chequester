import PropTypes from "prop-types";
import Page from "../Page";
import AlertMessage from "../AlertMessage";

export default class PageNotFound extends React.PureComponent {
    static propTypes = {
        children : PropTypes.array.isRequired
    };

    render() {
        return (
            <Page>
                <h2 className="mt-2 mb-2">We seem to have run into some trouble...</h2>
                <hr className="mb-4" />
                  <div className="alert-spacer">
                    <AlertMessage
                        style={{ width : "100%" }}
                        intro="Oh no!"
                        message={"404! Page not found :("}
                        icon="bug"
                        variant="danger"
                        dismissible={false}
                        instruction="Please try again, but a different page."
                    />
                </div>
            </Page>
        );
    }
}
