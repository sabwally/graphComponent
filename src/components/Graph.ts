export interface IShape {
    id: string
    type: string
    rotation?: number
    info?: string
    wasInside?: boolean
    //linewidth
    label_info?: ILabel

    //is edge puctir
    isEdgeDash?: boolean
}

export interface IRectangle extends IShape {
    x: number
    y: number
    width: number
    height: number
    color?: string
    //is edge puctir

    connectors?: Array<{ id: string; x: number; y: number }>;
}

export interface ICircle extends IShape {
    x: number
    y: number
    radius: number
    color?: string
    //is edge puctir

    connectors?: Array<{ id: string; x: number; y: number }>;
}

export interface IRhombus extends IShape {
    x: number
    y: number
    width: number
    height: number
    color?: string
    //is edge puctir

    connectors?: Array<{ id: string; x: number; y: number }>;
}

export interface IEllipse extends IShape {
    x: number
    y: number
    radius_x: number
    radius_y: number
    color?: string
    //is edge puctir

    connectors?: Array<{ id: string; x: number; y: number }>;
}

export interface ITriangle extends IShape {
    x_1: number
    y_1: number
    x_2: number
    y_2: number
    x_3: number
    y_3: number
    color?: string
    //is edge puctir

    connectors?: Array<{ id: string; x: number; y: number }>;
}

export interface IRegularPolygon extends IShape {
    radius: number
    number_of_edges: number
    x: number // center?
    y: number
    color?: string
    //is edge puctir

    connectors?: Array<{ id: string; x: number; y: number }>;
}

export interface ICustomDescription {
    typeName: string;
    points: Array<{ x: number; y: number }>;
    curve: Array<{ isCurved: boolean; cp1x: number; cp1y: number; cp2x: number; cp2y: number; }>;
    //is edge puctir

    connectors?: Array<{ id: string; x: number; y: number }>;
}

export interface ICustomShape extends IShape {
    x_center: number;
    y_center: number;
    color?: string
    //is edge puctir

    connectors?: Array<{ id: string; x: number; y: number }>;
}


export interface ILine extends IShape {
    startX: number
    startY: number
    endX: number
    endY: number
    color?: string
    //label_info?: ILabel
    lineWidth?: number

    points?: Array<{ x: number; y: number }>; //intermediate 
    // is puctir
}

// length ???
export interface ILabel {
    //id: string
    text: string
    startX?: number
    startY?: number
    endX?: number
    endY?: number
    color?: string
    font?: string

    padding?: number
    alignment?: string
}


// обновить
export type DataFigure = ILine | ICircle | IRectangle | ITriangle | IRegularPolygon | IShape | ICustomShape
export type DataShapes = Line | Circle | Rectangle | Triangle | RegularPolygon | CustomShape | Node | null

export class Graph {
    _nodes: Node[] = [];
    _edges: Edge[] = [];
    //labels: Label[] = []; // несвязанные с объектами
    //type: string//enum //для проверки и диалектов???
    //is_directed ???
    constructor(nodes?: Node[], edges?: Edge[]) {
        if (nodes) {
            this._nodes = nodes
        }
        if (edges) {
            this._edges = edges
        }
    }

    addNode(node: Node) {
        for (let i = 0; i < this._nodes.length; i++) {
            if (this._nodes[i]._id === node._id) {
                return
            }
        }
        this._nodes.push(node)
    }

    addEdge(edge: Edge) {
        for (let i = 0; i < this._edges.length; i++) {
            if (this._edges[i]._id === edge._id) {
                return
            }
        }
        this._edges.push(edge)
    }

    //get node
    //get edge

    //get "neigbors" node and edge

    //getOutputEdge
    //getInputEdge

    //delete node or edge

    draw_all_canvas(ctx: CanvasRenderingContext2D) {
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const node of this._nodes) {
            if (node) {
                node.draw_canvas(ctx)
            }
        }

        for (const edge of this._edges) {
            if (edge) {
                edge.draw_canvas(ctx)
            }
        }
    }

}

export abstract class Node {
    abstract _id: string;
    abstract _type: string;
    abstract _rotation?: number;
    abstract _color?: string;
    abstract _info?: string;
    abstract _wasInside: boolean;
    abstract _label_info?: ILabel;

    abstract _connectors?: Array<{ id: string; x: number; y: number }>; 

    abstract draw_canvas(ctx: CanvasRenderingContext2D): void;

    abstract draw_hovered(ctx: CanvasRenderingContext2D): void;

    abstract draw_clicked(ctx: CanvasRenderingContext2D): void;

    abstract is_inside(mouseX: number, mouseY: number): void;

    //abstract get id(): string;

    // create basic connectors
}

// rotation for label
export class Rectangle extends Node implements IRectangle  {
    _id: string;
    _type: string = 'rectangle';
    _rotation?: number = 0;
    _x: number;
    _y: number;
    _width: number;
    _height: number;
    _color?: string;
    _info?: string;
    _wasInside: boolean = false;

    _isEdgeDash: boolean = false;

    _label_info?: ILabel;
    _label?: Label;

    _connectors?: Array<{ id: string; x: number; y: number }>; 


    //constructor(x: number, y: number, width: number, height: number, color?: string, rotation?: number, info?: string) {
    constructor(rect: IRectangle) {
        super();
        this._id = rect.id
        //this.type = type
        if (typeof rect.rotation !== 'undefined') {
            this._rotation = rect.rotation
        }
        this._x = rect.x
        this._y = rect.y
        this._width = rect.width
        this._height = rect.height
        this._color = rect.color
        this._info = rect.info

        if (typeof rect.isEdgeDash !== 'undefined') {
            this._isEdgeDash = rect.isEdgeDash
        }

        if (typeof rect.connectors !== 'undefined') {
            this._connectors = rect.connectors.slice()
        }

        if (typeof rect.label_info !== 'undefined') {
            this._label_info = rect.label_info

            if (typeof this._label_info.startX === 'undefined') {
                this._label_info.startX = this._x
            }

            if (typeof this._label_info.startY === 'undefined') {
                this._label_info.startY = this._y + this._height / 2
            }

            if (typeof this._label_info.endX === 'undefined') {
                this._label_info.endX = this._x + this._width
            }

            if (typeof this._label_info.endY === 'undefined') {
                this._label_info.endY = this._y + this._height / 2
            }

            this._label = new Label(this._label_info)
        }
    }

