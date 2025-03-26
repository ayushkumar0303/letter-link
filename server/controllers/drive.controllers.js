import oauth2Client from "../googleAuth.js";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import HtmlToDocx from "html-to-docx";
import fs from "fs";

export const driveConnect = async (req, res, next) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/drive.file"],
    prompt: "consent",
  });

  // console.log(authUrl);
  res.redirect(authUrl);
};

export const driveCallback = async (req, res, next) => {
  const { code } = req.query;
  if (!code) return res.status(400).json({ message: "Missing parameters" });

  // Exchange code for tokens
  const { tokens } = await oauth2Client.getToken(code);
  const authToken = jwt.sign(tokens, process.env.SECRET_KEY);
  res
    .status(200)
    .cookie("auth_token", authToken, {
      httpOnly: true,
    })
    .redirect(`http://localhost:5173/video-uploading?driveLinked=true`);
};

export const driveUpload = async (req, res, next) => {
  try {
    const filePath = "./docsHtml.docs";
    const { title, content } = req.body;

    const userId = req.params.userId;

    const authToken = req.cookies.auth_token;

    if (!authToken) {
      return res.status(401).json("Unauthorised User");
    }

    jwt.verify(authToken, process.env.SECRET_KEY, (err, token) => {
      if (err) {
        return next(err);
      }
      req.token = token;
    });

    const docxBuffer = await HtmlToDocx(content);

    fs.writeFileSync(filePath, docxBuffer);

    oauth2Client.setCredentials(req.token);

    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const folderId = await getOrCreateFolder(drive);

    // Define file metadata with the folder ID
    const fileMetadata = {
      name: `${title || "New Letter"}.docx`,
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      parents: [folderId], // Upload inside "Letters" folder
    };

    const media = {
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      body: fs.createReadStream(filePath), // Letter content
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id, webViewLink",
    });

    fs.unlinkSync(filePath);
    // console.log(response.status);
    if (response?.statusText === "OK") {
      return res
        .status(200)
        .json({ message: "Uploaded Successfully", data: response.data });
    }
  } catch (error) {
    next(error);
  }
};

async function getOrCreateFolder(drive) {
  const folderName = "Letters";

  // Step 1: Search for the existing "Letters" folder
  const response = await drive.files.list({
    q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`,
    fields: "files(id, name)",
  });

  if (response.data.files.length > 0) {
    // Folder already exists, return its ID
    return response.data.files[0].id;
  }

  // Step 2: Create the folder if it does not exist
  const fileMetadata = {
    name: folderName,
    mimeType: "application/vnd.google-apps.folder",
  };

  const folder = await drive.files.create({
    resource: fileMetadata,
    fields: "id",
  });

  return folder.data.id; // Return the newly created folder ID
}
