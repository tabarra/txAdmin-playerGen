import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { playerlistConfigAtom, usePlayerlist, useResetPlayerlist } from "./lib/usePlayerlist";
import debounce from 'lodash-es/debounce.js';
import { timeEngineConfigAtom, useSetTimeEngine } from "./lib/useTimeEngine";
import { txAdminUrlAtom } from "./lib/useApi";


const speedSliderDebouncer = debounce((setter: any, newVal: number) => {
    setter((prev: any) => ({
        ...prev,
        speed: newVal,
    }));
}, 250, { leading: true, maxWait: 750 });
const joinBiasSliderDebouncer = debounce((setter: any, newVal: number) => {
    setter((prev: any) => ({
        ...prev,
        joinLeaveBias: newVal,
    }));
}, 250, { leading: true, maxWait: 750 });

function ConfigEditor() {
    const [txAdminUrl, setTxAdminUrl] = useAtom(txAdminUrlAtom);
    const [timeEngineConfig, setTimeEngineConfig] = useAtom(timeEngineConfigAtom);
    const [playerlistConfig, setPlayerlistConfig] = useAtom(playerlistConfigAtom);
    const [speedSliderValue, setSpeedSliderValue] = useState(timeEngineConfig.speed * 100);
    const [joinBiasSliderValue, setJoinBiasSliderValue] = useState((playerlistConfig.joinLeaveBias * 20) - 10);

    useEffect(() => {
        speedSliderDebouncer(setTimeEngineConfig, speedSliderValue / 100);
    }, [speedSliderValue, setTimeEngineConfig]);
    useEffect(() => {
        joinBiasSliderDebouncer(setPlayerlistConfig, (joinBiasSliderValue + 10) / 20);
    }, [joinBiasSliderValue, setPlayerlistConfig]);

    return (
        <div className="flex flex-col gap-4">
            <label className="form-control w-full">
                <span className="label label-text">
                    Join/Leave speed:
                </span>
                <input
                    type="range"
                    min={15} max={500}
                    value={speedSliderValue}
                    onChange={(e) => setSpeedSliderValue(e.target.valueAsNumber)}
                    className="range range-xs w-full"
                />
            </label>
            <label className="form-control w-full">
                <span className="label label-text">
                    Join/Leave bias:
                </span>
                <input
                    type="range"
                    min={-10} max={10}
                    value={joinBiasSliderValue}
                    onChange={(e) => setJoinBiasSliderValue(e.target.valueAsNumber)}
                    className="range range-xs w-full"
                />
            </label>

            <label className="form-control w-full">
                <span className="label label-text">
                    Beep Sound:
                </span>
                <input
                    type="checkbox"
                    className="toggle"
                    checked={playerlistConfig.beep}
                    onChange={(e) => setPlayerlistConfig((prev) => ({ ...prev, beep: e.target.checked }))}
                />
            </label>
            <div className="flex gap-2 w-full">
                <label className="form-control w-full">
                    <span className="label label-text">
                        Min players:
                    </span>
                    <input
                        type="number"
                        placeholder="0"
                        className="input input-bordered w-full"
                        min={0} max={10000}
                        value={playerlistConfig.minPlayers}
                        onChange={(e) => setPlayerlistConfig((prev) => ({ ...prev, minPlayers: e.target.valueAsNumber }))}
                    />
                </label>
                <label className="form-control w-full">
                    <span className="label label-text">
                        Max players:
                    </span>
                    <input
                        type="number"
                        placeholder="0"
                        className="input input-bordered w-full"
                        min={0} max={10000}
                        value={playerlistConfig.maxPlayers}
                        onChange={(e) => setPlayerlistConfig((prev) => ({ ...prev, maxPlayers: e.target.valueAsNumber }))}
                    />
                </label>
            </div>

            <label className="form-control w-full">
                <span className="label label-text">
                    txAdmin URL:
                </span>
                <input
                    type="url"
                    placeholder="http://localhost:40120/"
                    value={txAdminUrl}
                    onChange={(e) => setTxAdminUrl(e.target.value)}
                    className="input input-bordered w-full"
                />
            </label>
        </div>
    )
}


