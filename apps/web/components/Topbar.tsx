import { Dispatch, SetStateAction } from "react";
import { Tool } from "./Canvas";
import { IconButton } from "./IconButton";
import { Circle, Eraser, Move, Pencil, RectangleHorizontalIcon, Slash } from "lucide-react";

export default function Topbar({selectedTool, setSelectedTool} : {
    selectedTool : Tool;
    setSelectedTool : Dispatch<SetStateAction<Tool>>;
}){
    return   <div className="fixed top-4 left-1/2 -translate-x-1/2 
                  flex gap-2 px-4 py-2 rounded-4xl shadow-md 
                  bg-neutral-900/90 backdrop-blur-sm 
                  border border-neutral-800 
                  transition-colors duration-300">
            <div className="flex flex-wrap justify-center gap-3">
            <IconButton 
                onClick={() => setSelectedTool("pencil")}
                activated={selectedTool === "pencil"}
                icon={<Pencil/>}
            />
            <IconButton 
                onClick={() => setSelectedTool("rect")} 
                activated={selectedTool === "rect"} 
                icon={<RectangleHorizontalIcon />} />
            <IconButton 
                onClick={() => setSelectedTool("ellipse")} 
                activated={selectedTool === "ellipse"} 
                icon={<Circle />}/>
            <IconButton 
                onClick={() => setSelectedTool("line")}
                activated={selectedTool === "line"} 
                icon={<Slash />}/>
            <IconButton 
                onClick={() => setSelectedTool("eraser")}
                activated={selectedTool === "eraser"} 
                icon={<Eraser />}/>
            <IconButton 
                onClick={() => setSelectedTool("move")}
                activated={selectedTool === "move"} 
                icon={<Move />}/>
        </div>
    </div>

}