    draw_canvas(ctx: CanvasRenderingContext2D) {
        if (!ctx) return;

        ctx.save();

        const radian = this.rotation! * Math.PI / 180;

        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(radian);

        if (this._isEdgeDash) {
            ctx.setLineDash([5, 3]); // Длина штриха и промежутка 
        }

        if (typeof this.color !== 'undefined' && this.color.length > 0) {
            ctx.fillStyle = this.color!;
            ctx.fillRect(this.width / 2 * (-1), this.height / 2 * (-1), this.width, this.height)
            ctx.strokeRect(this.width / 2 * (-1), this.height / 2 * (-1), this.width, this.height);

        } else {
            //ctx.setLineDash([6]); // future: dashed line
            ctx.strokeRect(this.width / 2 * (-1), this.height / 2 * (-1), this.width, this.height);
        }

        if (this._isEdgeDash) {
            ctx.setLineDash([]); // Сбрасываем пунктир 
        }

        ctx.restore();

        //for now
        if (typeof this._label !== 'undefined') {
            this._label.draw_canvas(ctx)
        }

    }

    draw_hovered(ctx: CanvasRenderingContext2D) {
        if (!ctx) return;

        ctx.save();

        const radian = this.rotation! * Math.PI / 180;

        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(radian);

        ctx.fillStyle = 'skyblue';
        ctx.fillRect(this.width / 2 * (-1), this.height / 2 * (-1), this.width, this.height)

        ctx.restore();

    }

    draw_clicked(ctx: CanvasRenderingContext2D) {
        if (!ctx) return;

        ctx.save();

        const radian = this.rotation! * Math.PI / 180;

        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(radian);

        ctx.fillStyle = '#b57281';
        ctx.fillRect(this.width / 2 * (-1), this.height / 2 * (-1), this.width, this.height)

        ctx.restore();
    }

    is_inside(mouseX: number, mouseY: number) {
        return (
            mouseX >= this.x &&
            mouseX <= this.x + this.width &&
            mouseY >= this.y &&
            mouseY <= this.y + this.height
        )
    }

    get type() {
        return this._type;
    }

    get rotation() {
        return this._rotation;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    get color() {
        return this._color;
    }

    get info() {
        return this._info;
    }

    get wasInside() {
        return this._wasInside;
    }

    get id() {
        return this._id;
    }

    get connectors() {
        return this._connectors;
    }
}

// rotation for label
export class Circle extends Node implements ICircle {
    _id: string;
    _type: string = 'circle';
    _rotation?: number;
    _x: number;
    _y: number;
    _radius: number;
    _color?: string;

    _isEdgeDash: boolean = false;

    _label_info?: ILabel;
    _label?: Label;

    _connectors?: Array<{ id: string; x: number; y: number }>; 

    _info?: string;
    _wasInside: boolean = false;

    //constructor(x: number, y: number, radius: number, color?: string, rotation?: number, info?: string) {
    constructor(circle: ICircle) {
        super();
        this._id = circle.id
        //this.type = type
        //if (type != 'circle') return;
        if (typeof circle.rotation !== 'undefined') {
            this._rotation = circle.rotation
        }
        this._x = circle.x
        this._y = circle.y
        this._radius = circle.radius
        this._color = circle.color
        this._info = circle.info

        if (typeof circle.isEdgeDash !== 'undefined') {
            this._isEdgeDash = circle.isEdgeDash
        }

        if (typeof circle.label_info !== 'undefined') {
            this._label_info = circle.label_info

            if (typeof this._label_info.startX === 'undefined') {
                this._label_info.startX = this._x - this._radius
            }

            if (typeof this._label_info.startY === 'undefined') {
                this._label_info.startY = this._y
            }

            if (typeof this._label_info.endX === 'undefined') {
                this._label_info.endX = this._x + this._radius
            }

            if (typeof this._label_info.endY === 'undefined') {
                this._label_info.endY = this._y
            }

            this._label = new Label(this._label_info)
        }
    }

    draw_canvas(ctx: CanvasRenderingContext2D) {
        if (!ctx) return;

        const radian = this.rotation! * Math.PI / 180;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(radian);

        if (this._isEdgeDash) {
            ctx.setLineDash([5, 3]);
        }

        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, 2 * Math.PI)
        ctx.stroke();
        if (typeof this.color !== 'undefined' && this.color.length > 0) {
            ctx.fillStyle = this.color!;
            ctx.fill();
        }
        ctx.closePath();

        if (this._isEdgeDash) {
            ctx.setLineDash([]);
        }
        ctx.restore();

        //for now
        if (typeof this._label !== 'undefined') {
            this._label.draw_canvas(ctx)
        }
    }

    draw_hovered(ctx: CanvasRenderingContext2D) {
        if (!ctx) return;

        const radian = this.rotation! * Math.PI / 180;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(radian);

        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, 2 * Math.PI)
        ctx.stroke();
        //if (typeof this.color !== 'undefined' && this.color.length > 0) {
        //    ctx.fillStyle = this.color!;
        //    ctx.fill();
        //}

        ctx.fillStyle = 'skyblue';
        ctx.fill();

        ctx.closePath();
        ctx.restore();
    }

    draw_clicked(ctx: CanvasRenderingContext2D) {
        if (!ctx) return;

        const radian = this.rotation! * Math.PI / 180;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(radian);

        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, 2 * Math.PI)
        ctx.stroke();
        //if (typeof this.color !== 'undefined' && this.color.length > 0) {
        //    ctx.fillStyle = this.color!;
        //    ctx.fill();
        //}

        ctx.fillStyle = '#b57281';
        ctx.fill();

        ctx.closePath();
        ctx.restore();
    }

    is_inside(mouseX: number, mouseY: number) {
        return (
            mouseX >= this.x - this.radius &&
            mouseX <= this.x + this.radius &&
            mouseY >= this.y - this.radius &&
            mouseY <= this.y + this.radius
        )
    }

    get id() {
        return this._id;
    }

    get type() {
        return this._type;
    }

    get rotation() {
        return this._rotation;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get radius() {
        return this._radius;
    }

    get color() {
        return this._color;
    }

    get info() {
        return this._info;
    }

    get wasInside() {
        return this._wasInside;
    }

    get connectors() {
        return this._connectors;
    }
}

// rotation for label
export class Ellipse extends Node implements IEllipse {
    _id: string;
    _type: string = 'ellipse';
    _rotation: number = 0;
    _x: number;
    _y: number;
    _radius_x: number;
    _radius_y: number;
    _color?: string;

    _isEdgeDash: boolean = false;

    _label_info?: ILabel;
    _label?: Label;

    _connectors?: Array<{ id: string; x: number; y: number }>;

    _info?: string;
    _wasInside: boolean = false;

