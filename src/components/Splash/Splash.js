import PropTypes from "prop-types";
import MetaMaskFox from "../MetaMaskFox";
import AlertMessage from "../AlertMessage";
import { Fragment } from "react";
import { Button, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class Splash extends React.PureComponent {
    static propTypes = {
        metaMaskError : PropTypes.string.isRequired,
        skipSplash : PropTypes.func.isRequired
    };

    render() {
        const { metaMaskError, skipSplash } = this.props;

        return (
            <Fragment>
                <Row
                    className="mx-auto mb-4 h-100 animated fadeInUp"
                    style={{ display : "flex", alignItems : "end", justifyContent : "center" }}
                >
                    <div
                        className="mb-0 col-12 mx-auto"
                        style={{ marginTop : "5rem", maxWidth : "500px" }}
                    >
                        <a
                            href="https://metamask.io"
                            target="blank"
                            style={{ textDecoration : "none" }}
                        >
                            <MetaMaskFox entranceAnimation="fadeIn" />
                        </a>
                        <div
                            className="w-100"
                            style={{ display : "flex", justifyContent : "center" }}
                        >
                            <div className="alert-spacer">
                                <a
                                    href="https://metamask.io"
                                    target="blank"
                                    style={{ textDecoration : "none" }}
                                >
                                    <AlertMessage
                                        style={{ width : "100%" }}
                                        intro="MetaMask is not available!"
                                        messageIsBold={true}
                                        message={metaMaskError}
                                        icon="sign-in-alt"
                                        variant="warning"
                                        dismissible={false}
                                        instruction="Press continue to proceed with limited functionality."
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                </Row>
                <Row
                    className="mx-auto h-100 animated fadeInUp"
                    style={{
                        display : "flex",
                        alignItems : "start",
                        justifyContent : "center",
                        width : "100%",
                        maxWidth : "335px"
                    }}
                >
                    <Button
                        variant="secondary"
                        size="lg"
                        onClick={skipSplash}
                        style={{
                            fontSize : "25px",
                            width : "100%"
                        }}
                    >
                        {/*<FontAwesomeIcon icon={[ "fab", "ethereum" ]} className="mr-2" />*/}
                        Continue
                    </Button>
                </Row>
            </Fragment>
        );
    }
}
