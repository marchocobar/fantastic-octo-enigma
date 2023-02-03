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

import { useMutation } from "@apollo/client";

import axios from "axios";
import { CardBody } from "react-bootstrap/Card";

const apiKey = "odAC47mAXREvZ3HvHdv5XieoP4WcAzVm";

const BestSellers = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const res = await axios.get(
        `https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=${apiKey}`
      );
      setBooks(res.data.results.books);
      console.log(res.data.results.books);
    };
    fetchBooks();
  }, []);

  return (
    <>
      <h1>Bestsellers</h1>
      <CardColumns className="m-4">
        {books.map((book) => {
          const { author, book_image, description, title, book_image_height, book_image_width } = book;

          return (
            <Card>
              <Card.Img src={book_image}/>
              <Card.Body>
                <Card.Title>{title} by {author}</Card.Title>
              </Card.Body>
            </Card>
          );
        })}
      </CardColumns>
    </>
  );
};

export default BestSellers;