    //constructor(x: number, y: number, radius: number, color?: string, rotation?: number, info?: string) {
    constructor(ellipse: IEllipse) {
        super();
        this._id = ellipse.id
        //this.type = type
        //if (type != 'ellipse') return;
        if (typeof ellipse.rotation !== 'undefined') {
            this._rotation = ellipse.rotation
        }
        this._x = ellipse.x
        this._y = ellipse.y
        this._radius_x = ellipse.radius_x
        this._radius_y = ellipse.radius_y
        this._color = ellipse.color
        this._info = ellipse.info

        if (typeof ellipse.isEdgeDash !== 'undefined') {
            this._isEdgeDash = ellipse.isEdgeDash
        }

        if (typeof ellipse.label_info !== 'undefined') {
            this._label_info = ellipse.label_info

            if (typeof this._label_info.startX === 'undefined') {
                this._label_info.startX = this._x - this._radius_x / 2
            }

            if (typeof this._label_info.startY === 'undefined') {
                this._label_info.startY = this._y
            }

            if (typeof this._label_info.endX === 'undefined') {
                this._label_info.endX = this._x + this._radius_x / 2
            }

            if (typeof this._label_info.endY === 'undefined') {
                this._label_info.endY = this._y
            }

            this._label = new Label(this._label_info)
        }
    }

    draw_canvas(ctx: CanvasRenderingContext2D) {
        if (!ctx) return;

        const radian = this.rotation! * Math.PI / 180;

        if (this._isEdgeDash) {
            ctx.setLineDash([5, 3]);
        }

        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.radius_x, this.radius_y, radian, 0, 2 * Math.PI);
        ctx.stroke();
        if (typeof this.color !== 'undefined' && this.color.length > 0) {
            ctx.fillStyle = this.color!;
            ctx.fill();
        }
        ctx.closePath();

        if (this._isEdgeDash) {
            ctx.setLineDash([]);
        }

        //for now
        if (typeof this._label !== 'undefined') {
            this._label.draw_canvas(ctx)
        }
    }

    draw_hovered(ctx: CanvasRenderingContext2D) {
        if (!ctx) return;

        const radian = this.rotation! * Math.PI / 180;

        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.radius_x, this.radius_y, radian, 0, 2 * Math.PI);
        ctx.stroke();
        //if (typeof this.color !== 'undefined' && this.color.length > 0) {
        //    ctx.fillStyle = this.color!;
        //    ctx.fill();
        //}

        ctx.fillStyle = 'skyblue';
        ctx.fill();

        ctx.closePath();
        ctx.restore();
    }

    draw_clicked(ctx: CanvasRenderingContext2D) {
        if (!ctx) return;

        const radian = this.rotation! * Math.PI / 180;

        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.radius_x, this.radius_y, radian, 0, 2 * Math.PI);
        ctx.stroke();
        //if (typeof this.color !== 'undefined' && this.color.length > 0) {
        //    ctx.fillStyle = this.color!;
        //    ctx.fill();
        //}

        ctx.fillStyle = '#b57281';
        ctx.fill();

        ctx.closePath();
        ctx.restore();
    }

    is_inside(mouseX: number, mouseY: number) {

        const radian = this.rotation * (Math.PI / 180)

        const x_rotated = (mouseX - this.x) * Math.cos(radian) + (mouseY - this.y) * Math.sin(radian)
        const y_rotated = -(mouseX - this.x) * Math.sin(radian) + (mouseY - this.y) * Math.cos(radian)

        return (x_rotated ** 2) / (this.radius_x ** 2) + (y_rotated ** 2) / (this.radius_y ** 2) <= 1
    }

    get id() {
        return this._id;
    }

    get type() {
        return this._type;
    }

    get rotation() {
        return this._rotation;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get radius_x() {
        return this._radius_x;
    }

    get radius_y() {
        return this._radius_y;
    }

    get color() {
        return this._color;
    }

    get info() {
        return this._info;
    }

    get wasInside() {
        return this._wasInside;
    }

    get connectors() {
        return this._connectors;
    }
}

// rotation for label
// is_inside fix
export class Rhombus extends Node implements IRhombus {
    _id: string;
    _type: string = 'rhombus';
    _rotation?: number = 0;
    _x: number;
    _y: number;
    _width: number;
    _height: number;
    _color?: string;
    _info?: string;
    _wasInside: boolean = false;

    _isEdgeDash: boolean = false;

    _label_info?: ILabel;
    _label?: Label;

    _connectors?: Array<{ id: string; x: number; y: number }>;

    constructor(rhomb: IRhombus) {
        super();
        this._id = rhomb.id
        //this.type = type
        if (typeof rhomb.rotation !== 'undefined') {
            this._rotation = rhomb.rotation
        }
        this._x = rhomb.x
        this._y = rhomb.y
        this._width = rhomb.width
        this._height = rhomb.height
        this._color = rhomb.color
        this._info = rhomb.info

        if (typeof rhomb.isEdgeDash !== 'undefined') {
            this._isEdgeDash = rhomb.isEdgeDash
        }

        if (typeof rhomb.connectors !== 'undefined') {
            this._connectors = rhomb.connectors.slice()
        }

        if (typeof rhomb.label_info !== 'undefined') {
            this._label_info = rhomb.label_info

            if (typeof this._label_info.startX === 'undefined') {
                this._label_info.startX = this._x - this._width / 2
            }

            if (typeof this._label_info.startY === 'undefined') {
                this._label_info.startY = this._y
            }

            if (typeof this._label_info.endX === 'undefined') {
                this._label_info.endX = this._x + this._width / 2
            }

            if (typeof this._label_info.endY === 'undefined') {
                this._label_info.endY = this._y
            }

            this._label = new Label(this._label_info)
        }
    }

    draw_canvas(ctx: CanvasRenderingContext2D) {
        if (!ctx) return;

        const radian = this.rotation! * Math.PI / 180;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(radian);

        ctx.beginPath();

        ctx.moveTo(0, - (this.height / 2));
        ctx.lineTo(this.width / 2, 0);
        ctx.lineTo(0, this.height / 2);
        ctx.lineTo(- (this.width / 2), 0);

        ctx.closePath();

        if (this._isEdgeDash) {
            ctx.setLineDash([5, 3]);
        }

        ctx.stroke();

        if (this._isEdgeDash) {
            ctx.setLineDash([]);
        }

        if (typeof this.color !== 'undefined' && this.color.length > 0) {
            ctx.fillStyle = this.color!;
            ctx.fill();
        }

        ctx.closePath();
        //ctx.lineWidth = 2;
        //ctx.strokeStyle = 'black';
        ctx.restore();

        //for now
        if (typeof this._label !== 'undefined') {
            this._label.draw_canvas(ctx)
        }

    }

