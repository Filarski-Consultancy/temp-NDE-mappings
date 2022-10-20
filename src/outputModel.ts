export interface HeritageObject {
  ID: URI;
  "rdf:type": "schema:CreativeWork";
  "schema:name": string;
  "schema:description": string;
  "schema:dateCreated": string;
  "schema:contentLocation": URI | undefined;
  "schema:keywords": URI[] | string[];
  "schema:mainEntityOfPage": URI;
  "schema:image": URI[];
  "schema:creator"?: string;
  "schema:publisher": URI;
  "schema:isBasedOn": URI;
}

export interface MediaObject {
  ID: URI;
  "rdf:type": "schema:ImageObject";
  "schema:contentUrl": URI;
  "schema:encodingFormat": string;
  "schema:license": URI;
  "schema:thumbnail"?: URI;
}

export interface OrganizationObject {
  ID: URI;
  "rdf:type": "schema:Organization";
  "schema:name": string;
  "schema:mainEntityOfPage": URI;
  "schema:location": URI;
}
