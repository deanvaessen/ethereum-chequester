import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Row, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { Fragment } from "react";

export default class ActionButtons extends React.PureComponent {
    static propTypes = {
        handleConfirmation : PropTypes.func.isRequired,
        handleAbort : PropTypes.func.isRequired,
        variantConfirmation : PropTypes.string.isRequired,
        variantAbort : PropTypes.string.isRequired,
        confirmationLabel : PropTypes.string.isRequired,
        abortLabel : PropTypes.string.isRequired,
        confirmationIcon : PropTypes.oneOfType( [ PropTypes.string, PropTypes.array ] ).isRequired,
        abortIcon : PropTypes.string.isRequired,
        disabled : PropTypes.bool.isRequired,
        disabledAbort : PropTypes.bool.isRequired,
        delay : PropTypes.string
    };

    getClasses = () => {
        const { delay } = this.props;

        return ""; //`w-100 animated fadeInUp ${delay || ""}`;
    };

    render() {
        const {
            handleConfirmation,
            handleAbort,
            variantConfirmation,
            variantAbort,
            confirmationLabel,
            abortLabel,
            confirmationIcon,
            abortIcon,
            disabled,
            disabledAbort,
            delay
        } = this.props;

        return (
            <span className={this.getClasses()} style={{ width : "100%" }}>
                <Button
                    className="mr-2"
                    variant={variantConfirmation}
                    onClick={handleConfirmation}
                    disabled={disabled}
                >
                    <FontAwesomeIcon icon={confirmationIcon} className="mr-2" />
                    {confirmationLabel}
                </Button>

                <Button variant={variantAbort} onClick={handleAbort} disabled={disabledAbort}>
                    <FontAwesomeIcon icon={abortIcon} className="mr-2" />
                    {abortLabel}
                </Button>
            </span>
        );
    }
}
