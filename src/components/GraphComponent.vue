<template>
    <canvas class="graph" ref="graphCanvas"></canvas>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue';
    import * as Shapes from './Shape';
    import * as Graph from './Graph';

    export default defineComponent({
        name: 'GraphComponent',
        props: {
            filePath: String,
            xmlData: String
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
            throw new Error('Ёлемент не €вл€етс€ HTMLCanvasElement');
        }

        const ctx = canvas.getContext("2d");


        if (!ctx) {
            throw new Error('Ќе удалось получить 2D контекст');
        }
        
        if (typeof this.filePath === 'undefined') {
            throw new Error('Ёлемент не €вл€етс€ string');
        }

        

        // ToDo: if .json

        // if .txt

        //const path = '!!raw-loader!' + this.filePath
        //console.log('Path:', path);
        //
        let txtStr = require(`!!raw-loader!./text.txt`).default;

        const split_text = this.splitStringIntoTwo(txtStr);

        //const json_size: Shapes.CanvasSize = JSON.parse(split_text[0]);

        const json_shapes: Shapes.DataFigure[] = JSON.parse("[" + split_text[1] + "]");

        const json_types: Shapes.ICustomDescription[] = JSON.parse("[" + split_text[2] + "]");

        //canvas.width = json_size.width;
        //canvas.height = json_size.height;
        
        if (typeof this.xmlData === 'undefined') {
            throw new Error('Ёлемент не €вл€етс€ string');
        }

        //console.log(this.xmlData);

        const xmlDoc = this.parseXML(this.xmlData);

        const canvasElement = xmlDoc.getElementsByTagName("canvas")[0];

        if (canvasElement) {
            const width = canvasElement.getAttribute("width");
            const height = canvasElement.getAttribute("height");
            canvas.width = width ? parseInt(width, 10) : 0;
            canvas.height = height ? parseInt(height, 10) : 0;
        }

        const graph: Graph.Graph = new Graph.Graph();

        const graph_figures: Graph.DataShapes[] = [];

        const nodes = xmlDoc.getElementsByTagName("node");

        // ѕолучение узлов описаний
        const descriptions = xmlDoc.getElementsByTagName("customDescription");

        const customDescriptions = new Map<string, Graph.ICustomDescription>(); // ’ранение описаний

        // ќбработка описаний
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

        //isEdgeDash fix

        for (const node of Array.from(nodes)) {
            const id = node.getAttribute("id") || "";
            const type = node.getAttribute("type") || "";
            const label = node.getAttribute("label") || "";
            const rotation = parseInt(node.getAttribute("rotation") || "0", 10);
            const geometry = node.getElementsByTagName("geometry")[0];
            const background = node.getElementsByTagName("background")[0];
            const isEdgeDash = node.getAttribute("isEdgeDash") === 'true' ? true : false;
            //const edgeStyle = node.getElementsByTagName("edgeStyle")[0];
            const labelSettings = node.getElementsByTagName("labelSettings")[0];
            const labelInfo = {
                text: label,
                color: labelSettings.getAttribute("color") || 'black',
                font: labelSettings.getAttribute("font") || '12px Arial',
                padding: 10,
            };

            
            if(geometry){
                switch(type){
                    case 'circle': {                    
                        
                        const x = parseFloat(geometry.getAttribute("x") || "0");
                        const y = parseFloat(geometry.getAttribute("y") || "0");
                        const radius = parseFloat(geometry.getAttribute("radius") || "0");
                        const color = background.getAttribute("color") || "black";

                        const tmp_circle = new Graph.Circle({ id, type, x, y, radius, color, label_info: labelInfo, rotation, isEdgeDash } as Graph.ICircle);
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

                        const tmp_rect = new Graph.Rectangle({ id, type, x, y, width, height, color, label_info: labelInfo, rotation, isEdgeDash } as Graph.IRectangle);
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

                        const tmp_tri = new Graph.Triangle({ id, rotation, type, x_1: x1, y_1: y1, x_2: x2, y_2: y2, x_3: x3, y_3: y3, color, label_info: labelInfo, isEdgeDash } as Graph.ITriangle);
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

                        const tmp_polygon = new Graph.RegularPolygon({ id, rotation, type, x, y, radius, number_of_edges, color, label_info: labelInfo, isEdgeDash } as Graph.IRegularPolygon);
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

                        const tmp_ellipse = new Graph.Ellipse({ id, rotation, type, x, y, radius_x, radius_y, color, label_info: labelInfo, isEdgeDash } as Graph.IEllipse);
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

                        const tmp_rhomb = new Graph.Rhombus({ id, rotation, type, x, y, width, height, color, label_info: labelInfo, isEdgeDash } as Graph.IRhombus);
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

                            const custom_info: Graph.ICustomShape = {
                                id,
                                type,
                                x_center: xCenter,
                                y_center: yCenter,
                                color,
                                label_info: labelInfo,
                                isEdgeDash,
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
        //console.log(xmlDoc)
        
        //console.log(edges)

        for (const edge of Array.from(edges)) {
            const id = edge.getAttribute("id") || "";
            const type = edge.getAttribute("type") || "";
            const label = edge.getAttribute("label") || "";
            const rotation = parseInt(edge.getAttribute("rotation") || "0", 10);
            const endArrow = edge.getAttribute("endArrow") || "";
            const startArrow = edge.getAttribute("startArrow") || "";
            const geometry = edge.getElementsByTagName("geometry")[0];
            const background = edge.getElementsByTagName("background")[0];
            const edgeStyle = edge.getElementsByTagName("edgeStyle")[0];
            const isEdgeDash = edge.getAttribute("isEdgeDash") === 'true' ? true : false;

            const labelSettings = edge.getElementsByTagName("labelSettings")[0];
            const labelInfo = {
                text: label,
                color: labelSettings.getAttribute("color") || 'black',
                font: labelSettings.getAttribute("font") || '12px Arial',
                padding: 10,
            };

            if (geometry) {
                switch (type) {
                    case 'line': {

                        const startX = parseFloat(geometry.getAttribute("startX") || "0");
                        const startY = parseFloat(geometry.getAttribute("startY") || "0");
                        const endX = parseFloat(geometry.getAttribute("endX") || "0");
                        const endY = parseFloat(geometry.getAttribute("endY") || "0");
                        const color = background.getAttribute("color") || "black";
                        const lineWidth = parseFloat(edgeStyle.getAttribute("lineWidth") || "1");

                        const tmp_line = new Graph.Line({ id, type, startX, startY, endX, endY, color, label_info: labelInfo, rotation, lineWidth, isEdgeDash } as Graph.ILine, startArrow, endArrow);
                        graph_figures.push(tmp_line);
                        graph.addEdge(tmp_line);

                        break;
                    }
                    

                }
            }

        }

        graph.draw_all_canvas(ctx);

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

        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        //for (var fig of figures) {
        //    if (fig) {
        //        fig.draw_canvas(ctx)
        //    }
        //}

        var hoveredFig: Graph.DataShapes = null;
        var clickedFig: Graph.DataShapes = null;

        canvas.addEventListener("mousemove", (event) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            hoveredFig = null;

            for (let fig_index = graph_figures.length - 1; fig_index >= 0; fig_index--) {
                let fig = graph_figures[fig_index];
                if (fig!.is_inside(mouseX, mouseY)) {
                    hoveredFig = fig;
                    break;
                }

            }

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

        });

        canvas.addEventListener("mousedown", function (event) {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            clickedFig = null;

            // Collision detection between clicked offset and element.
            for (let fig_index = graph_figures.length - 1; fig_index >= 0; fig_index--) {
                let fig = graph_figures[fig_index];
                if (fig!.is_inside(mouseX, mouseY)) {
                    clickedFig = fig;
                    //console.log('clicked', fig);
                    break;
                }
            }

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

        });

        const check_test = true;

        if (check_test) {
            //const line: Graph.ILine = { id: "efefef", type: "line", startX: 250, startY: 350, endX: 650, endY: 350, color: "purple", points: [{ x: 300, y: 300 }, { x: 350, y: 350 }, { x: 300, y: 400 }] }
            //const new_line = new Graph.Line(line, "none", "triangle")
            //new_line.draw_canvas(ctx);

            const label0: Graph.ILabel = { text: "Nod", color: 'gold', font: "14px Arial", padding: 10 }
            const circle: Graph.ICircle = { id: "sddddd", type: "circle", x: 350, y: 350, radius: 30, color: "blue", isEdgeDash: true, label_info: label0 }
            const new_circle = new Graph.Circle(circle);
            new_circle.draw_canvas(ctx)

            //const label: Graph.ILabel = { text: "Broken", color: 'black', font: "14px Arial", padding: 10, alignment: 'left' }
            //const line: Graph.ILine = { id: "efefef", type: "line", startX: 650, startY: 120, endX: 650, endY: 50, color: "purple", isEdgeDash: true, label_info: label, points: [{ x: 600, y: 80 }, {x: 600, y: 70}] }
            //const new_line = new Graph.Line(line, "none", "triangle", new_circle)
            //new_line.draw_canvas(ctx);

            //const label2: Graph.ILabel = { text: "Red", color: 'red', font: "18px Arial", padding: 10 }
            //const rectangle_data: Graph.IRectangle = { id: "reeeedddd", type: "rectangle", x: 550, y: 200, width: 100, height: 60, color: "green", label_info: label2 }
            //const new_rect = new Graph.Rectangle(rectangle_data);
            //new_rect.draw_canvas(ctx)

            const label3: Graph.ILabel = { text: "Triangle", color: 'white', font: "Bold 18px Arial", padding: 10 }
            const triangle_data: Graph.ITriangle = { id: "dsdvcdsvs", type: "triangle", x_1: 210, y_1: 210, x_2: 310, y_2: 300, x_3: 110, y_3: 350, isEdgeDash: true, color: "#621a6e", label_info: label3 }
            const new_tri = new Graph.Triangle(triangle_data);
            new_tri.draw_canvas(ctx)

            const label4: Graph.ILabel = { text: "Coding...", color: 'black', font: "14px Arial", padding: 10 }
            const poly_data: Graph.IRegularPolygon = { id: "wqmmmd", "type": "regular polygon", "x": 550, "y": 400, "radius": 80, "number_of_edges": 6, "color": "gold", isEdgeDash: true, "rotation": 0, "info": "text", label_info: label4 }
            const new_poly = new Graph.RegularPolygon(poly_data)
            new_poly.draw_canvas(ctx)

            const label5: Graph.ILabel = { text: "Sky is blue", color: 'black', font: "bold italic 14px Arial", padding: 10 }
            const cloud_descrip: Graph.ICustomDescription = {
                "typeName": "cloud", "points": [{ "x": 170, "y": 80 }, { "x": 230, "y": 150 }, { "x": 340, "y": 150 },
                { "x": 390, "y": 100 }, { "x": 340, "y": 50 }, { "x": 250, "y": 50 }, { "x": 170, "y": 80 }], "curve": [{ "isCurved": true, "cp1x": 130, "cp1y": 100, "cp2x": 130, "cp2y": 150 }, { "isCurved": true, "cp1x": 250, "cp1y": 180, "cp2x": 320, "cp2y": 180 },
                { "isCurved": true, "cp1x": 420, "cp1y": 150, "cp2x": 420, "cp2y": 120 }, { "isCurved": true, "cp1x": 430, "cp1y": 40, "cp2x": 310, "cp2y": 10 }, { "isCurved": true, "cp1x": 320, "cp1y": 5, "cp2x": 250, "cp2y": 20 }, { "isCurved": true, "cp1x": 200, "cp1y": 5, "cp2x": 150, "cp2y": 20 }]
            }
            const cloud_data: Graph.ICustomShape = { id: "cloud1111", "type": "cloud", "x_center": -75, "y_center": 365, "color": "white", isEdgeDash: true, label_info: label5 }
            const new_cloud = new Graph.CustomShape(cloud_data, cloud_descrip)
            new_cloud.draw_canvas(ctx);


            const label_new: Graph.ILabel = { text: "Nod", color: 'gold', font: "14px Arial", padding: 10 }
            const ellipse: Graph.IEllipse = { id: "eu3hei3nnjd", type: "ellipse", x: 400, y: 200, radius_x: 30, radius_y: 60, rotation: 30, color: "blue", isEdgeDash: true, label_info: label_new }
            const new_ellipse = new Graph.Ellipse(ellipse);
            new_ellipse.draw_canvas(ctx)

            const ellipse2: Graph.IEllipse = { id: "eu3hei3nnjd", type: "ellipse", x: 400, y: 200, radius_x: 30, radius_y: 60, rotation: 0 }
            const new_ellipse2 = new Graph.Ellipse(ellipse2);
            new_ellipse2.draw_canvas(ctx)

            const label_new2: Graph.ILabel = { text: "fix", font: "14px Arial", padding: 10 }
            const rhomb: Graph.IRhombus = { id: "meow1", type: "rhomb", x: 550, y: 200, width: 100, height: 60, rotation: 0, color: "green", isEdgeDash: true, label_info: label_new2 }
            const new_rhomb = new Graph.Rhombus(rhomb);
            new_rhomb.draw_canvas(ctx)

            const rect_data2: Graph.IRectangle = { id: "opal", type: "rectangle", x: 150, y: 100, width: 100, color: "red", height: 60, isEdgeDash: true }
            const new_rect = new Graph.Rectangle(rect_data2);
            new_rect.draw_canvas(ctx)
        }



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
</style>
