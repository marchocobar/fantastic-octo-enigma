import React, { useState, useEffect } from "react";

import { useMutation } from "@apollo/client";

import axios from 'axios';

const apiKey = 'odAC47mAXREvZ3HvHdv5XieoP4WcAzVm'

const BestSellers = () => {
    const [books, setBooks] = useState([]);

    useEffect(()=> {
        const fetchBooks = async () => {
            const res = await axios.get(`https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=${apiKey}`)
            setBooks(res.data.results.books)
            console.log(res.data.results.books)
        }
        fetchBooks()
    }, []);
    
    return (
        <>
            <h1>Bestsellers</h1>
            <section>
                {books.map((book)=>{
                    const {author, 
                        book_image, 
                        description, 
                        title} = book

                    return (
                        <article>
                            <div>
                                <img src={book_image}></img>
                            </div>
                            <div>
                                <h3>{title}</h3>
                            </div>
                        </article>
                    )
                })}
            </section>
        </>
    )
}

    

export default BestSellers
  