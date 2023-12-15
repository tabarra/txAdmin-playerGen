import { useAtomValue } from "jotai";
import { useEffect, useRef } from "react";
import { usePlayerlist } from "./lib/usePlayerlist";
import * as d3random from 'd3-random';
import { TimeEngineConfigType, timeEngineConfigAtom } from "./lib/useTimeEngine";


class TimeEngine {
    private delayGen = d3random.randomExponential(0.5);
    private timeout: number | null = null;
    private tickFunc = () => { };
    private isRunning = false;

    constructor(cfg: TimeEngineConfigType) {
        console.log("TimeEngine:constructor");
        this.setConfig(cfg);
        this.start();
    }

    public setConfig(cfg: TimeEngineConfigType) {
        console.log("TimeEngine.setConfig", cfg);
        this.delayGen = d3random.randomExponential(cfg.speed);
        if (cfg.running) {
            if (this.isRunning) {
                clearTimeout(this.timeout!);
                this.loop();
            } else {
                this.start();
            }
        } else {
            this.stop();
        }
    }

    public setTickFunc(tickFunc: () => void) {
        this.tickFunc = tickFunc;
    }

    public stop() {
        console.log("TimeEngine.stop");
        this.isRunning = false;
        if (this.timeout) {
            clearInterval(this.timeout);
        }
    }

    public start() {
        console.log("TimeEngine.start");
        this.isRunning = true;
        this.loop();
    }

    private loop() {
        if (!this.isRunning) return;
        this.tickFunc();

        const waitTime = Math.ceil(this.delayGen() * 1000) + 1;
        this.timeout = setTimeout(() => {
            this.loop();
        }, waitTime);
    }
}


export default function EngineRender() {
    const cfg = useAtomValue(timeEngineConfigAtom);
    const { timeTick } = usePlayerlist();
    const engine = useRef<TimeEngine | null>();

    useEffect(() => {
        if (!engine.current) return;
        engine.current.setConfig(cfg);
    }, [cfg]);
    useEffect(() => {
        if (!engine.current) return;
        engine.current.setTickFunc(timeTick);
    }, [timeTick]);

    useEffect(() => {
        if (!engine.current) {
            engine.current = new TimeEngine(cfg);
        }

        return () => {
            console.group("EngineRender[]: cleanup");
            engine.current?.stop();
            engine.current = null;
            console.groupEnd();
        }
    }, []);
    return null;
}
