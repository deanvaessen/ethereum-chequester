import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Row } from "react-bootstrap";

export default class FormSpacer extends React.PureComponent {
    render() {
        return (
            <Row className="mt-2 mb-2">
                <span className="mx-auto" style={{ opacity : 0.4 }}>
                    <FontAwesomeIcon size="xs" className="p-1" icon="circle" />
                    <FontAwesomeIcon size="xs" className="p-1" icon="circle" />
                    <FontAwesomeIcon size="xs" className="p-1" icon="circle" />
                </span>
            </Row>
        );
    }
}
