import oauth2Client from "../googleAuth.js";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import HtmlToDocx from "html-to-docx";
import fs from "fs";
import path from "path";

const __dirname = path.resolve();

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
  const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
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
    .redirect(`${frontendURL}/dashboard/uploading-letter/?driveLinked=true`);
};

export const getDriveLetters = async (req, res, next) => {
  const folderName = "Letters";
  const limit = parseInt(req.query.limit) || 9; // Default limit
  const startIndex = parseInt(req.query.startIndex) || 0;

  try {
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

    oauth2Client.setCredentials(req.token);

    const drive = google.drive({ version: "v3", auth: oauth2Client });
    const folderResponse = await drive.files.list({
      q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`, // Fetch only Google Docs
      fields: "files(id)",
    });

    // console.log(folderResponse);

    const FileResponse = await drive.files.list({
      q: `'${folderResponse.data.files[0].id}' in parents and mimeType='application/vnd.openxmlformats-officedocument.wordprocessingml.document'`,
      fields: "files(id, name, webViewLink, modifiedTime)",
      pageSize: limit + startIndex,
    });

    const files = FileResponse.data.files.slice(startIndex, limit + startIndex);
    res.status(200).json({
      letters: files,
    });
  } catch (error) {
    next(error);
  }
};

export const driveUpload = async (req, res, next) => {
  try {
    const filePath = path.resolve(__dirname, "docsHtml.docs");
    const { title, content } = req.body;

    if (!title || !content) {
      return next(errorHandler(404, "Missing letter title or content!"));
    }

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
    console.log(title);

    // Define file metadata with the folder ID
    const fileMetadata = {
      name: `${title || "New Letter"}.docx`,
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      parents: [folderId],
    };

    const media = {
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      body: fs.createReadStream(filePath),
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id, webViewLink",
    });

    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      next(error);
    }
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

  const response = await drive.files.list({
    q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`,
    fields: "files(id, name)",
  });

  if (response.data.files.length > 0) {
    return response.data.files[0].id;
  }

  const fileMetadata = {
    name: folderName,
    mimeType: "application/vnd.google-apps.folder",
  };

  const folder = await drive.files.create({
    resource: fileMetadata,
    fields: "id",
  });

  return folder.data.id;
}
