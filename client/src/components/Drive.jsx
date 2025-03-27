import { Spinner, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Drive() {
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [userLetters, setUserLetters] = useState([]);
  const [error, setError] = useState("");
  const [seeMore, setSeeMore] = useState(true);
  useEffect(() => {
    const getLettersFromDrive = async () => {
      try {
        setLoading(true);

        // console.log("drive");
        const res = await fetch(
          `/server/drive/get-letters/${currentUser?._id}`
        );
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
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getLettersFromDrive();
  }, [currentUser?._id]);

  const handleSeeMore = async () => {
    const startIndex = userLetters.length;
    // console.log(startIndex);
    try {
      const res = await fetch(
        `/server/drive/get-letters/${currentUser._id}?startIndex=${startIndex}`
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
  if (loading) {
    return (
      <p className="text-center p-6">
        <Spinner color="success" aria-label="Success spinner example" />
      </p>
    );
  }
  return (
    <div className="p-6">
      <h1 className="text-center font-bold text-4xl ">Drive Letters</h1>
      <div className="overflow-x-auto rounded-lg shadow-lg p-6 m-6 bg-white">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Docs Name</Table.HeadCell>
            <Table.HeadCell>Docs Link</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {userLetters.length > 0 ? (
              userLetters.map((letter) => (
                <Table.Row key={letter.id} className="bg-white">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 ">
                    {new Date(letter.modifiedTime).toLocaleDateString()}
                  </Table.Cell>

                  <Table.Cell>{letter.name}</Table.Cell>

                  <Table.Cell>
                    <a
                      href={letter.webViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="text-teal-500 hover:underline">
                        {letter.webViewLink}
                      </span>
                    </a>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell
                  colSpan="7"
                  className="text-center text-gray-500 py-4"
                >
                  No letters in Drive
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

export default Drive;
