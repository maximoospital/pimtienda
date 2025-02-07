// pages/api/hello.js

let counter = 0;

export default function handler(req, res) {
  // Retrieve the Authorization header (expected format: "Bearer <token>")
  const authHeader = req.headers.authorization;

  // Check if the header exists
  if (!authHeader) {
    return res
      .status(401)
      .json({ error: "Unauthorized: No token provided." });
  }

  // Extract the token part from the "Bearer <token>" string
  const token = authHeader.split(" ")[1];

  // Compare the token with the secret token stored in environment variables
  if (token !== process.env.SECRET_TOKEN) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Invalid token." });
  }

  // If the token is valid, send a hello world message
  counter++;
  res.status(200).json({ number: counter });
}