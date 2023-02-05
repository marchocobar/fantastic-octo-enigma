import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Modal, Tab } from 'react-bootstrap';
import SignUpForm from './SignupForm';
import LoginForm from './LoginForm';

import Auth from '../utils/auth';

const AppNavbar = () => {
  // set modal display state
  //const [showModal, setShowModal] = useState(false);
  const formModals = () => {
    const [modalState, setModalState] = useState< "login-modal" | "signup-modal" | "close" >("close")
    
    const showLoginModal = () => {
     setModalState("login-modal")
    }
    
    const showSignupModal = () => {
     setModalState("signup-modal")
    }
    
    // const handleClose = () => {
    //  setModalState("close")
    // }
  return (
    <>
      <Navbar expand='lg'>
        <Container fluid>
          <Navbar.Brand as={Link} to='/'>
            LOGO
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='navbar' />
          <Navbar.Collapse id='navbar'>
            <Nav className='ml-auto'>
              <Nav.Link as={Link} to='/'>
              <h3>NYT Best Sellers</h3>
              </Nav.Link>
              {/* if user is logged in show saved books and logout */}
              {Auth.loggedIn() ? (
                <>
                  <Nav.Link as={Link} to='/saved'>
                    My Bookshelf
                  </Nav.Link>
                  <Nav.Link onClick={Auth.logout}>Logout</Nav.Link>
                </>
              ) : (
                <Nav.Link onClick={() => showLoginModal(true)}>Login</Nav.Link>
                
              ) }
                <Nav.Link onClick={() => showSignupModal(true)}>Sign Up</Nav.Link>
              
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* set modal data up */}
      <Modal show={modalState === "login-modal"}>
       <Modal.Body>This is LOGIN Modal</Modal.Body>
         <Modal.Footer>
         </Modal.Footer>
        </Modal>
      <Modal show={modalState === "signup-modal"}>
        <Modal.Body>This is SIGNUP Modal</Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
   </Modal>
      
      {/* <Modal
        size='lg'
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby='signup-modal'> */}
        {/* tab container to do either signup or login component */}
        {/* <Tab.Container defaultActiveKey='login'>
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
        </Tab.Container> */}
      {/* </Modal> */}
    </>
  );
};
};
export default AppNavbar;
