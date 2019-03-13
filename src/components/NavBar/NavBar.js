import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./NavBar.scss";

export default class NavBar extends React.PureComponent {
    static propTypes = {
        pages : PropTypes.array.isRequired,
        shouldRenderSplash : PropTypes.bool.isRequired,
        currentEthereumAddress : PropTypes.string,
        currentPage : PropTypes.string.isRequired,
        history : PropTypes.object.isRequired
    };

    render() {
        const {
            pages,
            history,
            shouldRenderSplash,
            currentEthereumAddress,
            currentPage
        } = this.props;

        return (
            <Navbar
                className="mb-5"
                bg="light"
                expand="lg"
                style={{ padding : 0, paddingLeft : "1%", paddingRight : "1%" }}
            >
                <Navbar.Brand
                    href="#"
                    style={{ height : "60px", display : "flex", alignItems : "center" }}
                >
                    <FontAwesomeIcon icon={[ "fab", "ethereum" ]} className="ml-4 mr-4" />
                    Chequester
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse
                    className="h-100"
                    style={{ marginLeft : "3%", alignItems : "end" }}
                    id="basic-navbar-nav"
                >
                    <Nav className="mr-auto" style={{ paddingTop : "10px" }}>
                        {pages.map( page => {
                            if ( shouldRenderSplash ) return;

                            const { label, path } = page;
                            const isActive = currentPage == path;

                            return (
                                <Link
                                    className="h-100 ml-2 mr-2 nav-link"
                                    to={path}
                                    style={{
                                        color : isActive ? "black" : "",
                                        paddingBottom : "12px",
                                        borderBottom : isActive ? "4px solid black" : ""
                                    }}
                                    key={path}
                                >
                                    {label}
                                </Link>
                            );
                        } )}
                    </Nav>
                    <Nav
                        className="mx-auto h-100"
                        style={{ paddingTop : "10px", alignItems : "center" }}
                    >
                        <p className="m-0 nav-link" style={{ padding : 0, paddingBottom : "11px" }}>
                            <FontAwesomeIcon
                                icon={currentEthereumAddress ? "user-astronaut" : "sign-in-alt"}
                                className="mr-2"
                            />
                            {currentEthereumAddress || "Not logged in."}
                        </p>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}
