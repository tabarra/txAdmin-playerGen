import { atom, useAtom } from 'jotai';

export type TimeEngineConfigType = {
    running: boolean,
    speed: number,
}

export const timeEngineConfigAtom = atom({
    running: false,
    speed: 1.5,
});

export const useSetTimeEngine = () => {
    const [timeEngineConfig, setTimeEngineConfig] = useAtom(timeEngineConfigAtom);

    const toggleRunning = () => {
        setTimeEngineConfig((prev) => ({
            ...prev,
            running: !prev.running,
        }));
    }

    const setSpeed = (speed: number) => {
        setTimeEngineConfig((prev) => ({
            ...prev,
            speed,
        }));
    }

    return {
        timeEngineConfig,
        toggleRunning,
        setSpeed,
    }
}
