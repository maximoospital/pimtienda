import { google } from 'googleapis';
import { Redis } from "@upstash/redis";
import XLSX from "xlsx";

// Your Google Sheets credentials
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEET_ID}/export?format=xlsx`;
let counter = 0;

// Initialize Upstash Redis client using env variables.
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

export default async function handler(req, res) {
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

  if (token === process.env.SECRET_TOKEN) {
    try {
      // Ensure the sheet URL is defined.
      if (!SHEET_URL) {
        throw new Error("SHEET_URL environment variable is not defined.");
      }
  
      let aggregatedResult = {};
      let sheetNames = [];
      let useCache = false;
  
      // First, try to get the list of sheet names (the “directory” key).
      const cachedSheetNames = await redis.get("sheet:keys");
      console.log("cachedSheetNames", cachedSheetNames);
      console.log(typeof cachedSheetNames);
      if(cachedSheetNames) {
        console.log(cachedSheetNames[0]);
        console.log(cachedSheetNames[1]);  
      }
      if (cachedSheetNames) {
        sheetNames = JSON.parse(JSON.stringify(cachedSheetNames));
        console.log("sheetNames", sheetNames);
        console.log(typeof sheetNames);
        // Use MGET (via Promise.all) to fetch each sheet's cached value.
        const cachedSheets = await Promise.all(
          sheetNames.map((name) => redis.get(`sheet:${name}`))
        );
        // If all sheets are in cache, use these.
        if (cachedSheets.every((sheet) => sheet !== null)) {
          useCache = true;
          sheetNames.forEach((name, idx) => {
            aggregatedResult[name] = JSON.parse(JSON.stringify(cachedSheets[idx]));
          });
        }
      }
  
      // If one or more sheets were not cached, fetch and process the XLSX.
      if (!useCache) {
        const response = await fetch(SHEET_URL);
        if (!response.ok) {
          throw new Error(
            "Failed to fetch XLSX file from Google Sheets."
          );
        }
        // Get the file as an arrayBuffer and convert to Node Buffer.
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
  
        // Parse the XLSX workbook.
        const workbook = XLSX.read(buffer, { type: "buffer" });
  
        // Get all sheet names.
        sheetNames = workbook.SheetNames;
        aggregatedResult = {};
  
        // Process each sheet.
        sheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          // Use header: 1 to get an array of arrays.
          let data = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: null
          });
  
          // For sheets other than "Configuracion", filter the rows.
          if (sheetName !== "Configuracion") {
            const header = data[0] || [];
            const filteredData = [header];
            for (let i = 1; i < data.length; i++) {
              const row = data[i];
              // Keep the row if the first cell is exactly true or "TRUE".
              if (row[0] === true || row[0] === "TRUE") {
                filteredData.push(row);
              }
            }
            data = filteredData;
          }
          aggregatedResult[sheetName] = data;
        });
  
        // Cache the list of sheet names and each sheet's data separately.
        console.log(sheetNames);
        const testSheetnames = JSON.stringify(sheetNames);
        console.log("testSheetnames", testSheetnames);
        console.log(typeof testSheetnames);
        await redis.set("sheet:keys", testSheetnames, { ex: 300 });
        await Promise.all(
          sheetNames.map((sheetName) =>
            redis.set(
              `sheet:${sheetName}`,
              JSON.stringify(aggregatedResult[sheetName]),
              { ex: 300 }
            )
          )
        );
      }
      counter++;
      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Cache-Control",
        "public, max-age=300, s-maxage=600, stale-while-revalidate=600"
      );
      // Add a counter to aggregatedResult.
      aggregatedResult.counter = counter;
      return res.status(200).json(aggregatedResult);
    } catch (error) {
      console.error("Error processing the XLSX:", error);
      return res.status(500).json({ error: error.message });
    }  
  }
}