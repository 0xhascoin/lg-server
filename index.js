import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { fetchLensProfile, returnNFTMetadataObject } from './controller.js'

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

app.get("/", (req, res) => {
  res.send({ "name": "John" });
});

app.get("/api/address/:address", async (req, res) => {

  try {
    const { address } = req.params;
    const profile = await fetchLensProfile(address);

    if(profile.error === true) {
      res.json({ "Error": "No Lens Matching Address Found"});
      return
    }

    const nftMetadata = returnNFTMetadataObject(profile)
    
    res.json(nftMetadata);
    
  } catch (error) {
    res.json({ "Error": error })
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});