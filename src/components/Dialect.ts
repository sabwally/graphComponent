enum BaseNode {
    Circle = "circle",
    Rectangle = "rectangle",
    Rhomb = "rhombus",
    Ellipse = "ellipse",
    Triangle = "triangle",
    RegularPolygon = "regular polygon",
    Cloud = "cloud",
    Star = "Star",
    CustomShape = "custom" // for now
}

enum BaseEdge {
    Line = "line"
}

enum BaseArrow {
    TriangleArrowHead = "triangle",
    StickArrowHead = "stick",
    LineArrowHead = "line",
    CrowFootArrowHead = "crow"
}

function isBaseNode(type: string): type is BaseNode {
    return Object.values(BaseNode).includes(type as BaseNode);
}

function isBaseEdge(type: string): type is BaseEdge {
    return Object.values(BaseEdge).includes(type as BaseEdge);
}

function isBaseArrow(type: string): type is BaseArrow {
    return Object.values(BaseArrow).includes(type as BaseArrow);
}

export class Dialect {
    // ���� ������ ��������� ����� �������� (��� ���) � ������� � �������� � �������� �������� �����
    name: string = ""
    nodeTypes: Map<string, string>;
    edgeTypes: Map<string, string>;
    arrowheadTypes: Map<string, string>;

    constructor(dialectName: string) {
        this.name = dialectName;
        this.nodeTypes = new Map();
        this.edgeTypes = new Map();
        this.arrowheadTypes = new Map();
    }

    static fromXML(xml: string): Dialect {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, "application/xml");
        const dialectName = xmlDoc.getElementsByTagName("dialect")[0].getAttribute("name") || "";
        const dialect = new Dialect(dialectName);

        // Parse allowed node types
        const nodeTypes = xmlDoc.getElementsByTagName("allowedNode"); // is it right to ignore <Nodes>???
        for (let i = 0; i < nodeTypes.length; i++) {
            const typeName = nodeTypes[i].getAttribute("type");
            if (typeName) {
                const basedOnType = nodeTypes[i].getElementsByTagName("basedOnType")[0].getAttribute("type") || ""
                if (isBaseNode(basedOnType)) {
                    dialect.nodeTypes.set(typeName, basedOnType);
                } else if (basedOnType == "" && isBaseNode(typeName)) {
                    dialect.nodeTypes.set(typeName, typeName);
                }
            }
        }

        // Parse allowed edge types
        const edgeTypes = xmlDoc.getElementsByTagName("allowedEdge");
        for (let i = 0; i < edgeTypes.length; i++) {
            const typeName = edgeTypes[i].getAttribute("type");
            if (typeName) {
                const basedOnType = edgeTypes[i].getElementsByTagName("basedOnType")[0].getAttribute("type") || ""
                if (isBaseEdge(basedOnType)) {
                    dialect.edgeTypes.set(typeName, basedOnType);
                } else if (basedOnType == "" && isBaseEdge(typeName)) {
                    dialect.edgeTypes.set(typeName, typeName);
                }
            }
        }

        // Parse allowed arrowhead types
        const arrowTypes = xmlDoc.getElementsByTagName("allowedArrowhead");
        for (let i = 0; i < arrowTypes.length; i++) {
            const typeName = arrowTypes[i].getAttribute("type");

            if (typeName) {
                const basedOnType = arrowTypes[i].getElementsByTagName("basedOnType")[0].getAttribute("type") || ""
                if (isBaseArrow(basedOnType)) {
                    dialect.arrowheadTypes.set(typeName, basedOnType);
                } else if (basedOnType == "" && isBaseArrow(typeName)) {
                    dialect.arrowheadTypes.set(typeName, typeName);
                }
            }
        }

        return dialect;
    }

    validateNodeType(type: string): boolean {
        return this.nodeTypes.has(type);
    }

    validateEdgeType(type: string): boolean {
        return this.edgeTypes.has(type);
    }

    validateArrowheadType(type: string): boolean {
        return this.arrowheadTypes.has(type);
    }
}

//// ���������� ��������� ���������
//export const dialectRegistry = new Map<string, Dialect>();

//export function registerDialect(name: string, dialect: Dialect): void {
//    dialectRegistry.set(name, dialect);
//}

//function parseGraph(xmlData: string, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): Graph.Graph {
