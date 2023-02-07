import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Navbar,
  Nav,
  Container,
  Modal,
  Tab,
  NavDropdown,
} from "react-bootstrap";
import SignUpForm from "./SignupForm";
import LoginForm from "./LoginForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import Auth from "../utils/auth";
import logo from "../assets/image/ShelfLifeLogo.png";

const user = <FontAwesomeIcon icon={faUser} size="xl" />;

const AppNavbar = () => {

  const [showModal, setShowModal] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <>
      <Navbar expand="lg">
        <Container fluid>
          <Navbar.Brand as={Link} to="/" style={{ height: "" }}>
            <img src={logo} height="85px" width={""}></img>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar" />
          <Navbar.Collapse
            id="navbar"
            style={{ justifyContent: "end", paddingRight: "40px" }}
          >
            <Nav className="">
              <Nav.Link
                as={Link}
                to="/bestsellers"
                style={{ marginRight: "10px" }}
              >
                <h2 className="nav-header" style={{ fontWeight: "bold" }}>NY Times Bestsellers</h2>
              </Nav.Link>
              
              {Auth.loggedIn() ? (
                <>
                  <NavDropdown
                    title={user}
                    style={{ paddingRight: "70px", paddingTop: "7px" }}
                  >
                    <NavDropdown.Item as={Link} to="/saved">
                      <h5 style={{fontWeight:'bold'}}>My Bookshelf</h5>
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={Auth.logout}>
                      <h5 style={{fontWeight:'bold'}}>Logout</h5>
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <Nav.Link onClick={() => setShowModal(true)}>
                    <h2 className="nav-header" style={{fontWeight:'bold'}}>Login</h2>
                  </Nav.Link>
                  <Nav.Link onClick={() => setShowSignUp(true)}>
                    <h2 className="nav-header" style={{fontWeight:'bold'}}>Sign Up</h2>
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal
        size="lg"
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby="signup-modal"
      >
        <Modal.Header closeButton>
          <h1>Login</h1>
        </Modal.Header>
        <Modal.Body>
          <LoginForm handleModalClose={() => setShowModal(false)} />
        </Modal.Body>
      </Modal>

      <Modal
        size="lg"
        show={showSignUp}
        onHide={() => setShowSignUp(false)}
        aria-labelledby="signup-modal"
      >
        <Modal.Header closeButton>
          <h1>Sign Up</h1>
        </Modal.Header>
        <Modal.Body>
          <SignUpForm handleModalClose={() => setShowSignUp(false)} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AppNavbar;
