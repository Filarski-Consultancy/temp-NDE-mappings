import URI from "urijs";
import { OreAggregation, Record } from "./inputModel";
import { HeritageObject, MediaObject, OrganizationObject } from "./outputModel";
import { getFirstOrOnly } from "./utils";

function getLocationUri(inp: string): URI {
    // There is no location available in the OAI-PMH. Since the entire collection in each XML file belongs to a single museum with a single location we can hardcode Rotterdam and Enkhuizen?
    return inp === "museum-rotterdam"
        ? new URI("https://sws.geonames.org/2747891/")
        : new URI("https://sws.geonames.org/2756077/");
}

function getPublisherUri(inp: string): URI {
    // there is only a literal Since the entire collection in each XML file belongs to a single museum can we hardcode the url?
    return inp === "museum-rotterdam"
        ? new URI("https://museumrotterdam.nl")
        : new URI("https://www.zuiderzeemuseum.nl");
}

function getAggregation(inp: Record): OreAggregation | undefined {
    return inp.metadata["rdf:RDF"]["ore:Aggregation"] !== undefined
        ? inp.metadata["rdf:RDF"]["ore:Aggregation"]
        : inp.metadata["rdf:RDF"]["ns0:Aggregation"];
}

export function fromOAIPMHRecord2HeritageObject(
    input: Record,
): HeritageObject | undefined {
    const locationURI = getLocationUri(input.header.setSpec);
    const publisherURI = getPublisherUri(input.header.setSpec);
    const aggregation = getAggregation(input);

    if (aggregation !== undefined) {
        const images: URI[] = [];
        // only this lowres image is available in the OAI-PMH dump
        if (Array.isArray(aggregation["edm:object"])) {
            aggregation["edm:object"].forEach((obj) => {
                images.push(new URI(obj["@_rdf:resource"]));
            });
        } else {
            images.push(new URI(aggregation["edm:object"]["@_rdf:resource"]));
        }

        const output: HeritageObject = {
            ID: new URI(aggregation["@_rdf:about"]),
            "rdf:type": "schema:CreativeWork",
            "schema:name":
                input.metadata["rdf:RDF"]["edm:ProvidedCHO"]["dc:title"],
            "schema:description":
                input.metadata["rdf:RDF"]["edm:ProvidedCHO"]["dc:description"],
            "schema:dateCreated":
                input.metadata["rdf:RDF"]["edm:ProvidedCHO"]["dcterms:created"],
            "schema:contentLocation": locationURI,
            "schema:keywords":
                input.metadata["rdf:RDF"]["edm:ProvidedCHO"][
                    "dcterms:medium"
                ].split(", "), // How do we generate URIs from these literals?
            "schema:mainEntityOfPage": new URI(
                aggregation["edm:isShownAt"]["@_rdf:resource"],
            ), // Almost all of the museumrotterdam links in the OAI-PMH harvest are dead, there is no handle server or other persistent uri register
            "schema:image": images,
            //"schema:creator": ,
            "schema:publisher": publisherURI,
            "schema:isBasedOn": new URI(aggregation["@_rdf:about"]), // How is this different from the ID?
        };
        return output;
    } else {
        return undefined;
    }
}

export function fromOAIPMHRecord2MediaObject(
    input: Record,
): MediaObject | undefined {
    const aggregation = getAggregation(input);
    if (aggregation !== undefined) {
        const output: MediaObject = {
            ID: new URI(
                getFirstOrOnly<{ "@_rdf:resource": string }>(
                    aggregation["edm:object"],
                )["@_rdf:resource"],
            ),
            "rdf:type": "schema:ImageObject",
            "schema:contentUrl": new URI(
                getFirstOrOnly<{ "@_rdf:resource": string }>(
                    aggregation["edm:object"],
                )["@_rdf:resource"],
            ),
            "schema:encodingFormat": "",
            "schema:license": new URI(
                aggregation["edm:rights"]["@_rdf:resource"],
            ),
        };
        return output;
    } else {
        return undefined;
    }
}

export function fromOAIPMHRecord2OrganizationObject(
    input: Record,
): OrganizationObject | undefined {
    const locationURI = getLocationUri(input.header.setSpec);
    const publisherURI = getPublisherUri(input.header.setSpec);
    const aggregation = getAggregation(input);

    if (aggregation !== undefined) {
        const output: OrganizationObject = {
            ID: publisherURI,
            "rdf:type": "schema:Organization",
            "schema:name": input.header.setSpec,
            "schema:mainEntityOfPage": publisherURI,
            "schema:location": locationURI,
        };
        return output;
    } else {
        return undefined;
    }
}