    draw_hovered(ctx: CanvasRenderingContext2D) {
        if (!ctx) return;

        const radian = this.rotation! * Math.PI / 180;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(radian);

        ctx.beginPath();

        ctx.moveTo(0, - (this.height / 2));
        ctx.lineTo(this.width / 2, 0);
        ctx.lineTo(0, this.height / 2);
        ctx.lineTo(- (this.width / 2), 0);

        ctx.closePath();

        if (this._isEdgeDash) {
            ctx.setLineDash([5, 3]);
        }

        ctx.stroke();

        if (this._isEdgeDash) {
            ctx.setLineDash([]);
        }

        ctx.fillStyle = 'skyblue';

        ctx.fill();
        

        ctx.closePath();
        //ctx.lineWidth = 2;
        //ctx.strokeStyle = 'black';
        ctx.restore();

        //for now
        if (typeof this._label !== 'undefined') {
            this._label.draw_canvas(ctx)
        }

    }

    draw_clicked(ctx: CanvasRenderingContext2D) {
        if (!ctx) return;

        const radian = this.rotation! * Math.PI / 180;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(radian);

        ctx.beginPath();

        ctx.moveTo(0, - (this.height / 2));
        ctx.lineTo(this.width / 2, 0);
        ctx.lineTo(0, this.height / 2);
        ctx.lineTo(- (this.width / 2), 0);

        ctx.closePath();

        if (this._isEdgeDash) {
            ctx.setLineDash([5, 3]);
        }

        ctx.stroke();

        if (this._isEdgeDash) {
            ctx.setLineDash([]);
        }

        ctx.fillStyle = '#b57281';

        ctx.fill();

        ctx.closePath();
        ctx.restore();

        //for now
        if (typeof this._label !== 'undefined') {
            this._label.draw_canvas(ctx)
        }
    }

    is_inside(mouseX: number, mouseY: number) {
        return (
            mouseX >= this.x - this.width / 2 &&
            mouseX <= this.x + this.width / 2 &&
            mouseY >= this.y - this.height / 2 &&
            mouseY <= this.y + this.height / 2
        )
    }

    get type() {
        return this._type;
    }

    get rotation() {
        return this._rotation;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    get color() {
        return this._color;
    }

    get info() {
        return this._info;
    }

    get wasInside() {
        return this._wasInside;
    }

    get id() {
        return this._id;
    }

    get connectors() {
        return this._connectors;
    }
}

//rotation
export class Triangle extends Node implements ITriangle {
    _id: string;
    _type: string = 'triangle';
    _rotation?: number;
    _x_1: number
    _y_1: number
    _x_2: number
    _y_2: number
    _x_3: number
    _y_3: number
    _color?: string;

    _isEdgeDash: boolean = false;

    _label_info?: ILabel;
    _label?: Label;

    _connectors?: Array<{ id: string; x: number; y: number }>; 

    _info?: string;
    _wasInside: boolean = false;

    //constructor(x_1: number, y_1: number, x_2: number, y_2: number, x_3: number, y_3: number, color?: string, rotation?: number, info?: string) {
    constructor(triangle: ITriangle) {
        super();
        this._id = triangle.id
        //this.type = type
        //if (type != 'circle') return;
        if (typeof triangle.rotation !== 'undefined') {
            this._rotation = triangle.rotation
        }
        this._x_1 = triangle.x_1
        this._y_1 = triangle.y_1
        this._x_2 = triangle.x_2
        this._y_2 = triangle.y_2
        this._x_3 = triangle.x_3
        this._y_3 = triangle.y_3
        this._color = triangle.color
        this._info = triangle.info

        if (typeof triangle.isEdgeDash !== 'undefined') {
            this._isEdgeDash = triangle.isEdgeDash
        }

        if (typeof triangle.label_info !== 'undefined') {
            this._label_info = triangle.label_info

            const x_center = (this._x_1 + this._x_2 + this._x_3) / 3;
            const y_center = (this._y_1 + this._y_2 + this._y_3) / 3;

            const length = 10

            if (typeof this._label_info.startX === 'undefined') {
                this._label_info.startX = x_center - length
            }

            if (typeof this._label_info.startY === 'undefined') {
                this._label_info.startY = y_center
            }

            if (typeof this._label_info.endX === 'undefined') {
                this._label_info.endX = x_center + length
            }

            if (typeof this._label_info.endY === 'undefined') {
                this._label_info.endY = y_center
            }

            this._label = new Label(this._label_info)
        }
    }

    // TODO: ROTATION
    draw_canvas(ctx: CanvasRenderingContext2D) {
        if (!ctx) return;

        const radian = this.rotation! * Math.PI / 180;

        //ctx.save();
        //ctx.translate(this.x_1, this.y_1);
        //ctx.rotate(radian);

        ctx.beginPath();

        ctx.moveTo(this.x_1, this.y_1);
        ctx.lineTo(this.x_2, this.y_2);
        ctx.lineTo(this.x_3, this.y_3);

        ctx.closePath();

        // the outline
        //ctx.lineJoin = "round";
        //ctx.lineWidth = 10;
        //ctx.strokeStyle = '#666666';

        if (this._isEdgeDash) {
            ctx.setLineDash([5, 3]);
        }

        ctx.stroke();

        if (this._isEdgeDash) {
            ctx.setLineDash([]);
        }

        if (typeof this.color !== 'undefined' && this.color.length > 0) {
            ctx.fillStyle = this.color!;
            ctx.fill();
        }

        //ctx.restore();

        //for now
        if (typeof this._label !== 'undefined') {
            this._label.draw_canvas(ctx)
        }
    }

    draw_hovered(ctx: CanvasRenderingContext2D) {
        if (!ctx) return;

        const radian = this.rotation! * Math.PI / 180;

        //ctx.save();
        //ctx.translate(this.x_1, this.y_1);
        //ctx.rotate(radian);

        ctx.beginPath();

        ctx.moveTo(this.x_1, this.y_1);
        ctx.lineTo(this.x_2, this.y_2);
        ctx.lineTo(this.x_3, this.y_3);
        ctx.closePath();

        // the outline
        //ctx.lineJoin = "round";
        //ctx.lineWidth = 10;
        //ctx.strokeStyle = '#666666';
        ctx.stroke();

        ctx.fillStyle = 'skyblue';
        ctx.fill();


        //ctx.restore();
    }

    draw_clicked(ctx: CanvasRenderingContext2D) {
        if (!ctx) return;

        const radian = this.rotation! * Math.PI / 180;

        //ctx.save();
        //ctx.translate(this.x_1, this.y_1);
        //ctx.rotate(radian);

        ctx.beginPath();

        ctx.moveTo(this.x_1, this.y_1);
        ctx.lineTo(this.x_2, this.y_2);
        ctx.lineTo(this.x_3, this.y_3);
        ctx.closePath();

        // the outline
        //ctx.lineJoin = "round";
        //ctx.lineWidth = 10;
        //ctx.strokeStyle = '#666666';
        ctx.stroke();

        ctx.fillStyle = '#b57281';
        ctx.fill();
    }


