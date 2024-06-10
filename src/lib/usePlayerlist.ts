import { genRandomPlayer } from "./playerGenerator";
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import joinAudio from "../assets/join.mp3";
import leaveAudio from "../assets/leave.mp3";
import { useApi } from "./useApi";
import { getRandomDropReason } from "./randomDropReasons";


const sndJoin = new Audio(joinAudio);
const sndLeave = new Audio(leaveAudio);



/**
 * Playerlist
 */
export type PlayerlistConfigType = {
    beep: boolean,
    joinLeaveBias: number,
    minPlayers: number,
    maxPlayers: number,
}

export type PlayerType = {
    id: number,
    name: string,
    ids: string[],
    hwids: string[],
}

export const playerlistConfigAtom = atom({
    beep: true,
    joinLeaveBias: 0.7,
    minPlayers: 16,
    maxPlayers: 256,
});


export const playerlistAtom = atom<PlayerType[]>([]);
export const idCounterAtom = atom(0);

export const useResetPlayerlist = () => {
    const setPlayerlist = useSetAtom(playerlistAtom);
    const setIdCounter = useSetAtom(idCounterAtom);

    return () => {
        setPlayerlist([]);
        setIdCounter(0);
    }
}

export const usePlayerlist = () => {
    const playerlistConfig = useAtomValue(playerlistConfigAtom);
    const [playerlist, setPlayerlist] = useAtom(playerlistAtom);
    const [idCounter, setIdCounter] = useAtom(idCounterAtom);
    const sendApiRequest = useApi();

    const joinRandomPlayer = () => {
        if (playerlistConfig.beep) {
            sndJoin.play().catch(() => { });
        }

        let newPlayerId = 999999999;
        setIdCounter((prev) => {
            newPlayerId = prev + 1;
            return newPlayerId;
        });
        const playerData = genRandomPlayer();
        const newPlayer = {
            id: newPlayerId,
            ...playerData
        };
        setPlayerlist((prev) => [...prev, newPlayer]);
        sendApiRequest('event', {
            type: 'txAdminPlayerlistEvent',
            event: 'playerJoining',
            id: newPlayerId,
            player: playerData,
        });
    }

    const dropRandomPlayer = () => {
        if (playerlist.length <= 0) return;
        if (playerlistConfig.beep) {
            sndLeave.play().catch(() => { });
        }

        setPlayerlist((prev) => {
            const randomIndex = Math.floor(Math.random() * prev.length);
            sendApiRequest('event', {
                type: 'txAdminPlayerlistEvent',
                event: 'playerDropped',
                id: prev[randomIndex].id,
                reason: getRandomDropReason(),
            });
            return prev.filter((_, index) => index !== randomIndex)
        });
        
    }

    const timeTick = () => {
        let realJoinBias = playerlistConfig.joinLeaveBias;
        if (playerlist.length < playerlistConfig.minPlayers) {
            realJoinBias = 0.8;
        } else if (playerlist.length > playerlistConfig.maxPlayers) {
            realJoinBias = 0.2;
        }
        const isAdd = Math.random() <= realJoinBias;

        if (isAdd) {
            return joinRandomPlayer();
        } else {
            return dropRandomPlayer();
        }
    }

    const bulkJoin = async (count: number) => {
        for (let i = 0; i < count; i++) {
            joinRandomPlayer();
            await new Promise((resolve) => setTimeout(resolve, 25));
        }
    }

    const bulkDrop = async (count: number) => {
        for (let i = 0; i < count; i++) {
            dropRandomPlayer();
            await new Promise((resolve) => setTimeout(resolve, 25));
        }
    }

    const setGiantList = (num: number) => {
        const newList: PlayerType[] = [];
        for (let i = 0; i < num; i++) {
            newList.push({
                id: i,
                ...genRandomPlayer(),
            });
        }
        setPlayerlist(newList);
        setIdCounter(num);
    }

    return {
        timeTick,
        joinRandomPlayer, dropRandomPlayer,
        bulkJoin, bulkDrop,
        setGiantList,
    }
}
