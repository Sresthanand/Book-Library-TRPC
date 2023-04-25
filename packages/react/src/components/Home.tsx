import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

import trpc from "../utils/trpc";

const Home: React.FC = () => {
  // const [books, setBooks] = useState([]);

  const books = trpc.getBooks.useQuery().data?.books ?? [];

  console.log(books);

  return (
    <div>
      <Navbar />

      <div className="container mx-auto mt-8">
        <div className="flex items-center">
          <div>
            <FontAwesomeIcon
              icon={faBook}
              className="text-blue-800 w-14 h-14"
            />
          </div>
          <h1 className="text-2xl font-bold text-blue-800">My Books</h1>
        </div>

        <div className="flex flex-wrap mx-4 mt-8">
          {books ? (
            books.map((book) => (
              <div
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 px-4"
                key={book.id}
              >
                <Link to={`/about/${book.id}`}>
                  <div className="rounded-md shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
                      alt="Book Cover"
                      className="object-cover mb-4"
                    />
                  </div>
                  <h2 className="text-lg font-bold italic mb-2">{book.name}</h2>
                  <p className="text-sm text-gray-600">{book.author}</p>
                </Link>
              </div>
            ))
          ) : (
            <div>Loading...</div>
          )}

          <div
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 px-4 border-dotted border-2 border-blue-500 text-center"
            style={{ borderRadius: "10px", height: "260px" }}
          >
            <div className="flex flex-col justify-center items-center h-full">
              <div>
                <Link to="/addbook">
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="text-blue-500 text-4xl"
                  />
                </Link>
              </div>
              <p className="mt-4 text-lg font-bold underline">Add a book</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
