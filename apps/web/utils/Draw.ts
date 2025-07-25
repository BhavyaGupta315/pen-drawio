import axios from "axios";
import { Tool } from "../components/Canvas";

type Shape = {
    type : "rect",
    x : number,
    y : number,
    width : number,
    height : number
} |  {
    type: "ellipse";
    centerX: number;
    centerY: number;
    radiusX: number;
    radiusY: number;
} | {
    type: "pencil";
    points : {x:number, y:number}[];
} | {
    type: "line";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
} | {
    type : "move";
    shape : Shape;
    offsetX : number;
    offsetY : number;
}

export class Draw {
    private canvas : HTMLCanvasElement;
    private roomId : number;
    private socket : WebSocket;
    private ctx : CanvasRenderingContext2D;
    private existingShape : Shape[];
    private clicked : boolean;
    private startX : number = 0;
    private startY : number = 0;
    private selectedTool : Tool = "ellipse";
    private currentPencilStroke : {x : number, y : number}[] = [];
    private activeShape : Shape | null = null;
    
    constructor(canvas : HTMLCanvasElement, roomId : number, socket : WebSocket){
        this.canvas = canvas;
        this.roomId = roomId;
        this.socket = socket;
        this.ctx = canvas.getContext("2d")!;
        this.existingShape = [];
        this.clicked = false;
        this.init();
        this.initHandlerFunctions();
        this.initMouseHandlerFunctions();
    }

    destroy = () =>{
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    }

    init = async () => {
        this.existingShape = await getExistingShape(this.roomId);
        this.reDrawCanvas();
    }

    initHandlerFunctions = () =>{
        this.socket.onmessage = (event) =>{
            const message = JSON.parse(event.data);
            if(message.type === "chat"){
                const parsedMessage = JSON.parse(message.message);
                if(parsedMessage.type === "update"){
                    this.existingShape = parsedMessage.shapes;
                }else{
                    const shape = parsedMessage.shape;
                    this.existingShape.push(shape);
                }
                this.reDrawCanvas();
            }
        }
    }

    mouseDownHandler = (e : MouseEvent) =>{
        this.clicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;

        if(this.selectedTool === "pencil"){
            this.currentPencilStroke = [{x : this.startX, y : this.startY}];
        }else if(this.selectedTool === "eraser"){
            this.eraseShape(this.startX, this.startY);
        }else if(this.selectedTool === "move"){
            const shapeToMove = [...this.existingShape].reverse().find((shape) => {
                return this.checkShapeRelativePosition(this.startX, this.startY, shape);
            });

            if(shapeToMove){
                this.existingShape = this.existingShape.filter((shape) => shape != shapeToMove);
                const moveShape = {
                    type : "move" as const,
                    shape: shapeToMove,
                    offsetX: 0,
                    offsetY: 0,
                };

                this.activeShape = moveShape
                this.existingShape.push(moveShape);
                this.reDrawCanvas();
            }
        }
    }
    