    is_inside(mouseX: number, mouseY: number) {
        /* Calculate area of triangle ABC */
        const area_A = this.area_of_shape(this.x_1, this.y_1, this.x_2, this.y_2, this.x_3, this.y_3)

        /* Calculate area of triangle PBC */
        const area_A1 = this.area_of_shape(mouseX, mouseY, this.x_2, this.y_2, this.x_3, this.y_3)

        /* Calculate area of triangle PAC */
        const area_A2 = this.area_of_shape(this.x_1, this.y_1, mouseX, mouseY, this.x_3, this.y_3)

        /* Calculate area of triangle PAB */
        const area_A3 = this.area_of_shape(this.x_1, this.y_1, this.x_2, this.y_2, mouseX, mouseY)

        /* Check if sum of A1, A2 and A3 is same as A */
        return (area_A == area_A1 + area_A2 + area_A3);
    }

    area_of_shape(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
        return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0);
    }

    get id() {
        return this._id;
    }

    get type() {
        return this._type;
    }

    get rotation() {
        return this._rotation;
    }

    get x_1() {
        return this._x_1;
    }

    get y_1() {
        return this._y_1;
    }

    get x_2() {
        return this._x_2;
    }

    get y_2() {
        return this._y_2;
    }

    get x_3() {
        return this._x_3;
    }

    get y_3() {
        return this._y_3;
    }

    get color() {
        return this._color;
    }

    get info() {
        return this._info;
    }

    get wasInside() {
        return this._wasInside;
    }

    get connectors() {
        return this._connectors;
    }
}

export class RegularPolygon extends Node implements IRegularPolygon {
    _id: string;
    _type: string = 'regular polygon';
    _rotation?: number = 0;
    _number_of_edges: number
    _x: number
    _y: number
    _radius: number;
    _color?: string;

    _isEdgeDash: boolean = false;

    _label_info?: ILabel;
    _label?: Label;

    _connectors?: Array<{ id: string; x: number; y: number }>; 


    _info?: string;
    _wasInside: boolean = false;
    points: Array<{ x: number; y: number }> = [];

    //constructor(number_of_edges: number, x: number, y: number, radius: number, color?: string, rotation?: number, info?: string) {
    constructor(polygon: IRegularPolygon) {
        super();
        this._id = polygon.id
        //this.type = type
        //if (type != 'circle') return;
        if (typeof polygon.rotation !== 'undefined') {
            this._rotation = polygon.rotation
        }
        this._number_of_edges = polygon.number_of_edges
        this._x = polygon.x
        this._y = polygon.y
        this._radius = polygon.radius
        this._color = polygon.color
        this._info = polygon.info

        if (typeof polygon.isEdgeDash !== 'undefined') {
            this._isEdgeDash = polygon.isEdgeDash
        }

        if (typeof polygon.label_info !== 'undefined') {
            this._label_info = polygon.label_info

            //const length = 10

            if (typeof this._label_info.startX === 'undefined') {
                this._label_info.startX = this._x - this._radius
            }

            if (typeof this._label_info.startY === 'undefined') {
                this._label_info.startY = this._y
            }

            if (typeof this._label_info.endX === 'undefined') {
                this._label_info.endX = this._x + this._radius
            }

            if (typeof this._label_info.endY === 'undefined') {
                this._label_info.endY = this._y
            }

            this._label = new Label(this._label_info)
        }

        const radian = this.rotation! * Math.PI / 180;

        this.points.push({ x: (this.x + this.radius * Math.cos(0 + radian)), y: this.y + this.radius * Math.sin(0 + radian) })

        for (let i = 1; i <= this.number_of_edges; i += 1) {
            this.points.push({ x: (this.x + this.radius * Math.cos(i * 2 * Math.PI / this.number_of_edges + radian)), y: this.y + this.radius * Math.sin(i * 2 * Math.PI / this.number_of_edges + radian) })
        }
    }

    draw_canvas(ctx: CanvasRenderingContext2D) {
        if (!ctx) return;

        ctx.save();
        //const radian = this.rotation! * Math.PI / 180;
        //ctx.translate(this.x, this.y);
        //ctx.rotate(radian);
         
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);

        for (let i = 1; i <= this.number_of_edges; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }

        //ctx.strokeStyle = "#000000";
        //ctx.lineWidth = 1;

        if (typeof this.color !== 'undefined' && this.color.length > 0) {
            ctx.fillStyle = this.color!;
            ctx.fill();
        }

        ctx.closePath();

        if (this._isEdgeDash) {
            ctx.setLineDash([5, 3]);
        }

        ctx.stroke();

        if (this._isEdgeDash) {
            ctx.setLineDash([]);
        }

        ctx.restore();

        //for now
        if (typeof this._label !== 'undefined') {
            this._label.draw_canvas(ctx)
        }
    }

    draw_hovered(ctx: CanvasRenderingContext2D) {
        if (!ctx) return;

        ctx.save();

        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);

        for (let i = 1; i <= this.number_of_edges; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }

        //ctx.strokeStyle = "#000000";
        //ctx.lineWidth = 1;

        ctx.fillStyle = 'skyblue';
        ctx.fill();

        ctx.stroke();

        ctx.closePath();

        ctx.restore();
    }

    draw_clicked(ctx: CanvasRenderingContext2D) {
        if (!ctx) return;

        ctx.save();

        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);

        for (let i = 1; i <= this.number_of_edges; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }

        //ctx.strokeStyle = "#000000";
        //ctx.lineWidth = 1;

        ctx.fillStyle = '#b57281';
        ctx.fill();

        ctx.stroke();

        ctx.closePath();

        ctx.restore();
    }

    //TODO:
    is_inside(mouseX: number, mouseY: number) {
        //const points: Array<{ x: number; y: number }> = [];

        //points.push({ x: (this.x + this.radius * Math.cos(0)), y: this.y + this.radius * Math.sin(0) })

        //for (let i = 1; i <= this.number_of_edges; i += 1) {
        //    points.push({ x: (this.x + this.radius * Math.cos(i * 2 * Math.PI / this.number_of_edges)), y: this.y + this.radius * Math.sin(i * 2 * Math.PI / this.number_of_edges) })
        //}

        let res: boolean = false;
        let j = this.number_of_edges - 1;
        for (let i = 0; i < this.number_of_edges; i++) {
            if ((this.points[i].y < mouseY && this.points[j].y >= mouseY || this.points[j].y < mouseY && this.points[i].y >= mouseY) &&
                (this.points[i].x + (mouseY - this.points[i].y) / (this.points[j].y - this.points[i].y) * (this.points[j].x - this.points[i].x) < mouseX)) {
                res = !res;
            }
            j = i
        }

        return res;
    }

    get id() {
        return this._id;
    }
    get type() {
        return this._type;
    }

    get rotation() {
        return this._rotation;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }
    get number_of_edges() {
        return this._number_of_edges;
    }

    get radius() {
        return this._radius;
    }

    get color() {
        return this._color;
    }

    get info() {
        return this._info;
    }

    get wasInside() {
        return this._wasInside;
    }

    get connectors() {
        return this._connectors;
    }
}

