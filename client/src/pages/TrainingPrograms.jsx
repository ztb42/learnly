import { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
} from "@mui/material";

const TrainingPrograms = () => {
  // Dummy Training Data
  const [trainings] = useState([
    {
      _id: "65f123abc987654321000001",
      Title: "Web Development Fundamentals",
      Description:
        "An introduction to building websites using HTML, CSS, and JavaScript.",
      Duration: 6,
      Manager: "65fabc321987654321000002",
      Deadline: new Date("2025-04-15"),
    },
    {
      _id: "65f123abc987654321000002",
      Title: "Advanced Algorithms",
      Description:
        "Dive deep into advanced algorithmic concepts like dynamic programming and graph theory.",
      Duration: 8,
      Manager: "65fabc321987654321000003",
      Deadline: new Date("2025-05-01"),
    },
    {
      _id: "65f123abc987654321000003",
      Title: "Database Management Systems",
      Description:
        "Learn about relational databases, SQL, and modern database technologies.",
      Duration: 4,
      Manager: "65fabc321987654321000004",
      Deadline: new Date("2025-04-20"),
    },
    {
      _id: "65f123abc987654321000004",
      Title: "Introduction to Artificial Intelligence",
      Description:
        "Explore the basics of AI, including machine learning and neural networks.",
      Duration: 6,
      Manager: "65fabc321987654321000005",
      Deadline: new Date("2025-06-10"),
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  // Filter trainings based on search
  const filteredTrainings = trainings.filter(
    (training) =>
      training.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      training.Description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (trainingId) => {
    console.log("Editing training program with ID:", trainingId);
    //add form to edit course
  };

  return (
    <Container className="training-container">
      <h1>Courses</h1>

      <div className="search-bar">
        {/* Search Bar */}
        <TextField
          className="search-bar-inside"
          label="Search for a course"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredTrainings.length === 0 ? (
        <p>No training programs found.</p>
      ) : (
        <div className="row">
          {filteredTrainings.map((training) => (
            <div className="col-md-4 mb-4" key={training._id}>
              <Card className="training-card h-100 d-flex flex-column">
                <CardContent className="d-flex flex-column flex-grow-1">
                  <Typography variant="h5">{training.Title}</Typography>
                  <Typography
                    className="description-typography"
                    variant="body2"
                  >
                    {training.Description}
                  </Typography>
                  <Typography variant="body2">
                    Duration: {training.Duration} weeks
                  </Typography>
                  <Typography variant="body2">
                    Manager ID: {training.Manager} {/* Display as ID for now */}
                  </Typography>
                  <Typography className="deadline-typography" variant="body2">
                    Deadline: {training.Deadline.toLocaleDateString()}
                  </Typography>

                  {/* Edit Button */}
                  <Button
                    className="button-right"
                    variant="contained"
                    color="primary"
                    onClick={() => handleEdit(training._id)}
                    sx={{ marginTop: "auto", paddingTop: "10px" }}
                  >
                    Edit
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};

export default TrainingPrograms;
