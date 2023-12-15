import PlayerlistCard from "./PlayerlistCard";
import ControlsCard from "./ControlsCard";
import EngineRender from "./EngineRender";



export default function App() {
    return (<div className="h-screen ">
        <div className="bg-slate-700 sticky top-0 z-10 flex flex-col items-center justify-center p-2">
            <h1 className="text-4xl font-bold font-mono">txAdmin Player Generator</h1>
        </div>
        <div className="w-full max-w-[1920px] mx-auto flex justify-center gap-8 mt-8">
            <PlayerlistCard />
            <ControlsCard />
        </div>

        <EngineRender />
    </div>)
}
