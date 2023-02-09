import React, { useState, useEffect } from "react";
import { Modal, Container, Col, Button, Card, Row } from "react-bootstrap";

import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { SAVE_BOOK } from "../utils/mutations";
import Auth from "../utils/auth";
import { useMutation } from "@apollo/client";

import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { faSquareCheck } from "@fortawesome/free-solid-svg-icons";
const info = <FontAwesomeIcon icon={faCircleInfo} size="2xl" color="" />;
const addIcon = <FontAwesomeIcon icon={faSquarePlus} size='2xl'/>;
const savedIcon = <FontAwesomeIcon icon={faSquareCheck} size='2xl'/>
const apiKey = "odAC47mAXREvZ3HvHdv5XieoP4WcAzVm";

const BestSellers = () => {
  const [savedBookIds, setSavedBookIds] = useState([]);

  const [saveBook, { error }] = useMutation(SAVE_BOOK);


  const [lists, setLists] = useState([]);
  const [show, setShow] = useState(undefined);

  const handleClose = () => setShow(false);
  const handleShow = (id) => setShow(id);
  //   const [books, setListBooks] = useState([])
  
  useEffect(() => {
    const fetchBooks = async () => {
      const res = await axios.get(
        `https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=${apiKey}`
      );
      const bookData = lists.map((books) =>({
      bookId:books.books[0].primary_isbn10 
    }));
      setLists(res.data.results.lists, bookData);
      
      //   setListBooks(res.data.results.lists.books)
      console.log(res.data.results.lists, bookData);
      
    };

    fetchBooks();
  }, []);

  const handleSaveBook = async (bookId) => {
     
    const bookToSave = lists.find((books) => books.bookId===bookId);
  
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
      <h1 className="m-4" style={{ fontWeight: "bold" }}>
        {" "}
        The New York Times Best Sellers
      </h1>
      <Container className="mb-4">
        <Row style={{justifyContent:"center"}}>
          {lists.map((list) => {
            const { list_name, list_id, books } = list;
            return (
              <>
                <h2 key={list_id} className="list-headers">
                  {list_name}
                </h2>
                {books.map((book) => {
                  const { book_image, author, title, description, primary_isbn10 } = book;
    
                  return (
                    <Col
                      className="col-md-2 d-flex pt-4"
                      style={{
                        alignItems: "stretch",
                        justifyContent: "center",
                      }}
                    >
                      <Card style={{ width: "18rem" }}>
                        <Card.Img src={book_image} height={"300rem"} />
                        <Card.Body>
                          <Card.Title style={{ fontWeight: "bold" }}>
                            {title}
                          </Card.Title>
                          <p>{author}</p>
                        </Card.Body>
                        <Card.Footer
                          style={{ backgroundColor: "white", border: "none" }}
                        >
                          <Button
                            variant=""
                            onClick={() => handleShow(book.description)}
                            style={{
                              backgroundColor: "white",
                              alignSelf: "end",
                            }}
                          >
                            {info}
                          </Button>

                    
                          <Modal
                            scrollable
                            size="xl"
                            show={show === book.description}
                            onHide={handleClose}
                            key={book.description}
                          >
                            <Modal.Header closeButton>
                              <Modal.Title>Description</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>{description}</Modal.Body>
                            <Modal.Footer>
                              <Button variant="secondary" onClick={handleClose}>
                                Close
                              </Button>

                              
                            </Modal.Footer>
                          </Modal>
                          {Auth.loggedIn() && (
                    <Button
                      disabled={savedBookIds?.some(
                        (savedId) => savedId === books.bookId
                      )}
                      className="btn-light"
                      style={{backgroundColor:'white'}}
                      onClick={() => handleSaveBook(books.bookId)}
                    >
                      {savedBookIds?.some((savedId) => savedId === books.bookId)
                        ? savedIcon
                        : addIcon}
                    </Button>
                  )}
                        </Card.Footer>
                      </Card>
                    </Col>
                  );
                })}
              </>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default BestSellers;

