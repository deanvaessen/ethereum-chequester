import { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import "./Page.scss";

export default class Page extends React.PureComponent {
    static propTypes = {
        children : PropTypes.oneOfType( [ PropTypes.array, PropTypes.object ] ).isRequired,
        columns : PropTypes.string.isRequired,
        pageHeader : PropTypes.string,
        pageIcon : PropTypes.string,
        entranceAnimation : PropTypes.string
    };

    getClasses = () => {
        const { entranceAnimation, columns } = this.props;
        //const baseClass = "mb-5 mt-4 col-md-10 col-12 p-sm-5 mx-auto page animated";
        const baseClass = "mb-5 mt-4 p-sm-5 p-2 mx-auto page animated";

        return `${columns} ${baseClass} ${entranceAnimation || ""}`;
    };

    header = () => {
        const { pageHeader, pageIcon } = this.props;

        return (
            <Fragment>
                {pageHeader && (
                    <div className="mt-2 mb-5 flex-centre" style={{ fontSize : "55px" }}>
                        {/*&<div style={{ backgroundColor : "black", height : "10px", width : "5%" }} />*/}
                        <FontAwesomeIcon icon={pageIcon} className="ml-2 mr-2" />
                        {/*&<div style={{ backgroundColor : "black", height : "10px", width : "5%" }} />*/}
                        {/*pageHeader*/}
                    </div>
                )}
            </Fragment>
        );
    };

    render() {
        return (
            <div className={this.getClasses()}>
                {/*this.header()*/}
                {this.props.children}
            </div>
        );
    }
}
