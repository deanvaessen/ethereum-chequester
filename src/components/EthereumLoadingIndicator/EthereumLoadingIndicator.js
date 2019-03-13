import PropTypes from "prop-types";
import ethereumIcon from "./assets/ethereum_icon_black_medium.png";

export default class EthereumLoadingIndicator extends React.PureComponent {
    static propTypes = {
        shouldExit : PropTypes.bool,
        message : PropTypes.string
    };

    getImageClasses = () => {
        const { shouldExit } = this.props;

        return `mx-auto delay-05s animated ${shouldExit ? "fadeOutDown" : "fadeInUp"}`;
    };

    render() {
        return (
            <div className="row animated slower infinite pulse delay-05s">
                <img
                    className={this.getImageClasses()}
                    style={{ height : "40%", width : "40%" }}
                    src={ethereumIcon}
                />
            </div>
        );
    }
}