//rotation
//scale
export class CustomShape extends Node implements IShape {
    _id: string;
    _type: string;
    _rotation?: number;
    _x_center: number; // отсчёт координат
    _y_center: number;
    points: Array<{ x: number; y: number }> = [];
    curve: Array<{ isCurved: boolean; cp1x: number; cp1y: number; cp2x: number; cp2y: number; }> = [];

    _isEdgeDash: boolean = false;

    _label_info?: ILabel;
    _label?: Label;

    _connectors?: Array<{ id: string; x: number; y: number }>; 

    _color?: string;
    _info?: string;
    _wasInside: boolean = false;
    _scale: number;


    constructor(custom: ICustomShape, description: ICustomDescription) {
        super();
        this._id = custom.id
        //if (custom.type != description.typeName) return;
        this._type = description.typeName

        if (typeof custom.rotation !== 'undefined') {
            this._rotation = custom.rotation
        }
        this._color = custom.color
        this._info = custom.info
        this._x_center = custom.x_center
        this._y_center = custom.y_center
        this.points = description.points.slice()

        if (typeof custom.isEdgeDash !== 'undefined') {
            this._isEdgeDash = custom.isEdgeDash
        }

        // check length points == curve
        this.curve = description.curve.slice()

        this._scale = 1;

        if (typeof custom.label_info !== 'undefined') {
            this._label_info = custom.label_info

            let x_sum = 0;
            let y_sum = 0;

            // Суммируем координаты всех точек
            this.points.forEach(point => {
                x_sum += point.x;
                y_sum += point.y;
            });

            // Находим среднее значение
            const x_center = this.x_center + x_sum / this.points.length;
            const y_center = this.y_center + y_sum / this.points.length;

            const length = 10

            if (typeof this._label_info.startX === 'undefined') {
                this._label_info.startX = x_center - length
            }

            if (typeof this._label_info.startY === 'undefined') {
                this._label_info.startY = y_center
            }

            if (typeof this._label_info.endX === 'undefined') {
                this._label_info.endX = x_center + length
            }

            if (typeof this._label_info.endY === 'undefined') {
                this._label_info.endY = y_center
            }

            this._label = new Label(this._label_info)
        }
    }



    draw_canvas(ctx: CanvasRenderingContext2D) {
        if (!ctx) return;
        ctx.save();

        ctx.translate(this.x_center, this.y_center);
        //ctx.rotate(radian);

        ctx.beginPath();

        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            //if (typeof this.curve[i - 1].cp1x !== 'undefined' && typeof this.curve[i - 1].cp1y !== 'undefined' && typeof this.curve[i - 1].cp2x !== 'undefined' && typeof this.curve[i - 1].cp2y !== 'undefined')
            if (this.curve[i - 1].isCurved) {
                ctx.bezierCurveTo(this.curve[i - 1].cp1x, this.curve[i - 1].cp1y, this.curve[i - 1].cp2x, this.curve[i - 1].cp2y, this.points[i].x, this.points[i].y);
            } else {
                ctx.lineTo(this.points[i].x, this.points[i].y);
            }
        }
        ctx.closePath();

        //ctx.lineWidth = 5;

        if (typeof this.color !== 'undefined' && this.color.length > 0) {
            ctx.fillStyle = this.color!;
            ctx.fill();
        }

        //ctx.strokeStyle = '#0000ff';

        if (this._isEdgeDash) {
            ctx.setLineDash([5, 3]);
        }

        ctx.stroke();

        if (this._isEdgeDash) {
            ctx.setLineDash([]);
        }

        ctx.restore();

        //for now
        if (typeof this._label !== 'undefined') {
            this._label.draw_canvas(ctx)
        }
    }

    draw_hovered(ctx: CanvasRenderingContext2D) {
        if (!ctx) return;

    }

    draw_clicked(ctx: CanvasRenderingContext2D) {
        if (!ctx) return;

    }

    //TODO:
    is_inside(mouseX: number, mouseY: number) {
        return (false
            //mouseX >= this.x - this.radius &&
            //mouseX <= this.x + this.radius &&
            //mouseY >= this.y - this.radius &&
            //mouseY <= this.y + this.radius
        )
    }

    get id() {
        return this._id;
    }

    get type() {
        return this._type;
    }

    get rotation() {
        return this._rotation;
    }

    get x_center() {
        return this._x_center;
    }

    get y_center() {
        return this._y_center;
    }

    get color() {
        return this._color;
    }
    get scale() {
        return this._scale;
    }

    get info() {
        return this._info;
    }

    get wasInside() {
        return this._wasInside;
    }

    get connectors() {
        return this._connectors;
    }
}


export abstract class Edge {
    abstract _id: string;
    abstract _type: string;

    abstract _color?: string;
    abstract _info?: string;
    abstract _wasInside: boolean;

    // id_target???
    abstract _target?: Node;
    abstract _source?: Node;

    abstract _startX: number;
    abstract _startY: number;
    abstract _endX: number;
    abstract _endY: number;

    abstract _lineWidth?: number;

    abstract _points?: Array<{ x: number; y: number }>; 

    abstract draw_canvas(ctx: CanvasRenderingContext2D): void;

    abstract draw_hovered(ctx: CanvasRenderingContext2D): void;

    abstract draw_clicked(ctx: CanvasRenderingContext2D): void;

    abstract is_inside(mouseX: number, mouseY: number): void;

    //abstract get id(): string;

}


// убрать rotation
// или оставить поворот --- из-за промежуточных
// нормально прикрепить расчёт привязки лейбла
export class Line extends Edge implements ILine {
    _id: string;
    _type: string = 'line';
    _rotation?: number = 0;
    _startX: number;
    _startY: number;
    _endX: number ;
    _endY: number;
    _color?: string;
    _lineWidth?: number;

    _isEdgeDash: boolean = false;

    _label_info?: ILabel;
    _label?: Label;

    _info?: string;
    _wasInside: boolean = false;

    _points?: Array<{ x: number; y: number }>; //intermediate 
    

    // id_target???
    _target?: Node;
    _source?: Node;

