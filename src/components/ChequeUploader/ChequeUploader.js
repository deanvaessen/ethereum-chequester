import PropTypes from "prop-types";
import { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Button } from "react-bootstrap";
import ReactDropzone from "react-dropzone";
import AlertMessage from "../AlertMessage";
import "./ChequeUploader.scss";

export default class ChequeUploader extends React.PureComponent {
    static propTypes = {
        note : PropTypes.object.isRequired,
        ethereumInterface : PropTypes.object.isRequired,
        onDropAttempt : PropTypes.func.isRequired,
        onDropSuccess : PropTypes.func.isRequired,
        onDropFailure : PropTypes.func.isRequired,
        files : PropTypes.array.isRequired,
        fileError : PropTypes.string
    };

    onDrop = ( acceptedFiles, rejectedFiles ) => {
        const { ethereumInterface, onDropSuccess, onDropFailure, onDropAttempt } = this.props;

        // First reset, then judge result.
        onDropAttempt( () => {
            if ( rejectedFiles.length > 0 ) {
                () => onDropFailure( "Incorrect file" );
            } else {
                const file = acceptedFiles[0];
                const reader = new FileReader();

                reader.onload = () => {
                    const cheque = JSON.parse( reader.result );

                    if ( ethereumInterface.chequeIsValid( cheque ) ) {
                        onDropSuccess( acceptedFiles, cheque );
                    } else {
                        onDropFailure( "This is not a valid cheque" );
                    }
                };
                reader.onabort = () => this.setState( { fileError : "File reader aborted" } );
                reader.onerror = () => this.setState( { fileError : "File reader errored" } );

                reader.readAsBinaryString( file );
            }
        } );
    };

    render() {
        const { files, note, fileError } = this.props;

        const previewStyle = {
            display : "inline",
            height : "100%"
            //width : 100,
            //height : 100
        };

        return (
            <Fragment>
                <ReactDropzone
                    accept="application/json"
                    className="chequeUploader row align-items-center mb-1 ml-0 mr-0"
                    multiple={false}
                    disabled={files.length > 0}
                    onDrop={this.onDrop}
                >
                    <FontAwesomeIcon
                        icon="file-contract"
                        size="6x"
                        style={{
                            position : "absolute",
                            height : "50%",
                            width : "50%",
                            top : "25%",
                            bottom : "25%",
                            left : "25%",
                            right : "25%",
                            opacity : 0.4
                        }}
                    />

                    {do {
                        const { files } = this.props;

                        if ( files.length > 0 ) {
                            <div className="mx-auto">
                                <Alert variant="info">
                                    <FontAwesomeIcon icon="check-circle" className="mr-2" />
                                    Added cheques: <strong>{files.length}/1</strong>
                                </Alert>
                            </div>;
                        } else {
                            <div className="mx-auto" style={{ zIndex : 2, marginBottom : "5px" }}>
                                <Button variant="primary">
                                    <FontAwesomeIcon icon="plus-circle" className="mr-2" />
                                    Drag or click
                                </Button>
                            </div>;
                        }
                    }}
                </ReactDropzone>

                {/*<small>This component supports multiple files. </small>*/}

                {note}

                {!fileError && files.length > 0 && (
                    <div className="alert-spacer">
                        <AlertMessage
                            style={{ width : "100%" }}
                            intro="All good!"
                            message="Cheque read, good to go."
                            icon="check-circle"
                            variant="success"
                            dismissible={true}
                        />
                    </div>
                )}

                {fileError && (
                    <div className="alert-spacer">
                        <AlertMessage
                            style={{ width : "100%" }}
                            intro="Oh no!"
                            message={fileError}
                            icon="bug"
                            variant="danger"
                            dismissible={true}
                            instruction="Please try again."
                        />
                    </div>
                )}
            </Fragment>
        );
    }
}
