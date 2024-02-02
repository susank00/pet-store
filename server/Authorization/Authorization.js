const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

const secretKey = "your-secret-key";

app.post("/login", (req, res) => {
  // Authenticate user (replace with your own authentication logic)
  const user = {
    userId: "123",
    username: "exampleUser",
  };

  // Generate an access token
  const accessToken = jwt.sign(user, secretKey, { expiresIn: "1h" });

  // Send the access token to the client
  res.json({ accessToken });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