    // for now
    _endArrow?: ArrowHead;
    _startArrow?: ArrowHead;


    //constructor(startX: number, startY: number, endX: number, endY: number, color?: string, rotation?: number, label?: string | null, info?: string) {
    constructor(line: ILine, endArrow?: string, startArrow?: string, target?: Node, source?: Node) {
        super();

        this._id = line.id
        //this.type = type
        //if (type != 'line') return;

        if (typeof line.rotation !== 'undefined') {
            this._rotation = line.rotation
        }
        this._startX = line.startX
        this._startY = line.startY
        this._endX = line.endX
        this._endY = line.endY
        this._color = line.color

        if (typeof line.isEdgeDash !== 'undefined') {
            this._isEdgeDash = line.isEdgeDash
        }

        if (typeof line.points !== 'undefined') {
            this._points = line.points.slice()
        }

        // сделать рассчёты точек
        // делать отступ взависимости от высоты/длины стрелки
        if (typeof line.label_info !== 'undefined') {
            this._label_info = line.label_info

            if (typeof this._label_info.startX === 'undefined') {
                this._label_info.startX = this._startX
            }

            if (typeof this._label_info.startY === 'undefined') {
                this._label_info.startY = this._startY
            } 

            if (typeof this._label_info.endX === 'undefined') {
                this._label_info.endX = this._endX
            } 

            if (typeof this._label_info.endY === 'undefined') {
                this._label_info.endY = this._endY
            }

            this._label = new Label(this._label_info) 
        }

        this._info = line.info

        if (typeof line.lineWidth !== 'undefined') {
            this._lineWidth = line.lineWidth
        }

        // обработать отсутствие/наличие Вершин/координат

        if (typeof target !== 'undefined') {
            this._target = target
        }

        if (typeof source !== 'undefined') {
            this._source = source
        }

        //for now
        if (endArrow === 'triangle') {
            this._endArrow = new TriangleArrowHead('end', this, this.color);
        }
        if (startArrow === 'triangle') {
            this._startArrow = new TriangleArrowHead('start', this, this.color);
        }

    }

    draw_canvas(ctx: CanvasRenderingContext2D) {
        if (!ctx) return;

        const radian = this.rotation! * Math.PI / 180;
        const centerX = (this.startX + this.endX) / 2;
        const centerY = (this.startY + this.endY) / 2;

        ctx.save();

        ctx.translate(centerX, centerY);
        ctx.rotate(radian);

        ctx.beginPath();
        ctx.moveTo(-((this.endX - this.startX) / 2), -((this.endY - this.startY) / 2));

        //rotation FIX
        if (typeof this.points !== 'undefined') {
            for (let i = 0; i < this.points.length; i++) {
                const deltaX = this.points[i].x - centerX;
                const deltaY = this.points[i].y - centerY;
                //const newX = deltaX * Math.cos(radian) - deltaY * Math.sin(radian);
                //const newY = deltaX * Math.sin(radian) + deltaY * Math.cos(radian);
                //ctx.lineTo(newX, newY);
                ctx.lineTo(deltaX, deltaY);
            }
        }

        ctx.lineTo(((this.endX - this.startX) / 2), ((this.endY - this.startY) / 2));

        if (typeof this.lineWidth !== 'undefined') {
            ctx.lineWidth = this.lineWidth;
        }

        if (typeof this.color !== 'undefined' && this.color.length > 0) {
            ctx.strokeStyle = this.color!;
        }

        if (this._isEdgeDash) {
            ctx.setLineDash([5, 3]);
        }

        ctx.stroke();
        ctx.closePath();

        if (this._isEdgeDash) {
            ctx.setLineDash([]);
        }

        //ctx.strokeStyle = '#0000ff';

        ctx.restore();

        //for now

        if (typeof this._endArrow !== 'undefined') {
            this._endArrow.draw_canvas(ctx)
        }

        if (typeof this._startArrow !== 'undefined') {
            this._startArrow.draw_canvas(ctx)
        }

        

        if (typeof this._label !== 'undefined') {
            this._label.draw_canvas(ctx)
        }
    }

    draw_hovered(ctx: CanvasRenderingContext2D) {
        if (!ctx) return;
        const radian = this.rotation! * Math.PI / 180;
        const centerX = (this.startX + this.endX) / 2;
        const centerY = (this.startY + this.endY) / 2;

        ctx.save();

        ctx.translate(centerX, centerY);
        ctx.rotate(radian);

        ctx.beginPath();
        ctx.moveTo(-((this.endX - this.startX) / 2), -((this.endY - this.startY) / 2));
        // без поворота
        if (typeof this.points !== 'undefined') {
            for (let i = 0; i < this.points.length; i++) {
                ctx.lineTo(this.points[i].x, this.points[i].y);
            }
        }
        ctx.lineTo(((this.endX - this.startX) / 2), ((this.endY - this.startY) / 2));
        if (typeof this.lineWidth !== 'undefined') {
            ctx.lineWidth = this.lineWidth;
        }
        //if (typeof this.color !== 'undefined' && this.color.length > 0) {
        ctx.strokeStyle = 'gold';
        //}
        ctx.stroke();
        ctx.closePath();

        ctx.restore();
    }

    draw_clicked(ctx: CanvasRenderingContext2D) {
        if (!ctx) return;
        const radian = this.rotation! * Math.PI / 180;
        const centerX = (this.startX + this.endX) / 2;
        const centerY = (this.startY + this.endY) / 2;

        ctx.save();

        ctx.translate(centerX, centerY);
        ctx.rotate(radian);

        ctx.beginPath();
        ctx.moveTo(-((this.endX - this.startX) / 2), -((this.endY - this.startY) / 2));
        // без поворота
        if (typeof this.points !== 'undefined') {
            for (let i = 0; i < this.points.length; i++) {
                ctx.lineTo(this.points[i].x, this.points[i].y);
            }
        }
        ctx.lineTo(((this.endX - this.startX) / 2), ((this.endY - this.startY) / 2));
        if (typeof this.lineWidth !== 'undefined') {
            ctx.lineWidth = this.lineWidth;
        }
        //if (typeof this.color !== 'undefined' && this.color.length > 0) {
        ctx.strokeStyle = '#b57281';
        //}
        ctx.stroke();
        ctx.closePath();

        ctx.restore();
    }

    //TODO:
    is_inside(mouseX: number, mouseY: number) {
        const dx = this.endX - this.startX,
            dy = this.endY - this.startY,
            ds = this.startX * this.endY - this.endX * this.startY;

        return (mouseX * dy - mouseY * dx === ds)

        //return (mouseX * (this.endY - this.startY) - mouseY * (this.endX - this.startX) === this.startX * this.endY - this.endX * this.startY)
    }

