export interface OreAggregation {
    "@_rdf:about": string;
    "edm:isShownAt": {
        "@_rdf:resource": string;
    };
    "edm:isShownBy":
        | {
              "@_rdf:resource": string;
          }
        | {
              "@_rdf:resource": string;
          }[];
    "edm:dataProvider": string;
    "edm:provider": string;
    "edm:aggregatedCHO": {
        "@_rdf:resource": string;
    };
    "edm:rights": {
        "@_rdf:resource": string;
    };
    "edm:object": {
        "@_rdf:resource": string;
    }[];
}

interface EdmProvidedCHO {
    "dcterms:medium": string;
    "edm:type": string;
    "dc:publisher": string;
    "dc:subject": string;
    "dc:identifier": string;
    "dc:date": string;
    "dc:title": string;
    "dc:description": string;
    "dc:type": string;
    "dcterms:extent": string;
    "dcterms:created": string;
}

interface Header {
    identifier: string;
    datestamp: string;
    setSpec: string;
}

interface Metadata {
    "rdf:RDF": {
        "ore:Aggregation"?: OreAggregation;
        "ns0:Aggregation"?: OreAggregation;
        "edm:ProvidedCHO": EdmProvidedCHO;
    };
}

export interface Record {
    header: Header;
    metadata: Metadata;
}

export interface OAIPMH {
    "OAI-PMH": {
        responseDate: string;
        request: string;
        ListRecords: {
            record: Record[];
            resumptionToken: string;
        };
    };
}
