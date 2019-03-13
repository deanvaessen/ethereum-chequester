import { Col } from "react-bootstrap";
import PropTypes from "prop-types";
import Page from "../../components/Page";
import AlertMessage from "../../components/AlertMessage";
import MyChequeBooks from "../../components/MyChequeBooks";

export default class Dashboard extends React.PureComponent {
    static propTypes = {
        ethereumInterface : PropTypes.object.isRequired,
        etherscanError : PropTypes.string,
        activeChequeBook : PropTypes.string,
        currentEthereumAddress : PropTypes.string,
        currentChequeBooks : PropTypes.array,
        getCurrentChequeBooks : PropTypes.func.isRequired,
        selectChequeBook : PropTypes.func.isRequired,
        entranceAnimation : PropTypes.string
    };

    render() {
        const {
            selectChequeBook,
            currentChequeBooks,
            activeChequeBook,
            currentEthereumAddress,
            getCurrentChequeBooks,
            ethereumInterface,
            etherscanError
        } = this.props;

        return (
            <Page pageHeader="Dashboard" pageIcon="user-astronaut">
                <h2 className="mt-2 mb-2">Dashboard</h2>

                <Col sm="12" className="ml-0 mr-0 p-0">
                    <MyChequeBooks
                        currentChequeBooks={currentChequeBooks}
                        activeChequeBook={activeChequeBook}
                        ethereumInterface={ethereumInterface}
                        currentEthereumAddress={currentEthereumAddress}
                        etherscanError={etherscanError}
                        selectChequeBook={selectChequeBook}
                        getCurrentChequeBooks={getCurrentChequeBooks}
                    />
                </Col>
            </Page>
        );
    }
}
