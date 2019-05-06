import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Row, Alert } from "react-bootstrap";
import PropTypes from "prop-types";
import { Fragment } from "react";
import "./AlertMessage.scss";

export default class AlertMessage extends React.PureComponent {
    static propTypes = {
        introIsBold : PropTypes.bool,
        messageIsBold : PropTypes.bool,
        variant : PropTypes.string.isRequired,
        icon : PropTypes.string.isRequired,
        intro : PropTypes.string.isRequired,
        message : PropTypes.string.isRequired,
        onClose : PropTypes.func,
        instruction : PropTypes.string,
        introDirection : PropTypes.string,
        delay : PropTypes.string,
        sizeIsSmall : PropTypes.bool,
        dismissible : PropTypes.bool
    };

    getClasses = () => {
        const { sizeIsSmall, delay, introDirection } = this.props;

        return `w-100 mb-0 alertMessage animated ${introDirection || "fadeInUp"} ${delay || ""} ${
            sizeIsSmall ? "alert-small" : ""
        }`;
    };

    render() {
        const {
            message,
            intro,
            icon,
            variant,
            instruction,
            dismissible,
            introIsBold,
            messageIsBold,
            onClose
        } = this.props;

        return (
            <Alert
                onClose={onClose}
                dismissible={dismissible}
                variant={variant}
                className={this.getClasses()}
                style={{ width : "100%" }}
            >
                <p className="mb-1">
                    <FontAwesomeIcon icon={icon} className="mr-2" />
                    {introIsBold ? <strong>{intro}</strong> : intro}
                </p>

                <p className="m-0" style={{ fontSize : "0.9em" }}>
                    {messageIsBold ? <strong>{message}</strong> : message}
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
