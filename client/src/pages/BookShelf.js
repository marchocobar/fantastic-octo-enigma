import React, {useState} from 'react';
import {
  Jumbotron,
  Container,
  Col,
  Card,
  Button,
  Row,
  Modal
} from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import NoCover from "../assets/image/NoCoverAvailable.png"

import Auth from '../utils/auth';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const deleteicon = <FontAwesomeIcon icon={faTrash} size="xl" color="" />;
const info = <FontAwesomeIcon icon={faCircleInfo} size="2xl" color=""/>;
const SavedBooks = () => {
  const [show, setShow] = useState(undefined);

  const handleClose = () => setShow(false);
  const handleShow = (id) => setShow(id);
  const { loading, data } = useQuery(QUERY_ME);
  const [removeBook, { error }] = useMutation(REMOVE_BOOK);

  const userData = data?.me || {};

  
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await removeBook({
        variables: { bookId },
      });

    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      
        <Container fluid>
          <h1 ></h1>
        </Container>
      
      <Container>
        <Row>
          {userData.savedBooks?.map((book) => {
            return (
              <Col className="col-sm-2 d-flex pt-4" style={{alignItems: 'stretch', justifyContent:'center'}}>
              <Card key={book.bookId} style={{ backgroundColor: 'white', border: 'none', width:'18rem'}} id="bookshelf">
                {book.image ? (
                  <Card.Img
                    src={book.image}
                    height={"300rem"}
                    alt={`The cover for ${book.title}`}
                  />
                ) : <img src={NoCover} height={'300rem'}></img>}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <Card.Text className="small">Authors: {book.authors}</Card.Text>

                  
                </Card.Body>
                <Card.Footer>
                  <Button variant="" onClick={()=>handleShow(book.bookId)} style={{backgroundColor:'white'}}  >
                    {info}
                  </Button>
                  <Button style={{backgroundColor:'black'}} onClick={() => handleDeleteBook(book.bookId)}>  
                    {deleteicon}
                  </Button>
                  <Modal scrollable size="xl" show={show===book.bookId} onHide={handleClose} key={book.bookId}>
                    <Modal.Header closeButton>
                      <Modal.Title>Description</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      {book.description}
                      </Modal.Body>
                    <Modal.Footer >
                      <Button variant="secondary" onClick={handleClose}>
                        Close
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </Card.Footer>
              </Card>
              </Col>
            );
          })}
          </Row>
       
      </Container>
    </>
  );
};

export default SavedBooks;