    mouseMoveHandler = (e : MouseEvent) =>{
        if(!this.clicked) return;
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY; 
        
        this.ctx.strokeStyle = "rgba(255, 255, 255)"

        const selectedTool = this.selectedTool;
        if(selectedTool === "rect"){
            this.reDrawCanvas(); 
            this.ctx.strokeRect(this.startX, this.startY, width, height);
        }else if(selectedTool === "ellipse"){
            const radiusX = Math.abs(width)/2;
            const radiusY = Math.abs(height)/2;
            const centerX = (this.startX + e.clientX)/2;
            const centerY = (this.startY + e.clientY)/2;
            
            this.reDrawCanvas(); 
            this.ctx.beginPath();
            this.ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2*Math.PI);
            this.ctx.stroke();
            this.ctx.closePath();
        }else if(selectedTool === "line"){
            this.reDrawCanvas(); 
            this.ctx.beginPath();
            this.ctx.moveTo(this.startX, this.startY);
            this.ctx.lineTo(e.clientX, e.clientY);
            this.ctx.stroke();
            this.ctx.closePath();
        }else if(selectedTool === "pencil"){
            this.currentPencilStroke.push({x : e.clientX, y : e.clientY});
            this.ctx.beginPath();
            this.ctx.moveTo(this.currentPencilStroke[0]!.x, this.currentPencilStroke[0]!.y);
            this.currentPencilStroke.forEach((point) => {
                this.ctx.lineTo(point.x, point.y);
            })
            this.ctx.stroke();
            this.ctx.closePath();
        }else if(selectedTool === "eraser"){
            this.eraseShape(e.clientX, e.clientY);
        }else if(selectedTool === "move" && this.activeShape){
            const moveShape = this.activeShape as Shape & {type : "move"};
            moveShape.offsetX = e.clientX - this.startX;
            moveShape.offsetY = e.clientY - this.startY;
            this.reDrawCanvas();
        }
    }

    mouseUpHandler = (e : MouseEvent)=>{
        if(!this.clicked) return;

        this.clicked = false;
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;
        
        const selectedTool = this.selectedTool;
        let shape : Shape | null = null;
        if(selectedTool === "rect"){
            shape = {
                type : "rect",
                x : this.startX,
                y : this.startY,
                height,
                width
            }
        }else if(selectedTool === "ellipse"){
            shape = {
                type : "ellipse",
                centerX : (this.startX + e.clientX)/2,
                centerY : (this.startY + e.clientY)/2,
                radiusX : Math.abs(width/2), 
                radiusY : Math.abs(height/2), 
            }
        }else if(selectedTool === "line"){
            shape = {
                type : "line",
                startX : this.startX,
                startY : this.startY,
                endX : e.clientX,
                endY : e.clientY
            }
        }else if(selectedTool === "pencil" && this.currentPencilStroke.length > 1){
            shape = {
                type : "pencil",
                points : this.currentPencilStroke
            };
        }else if(selectedTool === "move" && this.activeShape){
            const moveShape = this.activeShape as Shape & {type : "move"};
            const finalShape = this.getMovedShape(moveShape);
            this.existingShape = this.existingShape.filter(shape => shape !== moveShape);
            this.existingShape.push(finalShape);

            this.socket.send(JSON.stringify({
                type : "chat",
                message :  JSON.stringify({
                    type:"update",
                    shapes : this.existingShape
                }),
                roomId : this.roomId
            }))
            this.activeShape = null;
            this.reDrawCanvas();
            return;
        }

        if(!shape) return;

        this.existingShape.push(shape);
        
        this.socket.send(JSON.stringify({
            type : "chat",
            message :  JSON.stringify({
                shape
            }),
            roomId : this.roomId
        }));

        this.reDrawCanvas();
    }

    initMouseHandlerFunctions = () => {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);
        this.canvas.addEventListener("mouseup", this.mouseUpHandler);
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    }

    setTool = (tool : Tool) => {
        this.selectedTool = tool;
        this.canvas.style.cursor = tool === "move" ? "move" : "crosshair";
    }

    reDrawCanvas = () =>{
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "rgba(0,0,0)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.existingShape.forEach((shape) => {
            this.drawShape(shape);
        })
    }

    drawShape = (shape : Shape) =>{
        this.ctx.strokeStyle = "rgba(255, 255, 255)"
        if(shape.type === "rect"){
            this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }else if(shape.type === "ellipse"){
            this.ctx.beginPath();
            this.ctx.ellipse(shape.centerX, shape.centerY, Math.abs(shape.radiusX), Math.abs(shape.radiusY), 0, 0, 2*Math.PI);
            this.ctx.stroke();
            this.ctx.closePath();
        }else if(shape.type === "line"){
            this.ctx.beginPath();
            this.ctx.moveTo(shape.startX, shape.startY);
            this.ctx.lineTo(shape.endX, shape.endY);
            this.ctx.stroke();
            this.ctx.closePath();
        }else if(shape.type === "pencil"){
            if(shape.points.length > 0){
                this.ctx.beginPath();

                this.ctx.moveTo(shape.points[0]!.x, shape.points[0]!.y);  
                shape.points.forEach((point) => {
                    this.ctx.lineTo(point.x, point.y);
                })
                this.ctx.stroke();
                this.ctx.closePath();
            }
        }else if(shape.type === "move"){
            const movedShape = this.getMovedShape(shape);
            this.drawShape(movedShape);
        }
    }

    getMovedShape = (moveShape : Shape & { type : "move"}) : Shape =>{
        const { shape, offsetX, offsetY } = moveShape;
        if(shape.type === "rect"){
            return {
                ...shape, 
                x : shape.x + offsetX, 
                y : shape.y + offsetY
            };
        }else if(shape.type === "ellipse"){
            return {
                ...shape, 
                centerX : shape.centerX + offsetX, 
                centerY : shape.centerY + offsetY
            };
        }else if(shape.type === "line"){
            return {
                ...shape, 
                startX : shape.startX + offsetX, 
                startY : shape.startY + offsetY, 
                endX : shape.endX + offsetX, 
                endY : shape.endY + offsetY
            };
        }else if(shape.type === "pencil"){
            return {
                ...shape,
                points: shape.points.map(point => ({
                    x: point.x + offsetX,
                    y: point.y + offsetY,
                })),
            }
        }else{
            return shape;
        }
    }

    eraseShape = (x : number, y : number) =>{
        this.existingShape = this.existingShape.filter((shape) => {
            return (!this.checkShapeRelativePosition(x, y, shape));
        })
        this.reDrawCanvas();
    }

    checkShapeRelativePosition = (x : number, y : number, shape : Shape) : boolean =>{
        const threshold = 8;
        if (shape.type === 'rect') {
            const { x : rectX, y : rectY, width, height } = shape;

            const topEdge = this.isPointNearSegment(x, y, rectX, rectY, rectX + width, rectY, threshold);
            const rightEdge = this.isPointNearSegment(x, y, rectX + width, rectY, rectX + width, rectY + height, threshold);
            const bottomEdge = this.isPointNearSegment(x, y, rectX + width, rectY + height, rectX, rectY + height, threshold);
            const leftEdge = this.isPointNearSegment(x, y, rectX, rectY + height, rectX, rectY, threshold);

            return topEdge || rightEdge || bottomEdge || leftEdge;
        }else if(shape.type === "ellipse"){
            const dx = x - shape.centerX;
            const dy = y - shape.centerY;
            const rx = shape.radiusX;
            const ry = shape.radiusY;

            const normalized = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry);
            return Math.abs(normalized - 1) < 0.2;
        }else if(shape.type === "pencil"){
            for(let i = 0; i<shape.points.length-1; i++){
                const p1 = shape.points[i];
                const p2 = shape.points[i+1];
                if(this.isPointNearSegment(x, y, p1!.x, p1!.y, p2!.x, p2!.y, threshold)) return true;
            }
        }else if (shape.type === 'line') {
            return this.isPointNearSegment(x, y, shape.startX, shape.startY, shape.endX, shape.endY, threshold);
        }

        return false;
    }

    isPointNearSegment = (px : number, py : number, x1 : number, y1 : number, x2 : number, y2 : number, threshold : number) : boolean => {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const len_sq = C * C + D * D;
        let param = -1;
        if (len_sq !== 0) param = dot / len_sq;

        let xx, yy;

        if (param < 0){
            xx = x1;
            yy = y1;
        }else if(param > 1){
            xx = x2;
            yy = y2;
        }else{
            xx = x1 + param * C;
            yy = y1 + param * D;
        }
        const dx = px - xx;
        const dy = py - yy;
        return dx * dx + dy * dy <= threshold * threshold;
    }   
};

async function getExistingShape(roomId : number){
    try{
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chat/${roomId}`);
        const messages = response.data.messages; 
        const shapes = messages.map((x : {message : string}) => {
            const messageData = JSON.parse(x.message);
            return messageData;
        });

        return shapes;
    }catch(e){
        if (axios.isAxiosError(e)) {
            const msg = e.response?.data?.message || "Unexpected error";
            console.log(msg);
        }else{
            console.log(e);
        }
    }
}