import React, { useState, useEffect } from "react";
import {
  Modal,
  Container,
  Col,
  Form,
  Button,
  Card,
  CardColumns,
  InputGroup,
} from "react-bootstrap";

import image from "../assets/image/BackImage.png"

import { useMutation } from "@apollo/client";
import { SAVE_BOOK } from "../utils/mutations";
import { saveBookIds, getSavedBookIds } from "../utils/localStorage";

import Auth from "../utils/auth";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const element = <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" />;

const SearchBooks = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  // create state for holding returned google api data
  const [searchedBooks, setSearchedBooks] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState("");

  // create state to hold saved bookId values
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  const [saveBook, { error }] = useMutation(SAVE_BOOK);

  // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  });

  // create method to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${searchInput}`
      );

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      const { items } = await response.json();

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

  // create function to handle saving a book to our database
  const handleSaveBook = async (bookId) => {
    // find the book in `searchedBooks` state by the matching id
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

    // get token
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
      
      <Container fluid className="m-2" style={{backgroundImage: `url(${image})`, backgroundSize: 'contain', backgroundRepeat:'no-repeat', height:'70vh', backgroundPosition:'right'}} >
        <Form onSubmit={handleFormSubmit}>
          <Form.Row>
            
            <>
              <InputGroup className="col-md-6 m-5 mb-3 " >
                
                <Form.Control
                  className="rounded-pill p-3"
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a book"
                />
                <Button className="rounded-pill btn-light btn-search" type="submit">
                  {element}
                </Button>
              </InputGroup>
             </> 
           
          </Form.Row>
        </Form>
      </Container>
  

      <Container>
        <h2>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : ""}
        </h2>
        <CardColumns>
          {searchedBooks.map((book) => {
            return (
              <Card key={book.bookId} border="dark">
                {book.image ? (
                  <Card.Img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  
                  <Button variant="primary" onClick={handleShow}>
                    Read More
                  </Button>

                  <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Description</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{book.description}</Modal.Body>
                    <Modal.Footer>
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
                      className="btn-block btn-info"
                      onClick={() => handleSaveBook(book.bookId)}
                    >
                      {savedBookIds?.some((savedId) => savedId === book.bookId)
                        ? "Book Already Saved!"
                        : "Save This Book!"}
                    </Button>
                  )}
                </Card.Body>
              </Card>
              
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SearchBooks;
