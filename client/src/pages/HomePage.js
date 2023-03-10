import React, { useState, useEffect } from "react";
import {
  Modal,
  Container,
  Col,
  Form,
  Button,
  Card,
  InputGroup,
  Row
} from "react-bootstrap";

import image from "../assets/image/Backimage2.png"
import NoCover from "../assets/image/NoCoverAvailable.png"


import { useMutation } from "@apollo/client";
import { SAVE_BOOK } from "../utils/mutations";

import Auth from "../utils/auth";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { faSquareCheck } from "@fortawesome/free-solid-svg-icons";

const element = <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" />;
const info = <FontAwesomeIcon icon={faCircleInfo} size="2xl" color=""/>;
const addIcon = <FontAwesomeIcon icon={faSquarePlus} size='2xl'/>;
const savedIcon = <FontAwesomeIcon icon={faSquareCheck} size='2xl'/>


const SearchBooks = () => {
  const [show, setShow] = useState(undefined);

  const handleClose = () => setShow(false);
  const handleShow = (id) => setShow(id);

  const [searchedBooks, setSearchedBooks] = useState([]);

  const [searchInput, setSearchInput] = useState("");

 
  const [savedBookIds, setSavedBookIds] = useState([]);

  const [saveBook, { error }] = useMutation(SAVE_BOOK);


  
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${searchInput}&maxResults=40`
      );

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      const { items } = await response.json();
      console.log(items)
      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ["No author to display"],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || "",
      }));
      
      setSearchedBooks(bookData);
      setSearchInput("");
    } catch (err) {
      console.error(err);
    }
  };

 
  const handleSaveBook = async (bookId) => {
 
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

  
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await saveBook({
        variables: { bookData: { ...bookToSave } },
      });
      console.log(savedBookIds);
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <Container fluid className="pt-4" style={{backgroundImage: `url(${image})`, 
      backgroundSize: 'contain', backgroundRepeat:'no-repeat', height:'50vh', backgroundPosition:'center'}}>

      </Container>
      <Container fluid >
        <Form onSubmit={handleFormSubmit}>
          <Row className="justify-content-md-center">
            <Col className="col-md-6 mb-4 mt-2">
              <InputGroup  >
                <Form.Control
                  // className="rounded-pill p-3"
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  
                />
                <Button  type="submit" variant="light" style={{backgroundColor:'white'}}>
                  {element}
                </Button>
              </InputGroup>
           </Col>
          </Row>
        </Form>
      </Container>
  

      <Container fluid className="mb-4" >
        <Row>
        
          {searchedBooks.map((book) => {
            return (
              <Col className="col-md-3 d-flex pt-4" style={{alignItems: 'stretch', justifyContent:'center'}}>
              <Card key={book.bookId}  style={{backgroundColor: 'white', border: 'none', width:'18rem'}}>
                {book.image ? (
                  <Card.Img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant="top"
                    height={'400rem'}
                  />
                ) : <img src={NoCover} height={'400rem'}></img>}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors}</p>
                  
                  
                </Card.Body>
                <Card.Footer style={{backgroundColor:'white', border:'none'}}>
                  <Button variant="" onClick={()=>handleShow(book.bookId)} style={{backgroundColor:'white'}}  >
                    {info}
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

                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedBookIds?.some(
                        (savedId) => savedId === book.bookId
                      )}
                      className="btn-light"
                      style={{backgroundColor:'white'}}
                      onClick={() => handleSaveBook(book.bookId)}
                    >
                      {savedBookIds?.some((savedId) => savedId === book.bookId)
                        ? savedIcon
                        : addIcon}
                    </Button>
                  )}
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

export default SearchBooks;