function ControlActions() {
    const resetPlayerlist = useResetPlayerlist();
    const { timeEngineConfig, toggleRunning, setSpeed } = useSetTimeEngine();
    const { bulkDrop, bulkJoin, setGiantList, dropRandomPlayer, joinRandomPlayer } = usePlayerlist();
    const [isBulkOperationRunning, setIsBulkOperationRunning] = useState(false);

    const doBulkOp = async (op: 'drop' | 'join', num: number) => {
        setIsBulkOperationRunning(true);
        if(op === 'drop') {
            await bulkDrop(num);
        } else {
            await bulkJoin(num);
        }
        setIsBulkOperationRunning(false);
    }


    return (
        <div className="grid grid-cols-2 gap-2">
            <button className="btn btn-outline btn-warning" onClick={resetPlayerlist}>RESET</button>
            {timeEngineConfig.running ? (
                <button className="btn btn-outline btn-error" onClick={toggleRunning}>STOP</button>
            ) : (
                <button className="btn btn-outline btn-success" onClick={toggleRunning}>START</button>
            )}
            <button
                className="btn btn-outline"
                onClick={dropRandomPlayer}
            >
                Drop 1
            </button>
            <button
                className="btn btn-outline"
                onClick={joinRandomPlayer}
            >
                Join 1
            </button>
            
            <button
                className="btn btn-outline"
                onClick={() => {doBulkOp('drop', 100)}}
                disabled={isBulkOperationRunning}
            >
                {isBulkOperationRunning ? (
                    <span className="loading loading-spinner loading-sm"></span>
                ) : (
                    <span>Drop 100</span>
                )}
            </button>
            <button
                className="btn btn-outline"
                onClick={() => {doBulkOp('join', 100)}}
                disabled={isBulkOperationRunning}
            >
                {isBulkOperationRunning ? (
                    <span className="loading loading-spinner loading-sm"></span>
                ) : (
                    <span>Join 100</span>
                )}
            </button>
            <button
                className="btn btn-outline btn-secondary col-span-2"
                onClick={() => {doBulkOp('join', 1000)}}
                disabled={isBulkOperationRunning}
            >
                {isBulkOperationRunning ? (
                    <span className="loading loading-spinner loading-sm"></span>
                ) : (
                    <span>Slowly Join 1k</span>
                )}
            </button>
            {/* <button className="btn btn-outline" onClick={() => { setMassivePlayerlist(1000) }}>Set 1k players</button>
            <button className="btn btn-outline" onClick={() => { setMassivePlayerlist(10000) }}>Set 10k players</button>
            <button className="btn btn-outline" onClick={() => { setMassivePlayerlist(50000) }}>Set 50k players</button>
            <button className="btn btn-outline" onClick={() => { setMassivePlayerlist(100000) }}>Set 100k players</button> */}
        </div>
    )
}



export default function ControlsCard() {
    const timeEngineConfig = useAtomValue(timeEngineConfigAtom);
    const playerlistConfig = useAtomValue(playerlistConfigAtom);

    return (
        <div className="card w-96 bg-neutral text-neutral-content h-min">
            <div className="card-body items-center text-center p-0">
                <div className="bg-base-300 w-full py-2 px-4 rounded-t-2xl items-center text-center">
                    <h2 className="text-2xl font-semibold">Controls</h2>
                </div>
                <div className="w-full p-4 pt-0">
                    <ConfigEditor />
                    <div className="divider text-sm">Actions</div>
                    <ControlActions />

                    <p className="bg-slate-800 rounded-xl p-2 whitespace-pre-wrap min-w-full text-left mt-2">
                        {JSON.stringify(timeEngineConfig, null, 2)}
                        {JSON.stringify(playerlistConfig, null, 2)}
                    </p>
                </div>
            </div>
        </div>
    );
}
