<template>
    <div class="graph-container">
        <canvas class="graph" ref="graphCanvas"></canvas>
        <div id="tooltip"></div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue';
    //import * as Shapes from './Shape';
    import * as Graph from './Graph';
    import * as Dialect from './Dialect';
    import * as Tests from './tests';

    export default defineComponent({
        name: 'GraphComponent',
        props: {
            filePath: String,
            xmlData: String,
            dialectData: String
        },
        data: () => ({
        }),
        methods: {
            splitStringIntoTwo(input: string): [string, string, string] {
            
                const sizeStartIndex = input.indexOf('Size:') + 5;
                const sizeEndIndex = input.indexOf(';');

                const objectsStartIndex = input.indexOf('Objects:(') + 9;
                const objectsEndIndex = input.indexOf(')');

                const typesStartIndex = input.indexOf('Types:(') + 7;
                const typesEndIndex = input.indexOf(')', typesStartIndex);

                const firstPart = input.slice(sizeStartIndex, sizeEndIndex).trim();
                const secondPart = input.slice(objectsStartIndex, objectsEndIndex).trim();
                const types = input.slice(typesStartIndex, typesEndIndex).trim();

                return [firstPart, secondPart, types];
            },
            parseXML(xml_text: string): Document {
              const parser = new DOMParser();
              return parser.parseFromString(xml_text, "application/xml");
            }            
        },
        setup() {
            const graphCanvas = ref(null);
            
            return {
                graphCanvas
            }
        },

    mounted() {
        //id???
        const canvas = this.$refs.graphCanvas;

        if (!(canvas instanceof HTMLCanvasElement)) {
            throw new Error('Элемент не является HTMLCanvasElement');
        }

        const ctx = canvas.getContext("2d");


        if (!ctx) {
            throw new Error('Не удалось получить 2D контекст');
        }
        
        if (typeof this.filePath === 'undefined') {
            throw new Error('Элемент не является string');
        }

        

        // ToDo: if .json

        // if .txt

        //const path = '!!raw-loader!' + this.filePath
        //console.log('Path:', path);
        //
        /*
        let txtStr = require(`!!raw-loader!./text.txt`).default;

        const split_text = this.splitStringIntoTwo(txtStr);

        //const json_size: Shapes.CanvasSize = JSON.parse(split_text[0]);

        const json_shapes: Shapes.DataFigure[] = JSON.parse("[" + split_text[1] + "]");

        const json_types: Shapes.ICustomDescription[] = JSON.parse("[" + split_text[2] + "]");

        //canvas.width = json_size.width;
        //canvas.height = json_size.height;
        */

        //---------------xml--------------

        if (typeof this.xmlData === 'undefined') {
            throw new Error('Элемент не является string');
        }

        const xmlDoc = this.parseXML(this.xmlData);

        const canvasElement = xmlDoc.getElementsByTagName("canvas")[0];

        if (canvasElement) {
            const width = canvasElement.getAttribute("width");
            const height = canvasElement.getAttribute("height");
            canvas.width = width ? parseInt(width, 10) : 0;
            canvas.height = height ? parseInt(height, 10) : 0;
        }

        const graph: Graph.Graph = new Graph.Graph();

        graph.bindCanvas(canvas, ctx);

        const graph_figures: Graph.DataShapes[] = [];

        let dialect: Dialect.Dialect | null = null;

        if (typeof this.dialectData !== 'undefined') {
            dialect = Dialect.Dialect.fromXML(this.dialectData);
        }

        const dialectName = xmlDoc.getElementsByTagName("graph")[0].getAttribute("dialect");

        //if (dialectName) {
        //    dialect = dialectRegistry.get(dialectName) || null;
        //    if (!dialect) {
        //        throw new Error(`Диалект "${dialectName}" не найден`);
        //    }
        //}
        if (dialectName && dialect?.name !== dialectName && dialectName !== "base") {
            throw new Error(`Диалект "${dialectName}" не найден`);
        }

        const nodes = xmlDoc.getElementsByTagName("node");

        // Получение узлов описаний
        const descriptions = xmlDoc.getElementsByTagName("customDescription");

        const customDescriptions = new Map<string, Graph.ICustomDescription>(); // Хранение описаний

        // Обработка описаний новых типов фигур
        for (const description of Array.from(descriptions) ) {
            const descType = description.getAttribute("type") || "";
            const points: Array<{ x: number; y: number }> = [];
            const curve: Array<{ isCurved: boolean; cp1x: number; cp1y: number; cp2x: number; cp2y: number; }> = [];
            const pointNodes = description.getElementsByTagName("point");
            for (const pointNode of Array.from(pointNodes) ) {
                const x = parseFloat(pointNode.getAttribute("x") || "0");
                const y = parseFloat(pointNode.getAttribute("y") || "0");
                points.push({ x, y });
            }

            const curveNodes = description.getElementsByTagName("curvePoint");

            for (const curveNode of Array.from(curveNodes)) {
                const cp1x = parseFloat(curveNode.getAttribute("cp1x") || "0");
                const cp1y = parseFloat(curveNode.getAttribute("cp1y") || "0");
                const cp2x = parseFloat(curveNode.getAttribute("cp2x") || "0");
                const cp2y = parseFloat(curveNode.getAttribute("cp2y") || "0");
                const isCurved = curveNode.getAttribute("isCurved") === "true";
                curve.push({ isCurved, cp1x, cp1y, cp2x, cp2y });
            }

            const customDescription: Graph.ICustomDescription = {
                typeName: descType,
                points,
                curve
            };

            customDescriptions.set(descType, customDescription);
        }

        //border create
        //<lineConnectionStart> / End

        for (const node of Array.from(nodes)) {
            const id = node.getAttribute("id") || "";
            let type = node.getAttribute("type") || "";
            const label = node.getAttribute("label") || "";
            const info = node.getAttribute("info") || "";
            const rotation = parseInt(node.getAttribute("rotation") || "0", 10);
            const geometry = node.getElementsByTagName("geometry")[0];
            const background = node.getElementsByTagName("background")[0];
            const edgeStyle = node.getElementsByTagName("edgeStyle")[0];
            const labelSettings = node.getElementsByTagName("labelSettings")[0];

            const connectorElements = xmlDoc.getElementsByTagName("connector");
            const connectors: Graph.IConnector[] = [];

            for (let i = 0; i < connectorElements.length; i++) {
                const connectorElement = connectorElements[i];

                const connector: Graph.IConnector = {
                    id: connectorElement.getAttribute("id") || undefined,
                    x: parseFloat(connectorElement.getAttribute("x") || "0"),
                    y: parseFloat(connectorElement.getAttribute("y") || "0"),
                    type: connectorElement.getAttribute("type") || undefined,
                    // parent_id и info
                };
                connectors.push(connector);
            }

            const labelInfo = {
                text: label,
                color: (labelSettings && labelSettings.getAttribute("color")) || 'black',
                font: (labelSettings && labelSettings.getAttribute("font")) || '16px Arial',
                padding: 10,
            };
            let isEdgeDash: boolean = false

            // Валидация типа узла
            if (dialectName && dialect && dialectName !== "base") {
                if (dialect.validateNodeType(type)) {
                    const tmp_type: string = dialect.nodeTypes.get(type) || "";
                    type = tmp_type; // мудрено, но лучше так...
                } else {
                    throw new Error(`Тип узла "${type}" не разрешен в диалекте "${dialectName}"`);
                }
            }
            
            if(geometry){
                switch(type){
                    case 'circle': {                    
                        
                        const x = parseFloat(geometry.getAttribute("x") || "0");
                        const y = parseFloat(geometry.getAttribute("y") || "0");
                        const radius = parseFloat(geometry.getAttribute("radius") || "0");
                        const color = background.getAttribute("color") || "black";
                        if (edgeStyle) {
                            isEdgeDash = edgeStyle.getAttribute("isEdgeDash") === 'true' ? true : false;
                        }
                        const tmp_circle = new Graph.Circle({ id, type, x, y, radius, color, label_info: labelInfo, rotation, isEdgeDash, connectors, info } as Graph.ICircle);
                        graph_figures.push(tmp_circle);
                        graph.addNode(tmp_circle);
                        
                        //const attributes = {
                        //    id: node.getAttribute("id"),
                        //    //label: node.getAttribute("label"),
                        //    rotation: parseFloat(node.getAttribute("rotation") || "0"),
                        //    x: parseFloat(geometry.getAttribute("x") || "0"),
                        //    y:parseFloat(geometry.getAttribute("y") || "0"),
                        //    radius: parseFloat(geometry.getAttribute("radius") || "0"),
                        //    type: node.getAttribute("type")
                        //}
                        //const tmp_circle = new Graph.Circle(attributes as Graph.ICircle);

                        break;
                    }
                    case 'rectangle': {
                        const x = parseFloat(geometry.getAttribute("x") || "0");
                        const y = parseFloat(geometry.getAttribute("y") || "0");
                        const width = parseFloat(geometry.getAttribute("width") || "0");
                        const height = parseFloat(geometry.getAttribute("height") || "0");
                        const color = background.getAttribute("color") || "black";
                        if (edgeStyle) {
                            isEdgeDash = edgeStyle.getAttribute("isEdgeDash") === 'true' ? true : false;
                        }

                        const tmp_rect = new Graph.Rectangle({ id, type, x, y, width, height, color, label_info: labelInfo, rotation, isEdgeDash, connectors, info } as Graph.IRectangle);
                        graph_figures.push(tmp_rect);
                        graph.addNode(tmp_rect);
                        break;
                    }
                    case 'triangle': {
                        const x1 = parseFloat(geometry.getAttribute("x1") || "0");
                        const y1 = parseFloat(geometry.getAttribute("y1") || "0");
                        const x2 = parseFloat(geometry.getAttribute("x2") || "0");
                        const y2 = parseFloat(geometry.getAttribute("y2") || "0");
                        const x3 = parseFloat(geometry.getAttribute("x3") || "0");
                        const y3 = parseFloat(geometry.getAttribute("y3") || "0");
                        const color = background.getAttribute("color") || "black";
                        if (edgeStyle) {
                            isEdgeDash = edgeStyle.getAttribute("isEdgeDash") === 'true' ? true : false;
                        }

                        const tmp_tri = new Graph.Triangle({ id, rotation, type, x_1: x1, y_1: y1, x_2: x2, y_2: y2, x_3: x3, y_3: y3, color, label_info: labelInfo, isEdgeDash, connectors, info } as Graph.ITriangle);
                        graph_figures.push(tmp_tri);
                        graph.addNode(tmp_tri);
                        break;
                    }
                    case 'regular polygon': {
                        const x = parseFloat(geometry.getAttribute("x") || "0");
                        const y = parseFloat(geometry.getAttribute("y") || "0");
                        const radius = parseFloat(geometry.getAttribute("radius") || "0");
                        const number_of_edges = parseInt(geometry.getAttribute("number_of_edges") || "0", 10);
                        const color = background.getAttribute("color") || "";
                        if (edgeStyle) {
                            isEdgeDash = edgeStyle.getAttribute("isEdgeDash") === 'true' ? true : false;
                        }

                        const tmp_polygon = new Graph.RegularPolygon({ id, rotation, type, x, y, radius, number_of_edges, color, label_info: labelInfo, isEdgeDash, connectors, info } as Graph.IRegularPolygon);
                        graph_figures.push(tmp_polygon);
                        graph.addNode(tmp_polygon);
                        break;
                    }
                    case 'ellipse': {
                        const x = parseFloat(geometry.getAttribute("x") || "0");
                        const y = parseFloat(geometry.getAttribute("y") || "0");
                        const radius_x = parseFloat(geometry.getAttribute("radius_x") || "0");
                        const radius_y = parseFloat(geometry.getAttribute("radius_y") || "0");
                        const color = background.getAttribute("color") || "";
                        if (edgeStyle) {
                            isEdgeDash = edgeStyle.getAttribute("isEdgeDash") === 'true' ? true : false;
                        }

                        const tmp_ellipse = new Graph.Ellipse({ id, rotation, type, x, y, radius_x, radius_y, color, label_info: labelInfo, isEdgeDash, connectors, info } as Graph.IEllipse);
                        graph_figures.push(tmp_ellipse);
                        graph.addNode(tmp_ellipse);
                        break;
                    }
                    case 'rhomb': {
                        const x = parseFloat(geometry.getAttribute("x") || "0");
                        const y = parseFloat(geometry.getAttribute("y") || "0");
                        const width = parseFloat(geometry.getAttribute("width") || "0");
                        const height = parseFloat(geometry.getAttribute("height") || "0");
                        const color = background.getAttribute("color") || "";
                        if (edgeStyle) {
                            isEdgeDash = edgeStyle.getAttribute("isEdgeDash") === 'true' ? true : false;
                        }

                        const tmp_rhomb = new Graph.Rhombus({ id, rotation, type, x, y, width, height, color, label_info: labelInfo, isEdgeDash, connectors, info } as Graph.IRhombus);
                        graph_figures.push(tmp_rhomb);
                        graph.addNode(tmp_rhomb);
                        break;
                    }
                    default: {
                        const description = customDescriptions.get(type);
                        if (description) {
                            const xCenter = parseFloat(geometry.getAttribute("x_center") || "0");
                            const yCenter = parseFloat(geometry.getAttribute("y_center") || "0");
                            const color = background.getAttribute("color") || "";
                            if (edgeStyle) {
                                isEdgeDash = edgeStyle.getAttribute("isEdgeDash") === 'true' ? true : false;
                            }

                            const custom_info: Graph.ICustomShape = {
                                id,
                                type,
                                x_center: xCenter,
                                y_center: yCenter,
                                color,
                                label_info: labelInfo,
                                isEdgeDash,
                                connectors,
                                info
                            };

                            const tmp_custom = new Graph.CustomShape(custom_info, description);
                            graph_figures.push(tmp_custom);
                            graph.addNode(tmp_custom);

                        } else {
                            throw Error('Invalid type');
                        }
                        break;
                    }

                }
            }

        }

        const edges = xmlDoc.getElementsByTagName("edge");
        
        for (const edge of Array.from(edges)) {
            const id = edge.getAttribute("id") || "";
            let type = edge.getAttribute("type") || "";
            const label = edge.getAttribute("label") || "";
            const info = edge.getAttribute("info") || "";
            const rotation = parseFloat(edge.getAttribute("rotation") || "0");
            const geometry = edge.getElementsByTagName("geometry")[0] || edge.getElementsByTagName("lineGeometry")[0];
            const background = edge.getElementsByTagName("background")[0];
            const edgeStyle = edge.getElementsByTagName("edgeStyle")[0];
            let startArrow = edge.getAttribute("startArrow") || "none";
            let endArrow = edge.getAttribute("endArrow") || "none";

            let isEdgeDash: boolean = false;
            let is_corners_rounded: boolean = false;
            const internalPointElements = edge.getElementsByTagName("internalPoint"); 
            const internalPoints: Array<{ x: number; y: number }> = [];

            for (let i = 0; i < internalPointElements.length; i++) {
                const x = parseFloat(internalPointElements[i].getAttribute('x') || "0");
                const y = parseFloat(internalPointElements[i].getAttribute('y') || "0");
                internalPoints.push({ x, y });
            }

            const labelSettings = edge.getElementsByTagName("labelSettings")[0];
            const labelInfo = {
                text: label,
                color: (labelSettings && labelSettings.getAttribute("color")) || 'black',
                font: (labelSettings && labelSettings.getAttribute("font")) || '12px Arial',
                padding: 10,
            };

            // Валидация типа ребра
            if (dialectName && dialect && dialectName !== "base") {
                if (dialect.validateEdgeType(type)) {
                    const tmp_type: string = dialect.edgeTypes.get(type) || "";
                    type = tmp_type; // мудрено, но лучше так...
                } else {
                    throw new Error(`Тип ребра "${type}" не разрешен в диалекте "${dialectName}"`);
                }
            }

            // Валидация стрелок
            if (dialectName && dialect && dialectName !== "base") {
                if (startArrow !== "none") {
                    if (dialect.validateArrowheadType(startArrow)) {
                        const tmp_type: string = dialect.arrowheadTypes.get(startArrow) || "none";
                        startArrow = tmp_type;
                    } else {
                        throw new Error(`Тип стрелки "${startArrow}" не разрешен в диалекте "${dialectName}"`);
                    }
                }

                if (endArrow !== "none") {
                    if (dialect.validateArrowheadType(endArrow)) {
                        const tmp_type: string = dialect.arrowheadTypes.get(endArrow) || "none";
                        endArrow = tmp_type;
                    } else {
                        throw new Error(`Тип стрелки "${endArrow}" не разрешен в диалекте "${dialectName}"`);
                    }
                }
            }

            if (geometry) {
                switch (type) {
                    case 'line': {

                        const startX = parseFloat(geometry.getAttribute("startX") || "0");
                        const startY = parseFloat(geometry.getAttribute("startY") || "0");
                        const endX = parseFloat(geometry.getAttribute("endX") || "0");
                        const endY = parseFloat(geometry.getAttribute("endY") || "0");
                        const color = background.getAttribute("color") || "black";
                        const lineWidth = parseFloat(edgeStyle.getAttribute("lineWidth") || "1");
                        if (edgeStyle) {
                            isEdgeDash = edgeStyle.getAttribute("isEdgeDash") === 'true' ? true : false;
                            is_corners_rounded = edgeStyle.getAttribute("isRounded") === 'true' ? true : false;
                        }
                        const max_radius_of_corners = parseFloat(edgeStyle.getAttribute("maxRadiusOfCorners") || "7");

                        const tmp_line = new Graph.Line({ id, type, startX, startY, endX, endY, color, label_info: labelInfo, rotation, lineWidth, isEdgeDash, points: internalPoints, info, is_corners_rounded, max_radius_of_corners } as Graph.ILine, endArrow, startArrow);
                        graph_figures.push(tmp_line);
                        graph.addEdge(tmp_line);

                        break;
                    }
                    

                }
            }

        }

        //graph.draw_all_canvas(ctx);

        //-----------old format

        /*
        const figures: Shapes.DataShapes[] = [];

        for (const item of json_shapes) {
            switch (item.type) {
                case 'line': {
                    const tmp_line = new Shapes.Line(item as Shapes.ILine);
                    //tmp_line.draw_canvas(ctx);                    
                    figures.push(tmp_line);
                    //console.log('ddfd', figures[figures.length - 1].type);
                    //figures[figures.length - 1].draw_canvas(ctx);
                    break;
                }
                case 'circle': {                    
                    const tmp_circle = new Shapes.Circle(item as Shapes.ICircle);
                    //tmp_circle.draw_canvas(ctx);
                    figures.push(tmp_circle);

                    break;
                }
                case 'rectangle': {
                    const tmp_rect = new Shapes.Rectangle(item as Shapes.IRectangle)
                    //tmp_rect.draw_canvas(ctx);
                    figures.push(tmp_rect)
                    break;
                }
                case 'triangle': {
                    const tmp_tri = new Shapes.Triangle(item as Shapes.ITriangle)
                    //tmp_tri.draw_canvas(ctx);
                    figures.push(tmp_tri)
                    break;
                }
                case 'regular polygon': {
                    const tmp_reg_polygon = new Shapes.RegularPolygon(item as Shapes.IRegularPolygon)
                    //tmp_reg_polygon.draw_canvas(ctx);
                    figures.push(tmp_reg_polygon)
                    break;
                }
                default: {
                    const item_description = json_types.find((element) => {
                        return element.typeName === item.type;
                    });
                    //const index_type: number = json_types.findIndex(type =&gt; item.)
                    if (typeof item_description !== 'undefined') {
                        const tmp_custom = new Shapes.CustomShape(item as Shapes.ICustomShape, item_description)
                        //tmp_custom.draw_canvas(ctx);
                        figures.push(tmp_custom)
                    } else {
                        throw Error('Invalid type');
                    }                    
                    break;                    
                 }
            }
        }
        */


        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        //for (var fig of figures) {
        //    if (fig) {
        //        fig.draw_canvas(ctx)
        //    }
        //}

        const check_test = true;

        if (check_test) {
            Tests.test(ctx, graph, graph_figures);
        }

        graph.requestRedraw();

        var hoveredFig: Graph.DataShapes = null;
        var pre_hoveredFig: Graph.DataShapes = null;
        var clickedFig: Graph.DataShapes = null;
        var pre_clickedFig: Graph.DataShapes = null;

        const tooltip = document.getElementById('tooltip');

        canvas.addEventListener("mousemove", (event) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            pre_hoveredFig = hoveredFig;
            hoveredFig = null;

            for (let fig_index = graph_figures.length - 1; fig_index >= 0; fig_index--) {
                let fig = graph_figures[fig_index];
                if (fig!.is_inside(mouseX, mouseY)) {
                    hoveredFig = fig;
                    if (tooltip && hoveredFig?._info && hoveredFig?._info !== "") {
                        tooltip.textContent = hoveredFig?._info; // change to hoveredFig.info
                        tooltip.style.left = `${event.clientX + 10}px`;
                        tooltip.style.top = `${event.clientY + 10}px`;
                        tooltip.style.display = 'block';
                    }
                    break;
                }

            }

            if (!hoveredFig && tooltip) {
                tooltip.style.display = 'none';
            }

            if (hoveredFig !== pre_hoveredFig) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                for (var sh of graph_figures) {

                    if (sh) {

                        if (clickedFig === sh) {
                            sh.draw_clicked(ctx);
                        } else if (hoveredFig === sh) {
                            sh.draw_hovered(ctx);                           
                        } else {
                            sh.draw_canvas(ctx);
                        }
                    }

                }
            }
            

        });

        canvas.addEventListener("mousedown", function (event) {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            pre_clickedFig = clickedFig;
            clickedFig = null;

            // Collision detection between clicked offset and element.
            for (let fig_index = graph_figures.length - 1; fig_index >= 0; fig_index--) {
                let fig = graph_figures[fig_index];
                if (fig?._type == 'circle') {
                    if ((fig! as Graph.Circle).is_clicked(mouseX, mouseY)) {
                        clickedFig = fig;
                        break;
                    }
                    
                }else if (fig!.is_inside(mouseX, mouseY)) {
                    clickedFig = fig;
                    break;
                }
            }

            if (pre_clickedFig !== clickedFig) {

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                for (var sh of graph_figures) {
                    if (sh) {
                        if (clickedFig === sh) {
                            sh.draw_clicked(ctx);
                        } else {
                            sh.draw_canvas(ctx);
                        }
                    }
                }
            }           

        });


        //let objects = json_shapes.map((obj: any) => {
        //    if (obj.type === 'circle') {
        //        return obj as Shapes.Circle;
        //    } else if (obj.type === 'rectangle') {
        //        return obj as Shapes.Rectangle;
        //    } else if (obj.type === 'line') {
        //        return obj as Shapes.Line;
        //    } else if (obj.type === 'triangle') {
        //        return obj as Shapes.Triangle;
        //    } else if (obj.type === 'regular polygon') {
        //        return obj as Shapes.RegularPolygon;
        //    } else {
        //        throw new Error('Unknown shape type')
        //    }
        //});

        //const circle: Shapes.ICircle = { type: "circle", x: 250, y: 250, radius: 100, color: "blue" }

        //Shapes.draw_circle(ctx, circle)

        
    }

});
</script>

<style>
    .graph {
        /*background: aquamarine;*/
        background: #f5f5f5;
        /*background: #006cba;*/
    }
    .graph-container {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
    }
    #tooltip {
        position: absolute;
        background-color: rgba(0,0,0,0.7);
        color: white;
        padding: 5px;
        border-radius: 3px;
        display: none;
        pointer-events: none;
    }
</style>
