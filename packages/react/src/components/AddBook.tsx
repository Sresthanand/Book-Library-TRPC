import React, { useState } from "react";
import Navbar from "./Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

import trpc from "../utils/trpc";

import {
  faArrowLeft,
  faPlus,
  faUpload,
  faInfoCircle,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

const AddBook: React.FC = () => {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [readTime, setReadTime] = useState("");
  const [details, setBookDetails] = useState("");

  const [image, setImage] = useState("");
  const [pdf, setPdfFile] = useState("");

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const inputValue = event.target.value;
    setter(inputValue);
  };

  const handleFileChange = (e, setImage) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handlePdfChange = (e, setPdfFile) => {
    const file = e.target.files[0];
    setPdfFile(file);
  };

  const renderIcon = (fieldValue: string) => {
    if (fieldValue === "") {
      return (
        <FontAwesomeIcon
          icon={faInfoCircle}
          className="text-blue-800 text-lg ml-2"
        />
      );
    } else {
      return (
        <FontAwesomeIcon
          icon={faCheckCircle}
          className="text-green-500 text-lg ml-2"
        />
      );
    }
  };

  // const mutation = trpc.registerBook.useMutation();
  // const uploadMutation = trpc.upload.useMutation();
  // const handleAddBook = async () => {
  //   try {
  //     const formData = new FormData();

  //     formData.append("image", image);
  //     formData.append("pdf", pdf);

  //     console.log(formData);
  //     console.log(image);
  //     console.log(pdf);

  //     const uploadResult = await uploadMutation.mutateAsync(formData);

  //     if (uploadResult && uploadResult.data) {
  //       const { image: location1, pdf: location2 } = uploadResult.data;

  //       const bookData = {
  //         name,
  //         author,
  //         readTime,
  //         details,
  //         image: location1,
  //         pdf: location2,
  //       };

  //       const result = await mutation.mutateAsync(bookData);

  //       if (result && result.book) {
  //         console.log(result.book);
  //         alert("Book is added!");
  //       } else {
  //         alert("Error adding book!");
  //       }
  //     } else {
  //       alert("Error uploading image/pdf");
  //     }
  //   } catch (error) {
  //     console.log("Error: " + error);
  //     alert("Error adding book!");
  //   }
  // };

  const mutation = trpc.registerBook.useMutation();

  const handleAddBook = async () => {
    console.log("HI I AM handleBook func");
    try {
      console.log("heylomutate");

      const result = await mutation.mutateAsync({
        name,
        author,
        readTime,
        details,
      });

      console.log("HI I AM handleBook func2");

      if (result && result.book) {
        console.log(result.book);
        alert("Book is added!");
      } else {
        alert("Error adding book!");
      }
    } catch (error) {
      console.log("Error: " + error);
      alert("Error adding book!");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="mt-12 ml-12 flex justify-start items-center">
        <div className="border border-blue-800 text-blue-500 rounded-lg p-2 flex items-center">
          <Link to="/">
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="text-blue-800 text-lg mr-2"
            />
          </Link>

          <p className="text-blue-800 font-bold">Back To Home</p>
        </div>
      </div>

      <div className="mt-6 mx-12 flex justify-start items-start">
        <div
          className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 px-4 border-dotted border-2 border-blue-800 text-center"
          style={{ borderRadius: "10px", height: "400px", width: "600px" }}
        >
          <div className="flex flex-col justify-center items-center h-full">
            <label htmlFor="imageUpload">
              <div>
                <FontAwesomeIcon
                  icon={faPlus}
                  className="text-blue-800 text-4xl"
                />
              </div>
              <input
                type="file"
                id="imageUpload"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setImage)}
              />
            </label>

            <p className="mt-4 text-lg font-bold underline">Add a book Cover</p>
          </div>
        </div>
        <div className="ml-14 w-full">
          <div className="mb-4 flex items-start ">
            <div className="flex-grow">
              <p className="font-bold mb-2">
                Name of the Book<span className="text-red-500 ">*</span>
              </p>
              <input
                type="text"
                className="border border-gray-1200 border-solid rounded-lg p-2 w-full"
                placeholder="Enter the Published Name"
                style={{ borderWidth: "2px" }}
                value={name}
                onChange={(e) => handleInputChange(e, setName)}
              />
            </div>
            <div>{renderIcon(name)}</div>
          </div>

          <div className="flex flex-wrap -mx-4 mb-4">
            <div className="w-full md:w-1/2 px-4 mb-4 md:mb-0">
              <div className="mb-2">
                <p className="font-bold">
                  Author of the Book<span className="text-red-500">*</span>
                </p>
              </div>
              <input
                type="text"
                className="border border-gray-1200 border-solid rounded-lg p-2 w-full"
                placeholder="Add all the authors comma separated"
                style={{ borderWidth: "2px" }}
                value={author}
                onChange={(e) => handleInputChange(e, setAuthor)}
              />
            </div>
            <div className="w-full md:w-1/2 px-4 mb-4 md:mb-0">
              <div className="mb-2">
                <p className="font-bold">
                  Book Read Time<span className="text-red-500">*</span>
                </p>
              </div>
              <input
                type="text"
                className="border border-gray-1200 border-solid rounded-lg p-2 w-full"
                placeholder="Add time in mins"
                style={{ borderWidth: "2px" }}
                value={readTime}
                onChange={(e) => handleInputChange(e, setReadTime)}
              />
            </div>
          </div>

          <div className="mb-4 ">
            <p className="font-bold mb-2">
              Book Details<span className="text-red-500">*</span>
            </p>
            <textarea
              className="border border-gray-1200 border-solid rounded-lg p-2 w-full h-32"
              placeholder="Should not be more than 300 words"
              style={{ borderWidth: "2px" }}
              value={details}
              onChange={(e) => handleInputChange(e, setBookDetails)}
            />
          </div>

          <p className="font-bold mb-2">
            Upload PDF <span className="text-red-500">*</span>
          </p>

          <div
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 px-4 border-dotted border-2 border-gray-1200 text-center mb-4"
            style={{ borderRadius: "10px", height: "200px", width: "300px" }}
          >
            <div className="flex flex-col justify-center items-center h-full">
              <label htmlFor="pdfUpload">
                <div>
                  <FontAwesomeIcon
                    icon={faUpload}
                    className="text-blue-800 text-4xl"
                  />
                </div>
                <p className="mt-4 text-sm font-bold cursor-pointer">
                  <u className="text-blue-900">Browse</u> or drop a file here
                </p>
                <input
                  type="file"
                  id="pdfUpload"
                  className="hidden"
                  accept="application/pdf"
                  onChange={(e) => handlePdfChange(e, setPdfFile)}
                />
              </label>
              <p className="mt-4 text-sm text-gray-600">
                Supports: PDF; upto 10MB
              </p>
            </div>
          </div>

          <button
            className="bg-blue-900 text-white rounded-lg px-4 py-2"
            onClick={handleAddBook}
          >
            Add Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBook;
