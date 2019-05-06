import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./style.scss";
import FormSpacer from "../FormSpacer";
import { Row, Col, Form, InputGroup, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ChequeDownloader from "../ChequeDownloader";

export default class SharingOptions extends React.Component {
    static propTypes = {
        shouldIncludeOwner : PropTypes.bool.isRequired,
        shouldIncludeRecipient : PropTypes.bool.isRequired,
        shouldIncludeSelf : PropTypes.bool.isRequired,
        shouldIncludeDownload : PropTypes.bool.isRequired,
        subject : PropTypes.string.isRequired,
        append : PropTypes.string,
        json : PropTypes.object,
        filename : PropTypes.string
    };

    initialState = {
        ownerEmail : "",
        selfEmail : "",
        recipientEmails : "",
        description : ""
    };

    state = this.initialState;

    render() {
        const {
            subject,
            append,
            shouldIncludeOwner,
            shouldIncludeRecipient,
            shouldIncludeDownload,
            shouldIncludeSelf,
            json,
            filename,
            selfEmail
        } = this.props;
        const { description, recipientEmails, ownerEmail } = this.state;
        const to = ownerEmail || recipientEmails;
        const cc = ownerEmail ? recipientEmails.split( " " ).join( "" ) : "";
        const linebreak = "%0D%0A";
        const footer = append && `${linebreak}${linebreak}${append}`;
        const body = `${description}${footer && footer}`;
        const mailTo = `mailto:${to}?subject=${subject}&body=${body}&cc=${cc}`;

        return (
            <Form
                className="w-100"
                onSubmit={() => {}}
                //action={`mailto:?${to}?subject=${subject}&body=${body}&cc=${cc}`}
                //method="GET"
            >
                {shouldIncludeOwner && (
                    <Form.Row className="mt-2">
                        <Form.Group as={Col} md="12">
                            <Form.Label>
                                Owner e-mail address
                                <FontAwesomeIcon size="xs" icon="star" className="pb-2" />
                            </Form.Label>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <Button
                                        id="targetHashInput__prepend"
                                        variant="outline-secondary"
                                    >
                                        <FontAwesomeIcon icon="envelope" />
                                    </Button>
                                </InputGroup.Prepend>
                                <Form.Control
                                    type="text"
                                    aria-label="Owner e-mail address"
                                    placeholder="Owner e-mail address"
                                    aria-describedby="basic-addon2"
                                    name="ownerEmail"
                                    value={ownerEmail}
                                    onChange={e => this.setState( { ownerEmail : e.target.value } )}
                                />
                            </InputGroup>
                        </Form.Group>
                    </Form.Row>
                )}

                {shouldIncludeRecipient && (
                    <Form.Row className="mt-2">
                        <Form.Group as={Col} md="12">
                            <Form.Label>
                                Recipient e-mail addresses
                                <FontAwesomeIcon size="xs" icon="star" className="pb-2" />
                            </Form.Label>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <Button
                                        id="targetHashInput__prepend"
                                        variant="outline-secondary"
                                    >
                                        <FontAwesomeIcon icon="envelope" />
                                    </Button>
                                </InputGroup.Prepend>
                                <Form.Control
                                    type="text"
                                    aria-label="Recipients e-mail address"
                                    placeholder="Recipients e-mail address"
                                    aria-describedby="basic-addon2"
                                    name="recipientEmails"
                                    value={recipientEmails}
                                    onChange={e =>
                                        this.setState( { recipientEmails : e.target.value } )
                                    }
                                />
                            </InputGroup>
                        </Form.Group>
                    </Form.Row>
                )}

                {shouldIncludeSelf && (
                    <Form.Row className="mt-2">
                        <Form.Group as={Col} md="12">
                            <Form.Label>
                                Your own e-mail address
                                <FontAwesomeIcon size="xs" icon="star" className="pb-2" />
                            </Form.Label>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <Button
                                        id="targetHashInput__prepend"
                                        variant="outline-secondary"
                                    >
                                        <FontAwesomeIcon icon="envelope" />
                                    </Button>
                                </InputGroup.Prepend>
                                <Form.Control
                                    type="text"
                                    aria-label="Your own e-mail address"
                                    placeholder="Your own e-mail address"
                                    aria-describedby="basic-addon2"
                                    name="selfEmail"
                                    value={selfEmail}
                                    onChange={e => this.setState( { selfEmail : e.target.value } )}
                                />
                            </InputGroup>
                        </Form.Group>
                    </Form.Row>
                )}

                <Form.Row>
                    <Form.Group as={Col} md="12" controlId="chequeDescription">
                        <Form.Label>
                            Description
                            <FontAwesomeIcon size="xs" icon="star" className="pb-2" />
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            placeholder="Optional message to be sent to all recipients"
                            name="E-mail description"
                            value={description}
                            onChange={e => this.setState( { description : e.target.value } )}
                            rows="3"
                        />
                    </Form.Group>
                </Form.Row>
                <p className="m-0">
                    <small>
                        <FontAwesomeIcon icon="star" className="pb-2" />
                        Will not be recorded. Only used to send an e-mail through your own e-mail
                        client. Multiple recipients can be added, separate with comma.
                    </small>
                </p>
                <Form.Row className="ml-0 mr-0 mt-4">
                    <a href={mailTo}>
                        <Button
                            className="mr-2"
                            //type="submit"
                            variant="primary"
                            //onClick={() => console.log( "Mailing..." )}
                        >
                            <FontAwesomeIcon icon="envelope" className="mr-2" />
                            Send e-mail
                        </Button>
                    </a>

                    {shouldIncludeDownload && (
                        <ChequeDownloader cheque={json} filename={filename} />
                    )}
                </Form.Row>
            </Form>
        );
    }
}
