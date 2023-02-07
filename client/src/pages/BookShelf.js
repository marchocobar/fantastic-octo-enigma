import React from 'react';
import {
  Jumbotron,
  Container,
  CardColumns,
  Card,
  Button,
  Row
} from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import { removeBookId } from '../utils/localStorage';

import Auth from '../utils/auth';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const deleteicon = <FontAwesomeIcon icon={faTrash} size="2xl" color="" />;

const SavedBooks = () => {
  const { loading, data } = useQuery(QUERY_ME);
  const [removeBook, { error }] = useMutation(REMOVE_BOOK);

  const userData = data?.me || {};

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await removeBook({
        variables: { bookId },
      });

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid>
        <Container>
          <h1 class="bookShelfHead">Your Bookshelf..</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks?.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'Add to your shelf!'}
        </h2>
        <CardColumns className='"col-md-2 d-flex pt-4"'>
        <Row xs={1} md={2} className="g-4">
          {userData.savedBooks?.map((book) => {
            return (
              <Card key={book.bookId} border="dark" style={{ width: '18rem', height:'30rem', margin:'1.5rem'}} id="bookshelf">
                {book.image ? (
                  <Card.Img
                    src={book.image}
                    height={"300rem"}
                    alt={`The cover for ${book.title}`}
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <Card.Text className="small">Authors: {book.authors}</Card.Text>

                  <Button
                    class="fa fa-trash"
                    onClick={() => handleDeleteBook(book.bookId)}
                  >
                    {deleteicon}
                  </Button>














                </Card.Body>
              </Card>
            );
          })}
          </Row>
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
