import { google } from 'googleapis';
import NodeCache from 'node-cache';
import type { NextApiRequest, NextApiResponse } from "next";
import XLSX from "xlsx";
import fetch from "node-fetch";
import { Redis } from "@upstash/redis";


// Your Google Sheets credentials
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n');
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL!;
const SHEET_ID = process.env.SHEET_ID!;
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || "",
    token: process.env.UPSTASH_REDIS_REST_TOKEN || ""
  });
  
  // The URL for the workbook XLSX export from Google Sheets.
  // Replace <GOOGLE_SHEET_ID> with your sheet id and optionally set the desired export options.
  const SHEET_URL =
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=xlsx`;
  
  // Cache key and expiration time.
  const CACHE_KEY = "google_sheet_json";
  const CACHE_TTL_SECONDS = 300; // 5 minutes
  
  export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    try {
      // Check if we have cached data first
      const cached = await redis.get(CACHE_KEY);
      if (cached && typeof cached === "string") {
        const cachedData = JSON.parse(cached);
        return res.status(200).json({ cached: true, data: cachedData });
      }
  
      // Download the XLSX file from Google Sheets
      const response = await fetch(SHEET_URL);
      if (!response.ok) {
        return res
          .status(response.status)
          .json({ error: "Failed to fetch the Google Sheets file." });
      }
      const buffer = await response.arrayBuffer();
      const data = new Uint8Array(buffer);
  
      // Parse XLSX file using the xlsx library.
      const workbook = XLSX.read(data, { type: "array" });
      const result: { [sheetName: string]: any[] } = {};
  
      workbook.SheetNames.forEach((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        // Convert sheet to JSON array.
        result[sheetName] = XLSX.utils.sheet_to_json(sheet, { defval: null });
      });
  
      // Cache result in Upstash Redis for 5 minutes.
      await redis.set(CACHE_KEY, JSON.stringify(result), {
        ex: CACHE_TTL_SECONDS
      });
  
      return res.status(200).json({ cached: false, data: result });
    } catch (error: any) {
      console.error("Error processing sheet:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }