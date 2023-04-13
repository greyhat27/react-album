import { useState } from "react";
import "./Card.scss";
import Stack from "@mui/material/Stack";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Button } from "@mui/material";

//Card Component
export const Card = ({ item }) => {
  //states
  const [album, setAlbum] = useState(item);
  const [albumItem, setAlbumItem] = useState(0);
  const [opneEdit, setOpenEdit] = useState(false);
  const [updatedValue, setUpdateValue] = useState("");

  //function to handle click event on back button
  const handleBack = () => {
    setAlbumItem(albumItem === 0 ? album.length - 1 : (prev) => prev - 1);
  };

  //function to handle click event on next button
  const handleNext = () => {
    setAlbumItem(albumItem === album.length - 1 ? 0 : (prev) => prev + 1);
  };

  // function to update album
  const handleUpdate = async (e) => {
    if (!updatedValue) {
      alert("Please enter a valid title.");
      return;
    }
    setOpenEdit(false);

    //API call to update (PUT METHOD)
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/albums/${e.target.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            title: updatedValue,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      const data = await response.json();
      const newData = album.map((item) => {
        if (item?.id === data?.id) {
          return { ...item, title: data?.title };
        } else {
          return item;
        }
      });
      setAlbum(newData);
      setUpdateValue("");
    } catch (err) {
      console.log("Error Occurred");
    }
  };

  //function to to delete entry in the album (DELETE METHOD)
  const handleDelete = async (e) => {
    //API call to delete entry in the album
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/albums/${e.target.id}`,
      {
        method: "DELETE",
      }
    );
    if (response.ok) {
      const newData = album.filter(
        (item) => item?.id !== parseInt(e.target?.id)
      );
      setAlbum(newData);
    } else {
      alert("Failed to delete album.");
    }
  };

  return (
    <div className="card">
      {/* container for album card  */}
      <div className="cardContainer">
        <h1>Album {album[albumItem]?.userId}</h1>
        <h2>ID: {album[albumItem]?.id}</h2>
        <p>Title: {album[albumItem]?.title}</p>
        {album.length > 1 && (
          <>
            {/* Edit, delete action buttons */}
            <div className="action">
              <Button
                variant="contained"
                size="small"
                onClick={() => setOpenEdit(true)}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                id={album[albumItem]?.id}
                size="small"
                color="error"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
            {/* buttons for slider */}
            <div className="buttons">
              <ArrowBackIosIcon onClick={handleBack} />
              <ArrowForwardIosIcon onClick={handleNext} />
            </div>
          </>
        )}
      </div>
      {/* HTML structure for edit  */}
      {opneEdit && (
        <div className="editWindow">
          <h1>Enter Body</h1>
          <input
            type="text"
            name="Edit"
            id={album[albumItem]?.id}
            onChange={(e) => setUpdateValue(e.target.value)}
            required
            placeholder="Enter title"
          />
          <Stack direction="row" spacing={2}>
            <Button
              id={album[albumItem].id}
              variant="contained"
              color="success"
              size="small"
              onClick={handleUpdate}
            >
              Done
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => setOpenEdit(false)}
            >
              Close
            </Button>
          </Stack>
        </div>
      )}
    </div>
  );
};
