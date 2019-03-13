import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Row, Alert } from "react-bootstrap";
import PropTypes from "prop-types";
import { Fragment } from "react";
import "./AlertMessage.scss";

export default class AlertMessage extends React.PureComponent {
    static propTypes = {
        variant : PropTypes.string.isRequired,
        icon : PropTypes.string.isRequired,
        intro : PropTypes.string.isRequired,
        message : PropTypes.string.isRequired,
        instruction : PropTypes.string,
        delay : PropTypes.string,
        sizeIsSmall : PropTypes.bool,
        dismissible : PropTypes.bool
    };

    getClasses = () => {
        const { sizeIsSmall, delay } = this.props;

        return `w-100 mb-0 alertMessage animated fadeInUp ${delay || ""} ${
            sizeIsSmall ? "alert-small" : ""
        }`;
    };

    render() {
        const { message, intro, icon, variant, instruction, dismissible } = this.props;

        return (
            <Alert
                dismissible={dismissible}
                variant={variant}
                className={this.getClasses()}
                style={{ width : "100%" }}
            >
                <p className="mb-1">
                    <FontAwesomeIcon icon={icon} className="mr-2" />
                    {intro}
                </p>
                <p className="m-0">
                    <strong>{message}</strong>
                </p>
                {instruction && (
                    <p className="mt-2 mb-0">
                        <small>{instruction}</small>
                    </p>
                )}
            </Alert>
        );
    }
}
