import { XMLParser } from "fast-xml-parser";
import * as fs from "fs";
import * as path from "path";
import { OAIPMH } from "./inputModel";
import {
  fromOAIPMHRecord2HeritageObject,
  fromOAIPMHRecord2MediaObject,
  fromOAIPMHRecord2OrganizationObject,
} from "./mappings";
import { HeritageObject, MediaObject, OrganizationObject } from "./outputModel";

const xmlData = fs.readFileSync(
  path.join(__dirname, "..", "/data/museumrotterdam.xml")
);
const parser = new XMLParser({
  ignoreAttributes: false,
});
const jsObjects: OAIPMH = parser.parse(xmlData);

const arrInput = Array.from(jsObjects["OAI-PMH"].ListRecords.record);
const heritageObjects: HeritageObject[] = [];
const mediaObjects: MediaObject[] = [];
const organizationObjects: OrganizationObject[] = [];
arrInput.forEach((inp) => {
  const herObj = fromOAIPMHRecord2HeritageObject(inp);
  if (herObj !== undefined) {
    heritageObjects.push(herObj);
  }
  const medObj = fromOAIPMHRecord2MediaObject(inp);
  if (medObj !== undefined) {
    mediaObjects.push(medObj);
  }
  const orgObj = fromOAIPMHRecord2OrganizationObject(inp);
  if (orgObj !== undefined) {
    organizationObjects.push(orgObj);
  }
});

organizationObjects.forEach((obj) => {
  console.log(obj);
});
