import { Fragment } from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

export default class ChequeDownloader extends React.PureComponent {
    static propTypes = {
        cheque : PropTypes.object.isRequired,
        filename : PropTypes.string.isRequired,
        children : PropTypes.object
    };

    packageFile = () => {
        const { cheque } = this.props;

        return "text/json;charset=utf-8," + encodeURIComponent( JSON.stringify( cheque ) );
    };

    prepareFilename = () => {
        const { filename } = this.props;

        return `${filename}_${Date.now()}.json`;
    };

    render() {
        const { children } = this.props;

        return (
            <a href={` data: ${this.packageFile()}`} download={this.prepareFilename()}>
                {children || (
                    <Button className="" variant="primary">
                        <FontAwesomeIcon icon="download" className="mr-2" />
                        Download as file
                    </Button>
                )}
            </a>
        );
    }
}
