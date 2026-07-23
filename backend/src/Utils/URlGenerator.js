import DataUriParser from "datauri/parser.js";
import path from "path";

const getdataUri = (file) => {
  if (!file || !file.buffer) {
    throw new Error("Invalid file input");
  }

  const parser = new DataUriParser();
  const extname = path.extname(file.originalname);

  try {
    const dataUri = parser.format(extname, file.buffer);
    return dataUri;
  } catch (err) {
    throw new Error("Failed to parse file to Data URI");
  }
};

export default getdataUri;