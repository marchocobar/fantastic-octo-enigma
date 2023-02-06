import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Modal, Tab, NavDropdown } from 'react-bootstrap';
import SignUpForm from './SignupForm';
import LoginForm from './LoginForm';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import Auth from '../utils/auth';
import logo from '../assets/image/ShelfLifeLogo.png';

const user = <FontAwesomeIcon icon={faUser} size="xl" />
const userCircle = <FontAwesomeIcon icon={faUserCircle} size='lg'/>


const AppNavbar = () => {
  // set modal display state
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Navbar expand='lg'>
        <Container fluid>
          <Navbar.Brand as={Link} to='/' style={{height:''}}>
            <img src={logo} height='85px' width={''}></img>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='navbar' />
          <Navbar.Collapse id='navbar'>
            <Nav className='ml-auto'>
              <Nav.Link as={Link} to='/bestsellers'>
              <h3>NYT Best Sellers</h3>
              </Nav.Link>
              {/* if user is logged in show saved books and logout */}
              {Auth.loggedIn() ? (
                <>
                <NavDropdown title={user} style={{paddingRight:'80px', paddingTop:'7px'}}>
                <NavDropdown.Item as={Link} to='/saved'>My Bookshelf</NavDropdown.Item>
                <NavDropdown.Item onClick={Auth.logout}>Logout</NavDropdown.Item>
                </NavDropdown>
                </>
              ) : (
                <Nav.Link onClick={() => setShowModal(true)}>Login</Nav.Link>
              ) }
                <Nav.Link onClick={() => setShowModal(true)}>Sign Up</Nav.Link>
              
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* set modal data up */}
      <Modal
        size='lg'
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby='signup-modal'>
        {/* tab container to do either signup or login component */}
        <Tab.Container defaultActiveKey='login'>
          <Modal.Header closeButton>
            <Modal.Title id='signup-modal'>
              <Nav variant='pills'>
                <Nav.Item>
                  <Nav.Link eventKey='login'>Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey='signup'>Sign Up</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Content>
              <Tab.Pane eventKey='login'>
                <LoginForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
              <Tab.Pane eventKey='signup'>
                <SignUpForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
};

export default AppNavbar;
