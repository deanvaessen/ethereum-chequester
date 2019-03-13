import PropTypes from "prop-types";
import ModelViewer from "metamask-logo";
import "./MetaMaskFox.scss";

export default class MetaMaskFox extends React.PureComponent {
    static propTypes = {
        entranceAnimation : PropTypes.string
    };

    componentDidMount() {
        // To render with fixed dimensions:
        const viewer = ModelViewer( {
            // Dictates whether width & height are px or multiplied
            pxNotRatio : true,
            width : 250,
            height : 250,

            // pxNotRatio: false,
            // width: 0.9,
            // height: 0.9,

            // To make the face follow the mouse.
            followMouse : true,

            // head should slowly drift (overrides lookAt)
            slowDrift : false
        } );

        // add viewer to DOM
        const container = document.getElementById( "metamask-logo-container" );
        container.appendChild( viewer.container );

        // look at something on the page
        viewer.lookAt( {
            x : 100,
            y : 100
        } );

        // enable mouse follow
        viewer.setFollowMouse( true );

        // deallocate nicely
        viewer.stopAnimation();
    }

    getClasses = () => {
        const { entranceAnimation } = this.props;
        const baseClass = "mb-5 mt-5 col-10 mx-auto animated";

        return `${baseClass} ${entranceAnimation}`;
    };

    render() {
        return (
            <div className={this.getClasses()} className="metamask-component">
                <div id="metamask-logo-container">
                    <div className="metamask-shadow metamask-shadow-foreground" />
                    <div className="metamask-shadow metamask-shadow-background" />
                    <div className="metamask-shadow metamask-shadow-background" />
                </div>
            </div>
        );
    }
}
