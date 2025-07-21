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
    startX: number;
    startY: number;
    endX: number;
    endY: number;
} | {
    type: "line";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
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
    
    constructor(canvas : HTMLCanvasElement, roomId : number, socket : WebSocket){
        this.canvas = canvas;
        this.roomId = roomId;
        this.socket = socket;
        this.ctx = canvas.getContext("2d")!;
        this.existingShape = [];
        this.clicked = false;
        this.init();
        console.log("Calling Init Handler Fuction");
        this.initHandlerFunctions();
        this.initMouseHandlerFunctions();
    }

    destroy(){
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    }

    async init(){
        this.existingShape = await getExistingShape(this.roomId);
        this.clearCanvas();
    }

    initHandlerFunctions(){
        console.log("Socket On Message handler added");
        console.log(this.socket);
        this.socket.onmessage = (event) =>{
            console.log("Message Received from socket");
            const message = JSON.parse(event.data);
            if(message.type === "chat"){
                const parsedMessage = JSON.parse(message.message);
                const shape = parsedMessage.shape;
                this.existingShape.push(shape);
                this.clearCanvas();
            }
        }
    }

    mouseDownHandler = (e : MouseEvent) =>{
        this.clicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
    }

    mouseUpHandler = (e : MouseEvent)=>{
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
        }

        if(!shape) return;

        this.existingShape.push(shape);
        
        this.socket.send(JSON.stringify({
            type : "chat",
            message :  JSON.stringify({
                shape
            }),
            roomId : this.roomId
        }))
    }

    mouseMoveHandler = (e : MouseEvent) =>{
        if(this.clicked){
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY; 
            
            this.clearCanvas(); 
            this.ctx.strokeStyle = "rgba(255, 255, 255)"

            const selectedTool = this.selectedTool;
            if(selectedTool === "rect"){
                this.ctx.strokeRect(this.startX, this.startY, width, height);
            }else if(selectedTool === "ellipse"){
                const radiusX = Math.abs(width)/2;
                const radiusY = Math.abs(height)/2;
                const centerX = (this.startX + e.clientX)/2;
                const centerY = (this.startY + e.clientY)/2;
                
                this.ctx.beginPath();
                this.ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2*Math.PI);
                this.ctx.stroke();
                this.ctx.closePath();
            }else if(selectedTool === "line"){
                this.ctx.beginPath();
                this.ctx.moveTo(this.startX, this.startY);
                this.ctx.lineTo(e.clientX, e.clientY);
                this.ctx.stroke();
                this.ctx.closePath();
            }
        }
    }

    initMouseHandlerFunctions(){
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);
        this.canvas.addEventListener("mouseup", this.mouseUpHandler);
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    }

    setTool(tool : Tool){
        this.selectedTool = tool;
    }

    clearCanvas(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "rgba(0,0,0)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.strokeStyle = "rgba(255, 255, 255)"
        this.existingShape.forEach((shape) => {
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
            }
        })
    }
};

async function getExistingShape(roomId : number){
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chat/${roomId}`);
    const messages = response.data.messages; 
    const shapes = messages.map((x : {message : string}) => {
        const messageData = JSON.parse(x.message);
        return messageData;
    });

    return shapes;
}