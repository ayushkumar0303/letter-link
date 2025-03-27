import { Button, Card, Modal, Spinner, Table } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import parse from "html-react-parser";
import { Link } from "react-router-dom";

function Drafts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userLetters, setUserLetters] = useState([]);
  const [lettersLoading, setLettersLoading] = useState(false);
  const [seeMore, setSeeMore] = useState(true);

  // console.log(currentUser);
  useEffect(() => {
    const getLetters = async () => {
      try {
        setLettersLoading(true);
        const res = await fetch(
          `/server/letter/get-letters/${currentUser._id}`
        );
        // console.log(res);
        const data = await res.json();
        // console.log(data.letters);
        if (res.ok) {
          setUserLetters(data.letters);
          // console.log(data.letters.length);
          if (data.letters.length < 9) {
            setSeeMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
      setLettersLoading(false);
    };

    if (currentUser) {
      getLetters();
    }
  }, [currentUser._id]);

  // console.log(letters);

  const handleSeeMore = async () => {
    const startIndex = userLetters.length;
    console.log(startIndex);
    try {
      const res = await fetch(
        `/server/letter/get-letters/${currentUser._id}?startIndex=${startIndex}`
      );

      const data = await res.json();
      // console.log(data);

      if (res.ok) {
        setUserLetters((prev) => [...prev, ...data.letters]);
        if (data.letters.length < 9) {
          setSeeMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  // console.log(letterId.current);
  const handleDeleteletter = async (letterId) => {
    try {
      const res = await fetch(
        `/server/letter/delete-letter/${letterId}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      // console.log(data);
      // console.log(userLetters);
      if (res.ok) {
        setUserLetters((prev) =>
          prev.filter((letter) => letter._id !== letterId)
        );
        // console.log(userLetters);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  if (lettersLoading) {
    return (
      <p className="text-center p-6">
        <Spinner color="success" aria-label="Success spinner example" />
      </p>
    );
  }
  return (
    <div className="p-6">
      <h1 className="text-center font-bold text-4xl ">Draft Letters</h1>
      <div className="overflow-x-auto rounded-lg shadow-lg p-6 m-6 bg-white">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Letter Title</Table.HeadCell>
            <Table.HeadCell>Letter content</Table.HeadCell>

            <Table.HeadCell>Delete</Table.HeadCell>
            <Table.HeadCell>
              <span>Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {userLetters.length > 0 ? (
              userLetters.map((letter) => (
                <Table.Row key={letter._id} className="bg-white">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 ">
                    {new Date(letter.updatedAt).toLocaleDateString()}
                  </Table.Cell>

                  <Table.Cell>{letter.title}</Table.Cell>
                  <Table.Cell className="max-w-lg">
                    <span className="line-clamp-2">
                      {parse(letter.content)}
                    </span>
                  </Table.Cell>

                  {/* letter Preview */}

                  {/* Approve and Reject Links */}
                  <Table.Cell>
                    <span
                      onClick={() => {
                        handleDeleteletter(letter._id);
                      }}
                      className="text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/dashboard/update-letter/${letter._id}`}>
                      <span className="text-teal-500 hover:underline">
                        Edit
                      </span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell
                  colSpan="7"
                  className="text-center text-gray-500 py-4"
                >
                  No letters for Review
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
      {seeMore && (
        <p
          className="text-center text-green-500 cursor-pointer "
          onClick={handleSeeMore}
        >
          See more
        </p>
      )}
    </div>
  );
}

export default Drafts;
