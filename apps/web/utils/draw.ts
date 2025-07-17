import axios from "axios";

type Shape = {
    type : "rect",
    x : number,
    y : number,
    width : number,
    height : number
} | {
    type : "circle",
    centerX : number,
    centerY : number,
    radius : number
}

export default function initDraw(canvas : HTMLCanvasElement, roomId : string){
    const ctx = canvas.getContext("2d");
    const existingShape : Shape[] = [];
    if(!ctx) return;
    clearCanvas(canvas, existingShape);

    let clicked = false;
    let startX = 0, startY = 0;

    canvas.addEventListener("mousedown", (e) => {
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
    });

    canvas.addEventListener("mouseup", (e)=>{
        clicked = false;
        const width = e.clientX - startX;
        const height = e.clientY - startY;
        existingShape.push({
            type : "rect",
            x : startX,
            y : startY,
            height,
            width
        })
    });

    canvas.addEventListener("mousemove", (e) =>{
        if(clicked){
            const width = e.clientX - startX;
            const height = e.clientY - startY; 
            
            clearCanvas(canvas, existingShape); 

            ctx.strokeStyle = "rgba(255, 255, 255)"
            ctx.strokeRect(startX, startY, width, height);
        }
    })
}

function clearCanvas(canvas : HTMLCanvasElement, existingShape : Shape[]){
    const ctx = canvas.getContext("2d");
    if(!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    existingShape.map((shape) => {
        if(shape.type === "rect"){
            ctx.strokeStyle = "rgba(255, 255, 255)"
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }
    })
}

async function getExistingShape(roomId : string){
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chats/${roomId}`);
    const messages = response.data; // TODO
}