    get id() {
        return this._id;
    }

    get type() {
        return this._type;
    }

    get rotation() {
        return this._rotation;
    }

    get startX() {
        return this._startX;
    }

    get startY() {
        return this._startY;
    }

    get endX() {
        return this._endX;
    }

    get endY() {
        return this._endY;
    }

    get color() {
        return this._color;
    }

    get lineWidth() {
        return this._lineWidth;
    }

    get label() {
        return this._label;
    }

    get points() {
        return this._points;
    }

    get info() {
        return this._info;
    }

    get wasInside() {
        return this._wasInside;
    }
}


export abstract class ArrowHead {
    
    abstract _type: string;

    abstract _color?: string;
    
    abstract _wasInside: boolean;

    //abstract _length: number;

    abstract _position: string;

    // id_edge???
    abstract _edge: Edge;

    //abstract _scale?: number;

    abstract draw_canvas(ctx: CanvasRenderingContext2D): void;

    abstract draw_hovered(ctx: CanvasRenderingContext2D): void;

    abstract draw_clicked(ctx: CanvasRenderingContext2D): void;

    abstract is_inside(mouseX: number, mouseY: number): void;
}


export class TriangleArrowHead extends ArrowHead {
    _type: string = 'triangle';

    _length: number = 10;
    //abstract _scale?: number;
    _position: string; //start, end, (custom???), midle(?)
    // id_edge???
    _edge: Edge;

    _color?: string;
    _wasInside: boolean = false;

    constructor(position: string, edge: Edge, color?: string, length?: number) {
        super();
        this._position = position;
        if (typeof length !== 'undefined') {
            this._length = length;
        }

        this._edge = edge;

        if (typeof color !== 'undefined') {
            this._color = color; // edge.color
        }

    }

    draw_canvas(ctx: CanvasRenderingContext2D) {

        let startX: number, endX: number;
        let startY: number, endY: number;

        if (this._position === 'end') {
            if (typeof this._edge._points !== 'undefined') {
                const last_i = this._edge._points.length - 1
                startX = this._edge._points[last_i].x
                startY = this._edge._points[last_i].y
            } else {
                startX = this._edge._startX
                startY = this._edge._startY
            }          
            endX = this._edge._endX
            endY = this._edge._endY
        } else if (this._position === 'start') {
            if (typeof this._edge._points !== 'undefined') {
                startX = this._edge._points[0].x
                startY = this._edge._points[0].y
            } else {
                startX = this._edge._endX
                startY = this._edge._endY
            } 
            endX = this._edge._startX
            endY = this._edge._startY
        }

        // if startX ... not defind
        
        // midle
        //const arrowX = (startX! + endX!) / 2;
        //const arrowY = (startY! + endY!) / 2;

        const arrowX = endX!; // - length / 2 ????
        const arrowY = endY!;

        const angle = Math.atan2(endY! - startY!, endX! - startX!);

        // Рисуем стрелку в середине линии
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX - this._length * Math.cos(angle - Math.PI / 6), arrowY - this._length * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(arrowX - this._length * Math.cos(angle + Math.PI / 6), arrowY - this._length * Math.sin(angle + Math.PI / 6));
        ctx.lineTo(arrowX, arrowY);
        ctx.lineTo(arrowX - this._length * Math.cos(angle - Math.PI / 6), arrowY - this._length * Math.sin(angle - Math.PI / 6));

        if (typeof this._color !== 'undefined') {
            ctx.strokeStyle = this._color;

        }
        ctx.stroke();
        if (typeof this._color !== 'undefined') {
            ctx.fillStyle = this._color;
        }
        ctx.fill();

    }

    draw_hovered(ctx: CanvasRenderingContext2D) {
        if (!ctx) return;

    }

    draw_clicked(ctx: CanvasRenderingContext2D) {
        if (!ctx) return;

    }

    //TODO:
    is_inside(mouseX: number, mouseY: number) {
        return (false
            //mouseX >= this.x - this.radius &&
            //mouseX <= this.x + this.radius &&
            //mouseY >= this.y - this.radius &&
            //mouseY <= this.y + this.radius
        )
    }
}

// русский
//implements ILabel
export class Label {
    _text: string
    _startX: number
    _startY: number
    _endX: number
    _endY: number

    _color?: string = 'black'
    _font?: string

    _padding: number = 0 // отступ от края

    //position:
    _alignment?: string = 'center'
    //baseline

    constructor(label: ILabel) {
        this._text = label.text
        if (typeof label.startX !== 'undefined') {
            this._startX = label.startX
        } else throw Error('Invalid data');

        if (typeof label.startY !== 'undefined') {
            this._startY = label.startY
        } else throw Error('Invalid data');

        if (typeof label.endX !== 'undefined') {
            this._endX = label.endX
        } else throw Error('Invalid data');

        if (typeof label.endY !== 'undefined') {
            this._endY = label.endY
        } else throw Error('Invalid data');

        if (typeof label.color !== 'undefined') {
            this._color = label.color
        }
        if (typeof label.font !== 'undefined') {
            this._font = label.font
        }

        if (typeof label.padding !== 'undefined') {
            this._padding = label.padding
        }

        if (typeof label.alignment !== 'undefined') {
            this._alignment = label.alignment
        }

    }

    draw_canvas(ctx: CanvasRenderingContext2D) {
        if (!ctx) return;

        //if (!alignment) alignment = 'center';
        //if (!padding) padding = 0;

        const dx = this._endX - this._startX
        const dy = this._endY - this._startY

        let pointX, pointY, pad
        if (this._alignment == 'center') {
            pointX = this._startX
            pointY = this._startY
            pad = 1 / 2
        } else {
            const left = this._alignment == 'left'
            pointX = left ? this._startX : this._endX
            pointY = left ? this._startY : this._endY
            pad = this._padding / Math.sqrt(dx * dx + dy * dy) * (left ? 1 : -1);
        }

        ctx.save();
        if (['left', 'right', 'center', 'start', 'end'].includes(this._alignment!)) {
            ctx.textAlign = this._alignment as CanvasTextAlign;
        } else {
            console.error('Некорректное значение для textAlign');
        }
        ctx.translate(pointX + dx * pad, pointY + dy * pad);
        ctx.rotate(Math.atan2(dy, dx));
        if (typeof this._color !== 'undefined' && this._color.length > 0) {
            ctx.fillStyle = this._color;
        }
        if (typeof this._font !== 'undefined' && this._font.length > 0) {
            ctx.font = this._font;
        }

        //strokeText - будет оконтовка
        ctx.fillText(this._text, 0, 0);
        ctx.restore();
        
    }


    //get text () {
    //    return this._text
    //}
}