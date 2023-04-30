import React, { useState, useEffect } from "react";
import { Modal, Container, Col, Button, Card, Row } from "react-bootstrap";

import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { useMutation } from "@apollo/client";
import { SAVE_BOOK } from "../utils/mutations";
import Auth from "../utils/auth";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { faSquareCheck } from "@fortawesome/free-solid-svg-icons";

const info = <FontAwesomeIcon icon={faCircleInfo} size="2xl" color="" />;
const apiKey = "odAC47mAXREvZ3HvHdv5XieoP4WcAzVm";
const addIcon = <FontAwesomeIcon icon={faSquarePlus} size='2xl'/>;
const savedIcon = <FontAwesomeIcon icon={faSquareCheck} size='2xl'/>

const BestSellers = () => {
  const [saveBook, { error }] = useMutation(SAVE_BOOK);
  const [savedBookIds, setSavedBookIds] = useState([]);
  const [lists, setLists] = useState([]);
  const [show, setShow] = useState(undefined);

  const handleClose = () => setShow(false);
  const handleShow = (id) => setShow(id);
  // const [books, setListBooks] = useState([])

  useEffect(() => {
    const fetchBooks = async () => {
      const res = await axios.get(
        `https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=${apiKey}`
      );
      
      setLists(res.data.results.lists);
      console.log(res.data.results.lists);
    };

    fetchBooks();
  }, []);

  // const handleSaveBook = async(bookId) => {
  //   const token = Auth.loggedIn() ? Auth.getToken() : null;
  //   // const bookData = lists.map((books) => ({
  //   //   bookId: books.books[0].primary_isbn10
  //   // }));
  //   if (!token) {
  //     return false;
  //   }

  //   try {
    
  //   axios
  //     .post(
  //       `https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=${apiKey}`,
  //       {bookId: lists.books.books[0].primary_isbn10}
  //     )
  //     .then((response) => {
  //       console.log(response.data);
  //       const { data } =  saveBook({
  //         variables: { bookData: { ...bookId } },
  //       });
  //       console.log(savedBookIds);
  //     setSavedBookIds([...savedBookIds, bookId]);
  //     });
  //   }catch (err) {
  //     console.error(err);
  //   }
  // };

  const handleSaveBook = async (bookData) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
  
    if (!token) {
      return false;
    }
  
    try {
      const response = await axios.post('http://localhost:3001/api/saved', {
        operationName: 'saveBook',
       query: `
        mutation saveBook($bookData: BookInput!) {
          saveBook(bookData: $bookData) {
            _id
            email
            savedBooks {
              bookId
              authors
              image
              description
              title
              link
            }
          }
        }
      `,
        variables: { bookData },
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
  
      console.log(response.data);
      setSavedBookIds([...savedBookIds, bookData.savedBooks[0].bookId]);
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
        <Row style={{ justifyContent: "center" }}>
          {lists.map((list) => {
            const { list_name, list_id, books } = list;
            return (
              <>
                <h2 key={list_id} className="list-headers">
                  {list_name}
                </h2>
                {books.map((book) => {
                  const { book_image, author, title, description } = book;

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
                                (savedId) => savedId === book.bookId
                              )}
                              className="btn-light"
                              style={{ backgroundColor: "white" }}
                              onClick={() => handleSaveBook(book.bookId)}
                            >
                              {savedBookIds?.some(
                                (savedId) => savedId === book.bookId
                              )
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
