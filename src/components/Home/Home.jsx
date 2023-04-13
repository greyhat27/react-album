import React, { useEffect, useState } from "react";
import "./Home.scss";
import { Card } from "../Card/Card";
import QueueIcon from "@mui/icons-material/Queue";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export const Home = () => {
  //states
  const [data, setData] = useState([]);
  const [inputvalue, setInputValue] = useState("");
  const [openAdd, setOpenAdd] = useState(false);

  //function to add new album
  const handleAdd = async () => {
    if (!inputvalue) {
      alert("Please enter a valid title.");
      return;
    }
    setOpenAdd(false);
    try {
      //API call to add new entry
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/albums",
        {
          method: "POST",
          body: JSON.stringify({
            userId: 11,
            title: inputvalue,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      const newEntry = await response.json();
      setData([...data, [newEntry]]);
      setInputValue("");
    } catch (err) {
      console.log("Error occurred", err);
    }
  };
  // API call to fetch Album data
  useEffect(() => {
    const fetchData = async () => {
      const albumArray = [];
      try {
        //API call
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/albums"
        );
        const fetchedData = await response.json();
        for (let i = 0; i < fetchedData.length; i += 10) {
          let emptyData = [];
          emptyData = fetchedData.slice(i, i + 10);
          albumArray.push(emptyData);
        }
        setData(albumArray);
      } catch (err) {
        console.log("Error occured", err);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="home">
      <h1>React Album</h1>
      <div className="container">
        {data?.map((item, index) => (
          <Card item={item} key={index} />
        ))}
        <div className="contain">
          <div className="addAlbum">
            <div className="addIcon">
              <QueueIcon className="queueIcon" />
            </div>
            <Button
              variant="contained"
              size="small"
              onClick={() => setOpenAdd(true)}
            >
              Add Album
            </Button>
          </div>
          {/* html structure to add new album */}
          {openAdd && (
            <div className="addWindow">
              <h1>Enter Title</h1>
              {/* input to add new album  */}
              <input
                type="text"
                name=""
                id=""
                placeholder="Enter title.."
                onChange={(e) => setInputValue(e.target.value)}
              />
              {/* add, close action buttons */}
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleAdd}
                  size="small"
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setOpenAdd(false)}
                  size="small"
                >
                  Close
                </Button>
              </Stack>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
