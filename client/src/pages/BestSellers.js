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
  Row,
} from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { CardBody } from "react-bootstrap/Card";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
const info = <FontAwesomeIcon icon={faCircleInfo} size="2xl" color="" />;

const apiKey = "odAC47mAXREvZ3HvHdv5XieoP4WcAzVm";

const BestSellers = () => {
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
      setLists(res.data.results.lists);
      //   setListBooks(res.data.results.lists.books)
      console.log(res.data.results.lists);
    };
    fetchBooks();
  }, []);

  return (
    <>
      <h1 className="m-4" style={{fontWeight:'bold'}}> The New York Times Best Sellers</h1>
      <Container className="mb-4">
        <Row>
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
                          <Card.Title style={{fontWeight:'bold'}}>{title}</Card.Title>
                          <p>{author}</p>
                          
                          
                        </Card.Body>
                        <Card.Footer style={{backgroundColor:'white', border:'none'}}>
                          <Button
                            variant=""   
                            onClick={() => handleShow(book.description)}
                            style={{ backgroundColor: "white", alignSelf:'end' }}
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


