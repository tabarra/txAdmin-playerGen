import { useAtomValue } from "jotai";
import { idCounterAtom, playerlistAtom } from "./lib/usePlayerlist";
import { useVirtualizer } from '@tanstack/react-virtual';
import { useMemo, useRef, useState } from "react";


function PlayerlistItem({ id, name }: { id: number, name: string }) {
    return (
        <div className="w-full text-left">
            <span
                className="font-mono text-slate-600 text-right plistPlId inline-block mr-2"
            >{id}</span>
            <span className="overflow-hidden max-w-full">{name}</span>
        </div>
    )
}


export default function PlayerlistCard() {
    const playerlist = useAtomValue(playerlistAtom);
    const idCounter = useAtomValue(idCounterAtom);
    const parentRef = useRef<HTMLDivElement>(null);
    const [filterString, setFilterString] = useState('');

    const filteredPlayerlist = useMemo(() => {
        const lowerFilterString = filterString.toLocaleLowerCase();
        return playerlist.filter((player) => {
            return player.name.toLocaleLowerCase().includes(lowerFilterString);
        })
    }, [playerlist, filterString])

    // The virtualizer
    const rowVirtualizer = useVirtualizer({
        count: filteredPlayerlist.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 24,
        overscan: 10,
    })

    const jumpRandom = () => {
        const randomIndex = Math.floor(Math.random() * filteredPlayerlist.length);
        rowVirtualizer.scrollToIndex(randomIndex, { align: 'end', behavior: 'smooth' });
    }

    // const idCharLength = idCounter.toString().length + 2;

    //NOTE: I tried many algorithms to calculate the minimum width of the ID column,
    // but the simplest one was the best one when considering performance.
    const idCharLength = Math.floor(Math.log10(idCounter)) + 1;
    const injectedStyle = `.plistPlId { min-width: ${idCharLength}ch; }`

    return (
        <div className="card w-72 bg-neutral text-neutral-content">
            <div className="card-body items-center  p-0">
                <div className="bg-base-300 w-full py-2 px-4 rounded-t-2xl">
                    <div className="flex justify-between w-full">
                        <h2 className="card-title text-2xl">Players:</h2>
                        <span className="font-mono text-3xl text-accent">{filteredPlayerlist.length}</span>
                        {filterString.length > 0 && (
                            <span className="font-mono text-3xl text-accent">/{playerlist.length}</span>
                        )}
                    </div>
                    <div className="flex justify-between w-full">
                        <h2 className="card-title text-2xl">ID Counter:</h2>
                        <span className="font-mono text-3xl text-accent">{idCounter}</span>
                    </div>
                </div>

                <div className="text-center space-y-2">
                    <div className="flex justify-between gap-2 w-full px-4">
                        <label className="form-control">
                            <div className="join">
                                <div>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            className="input input-sm input-bordered join-item"
                                            value={filterString}
                                            onChange={(e) => { setFilterString(e.target.value) }}
                                        />
                                    </div>
                                </div>
                                <button
                                    className="btn btn-sm join-item"
                                    onClick={(e) => { setFilterString('') }}
                                >
                                    Clear
                                </button>
                            </div>
                        </label>

                    </div>
                    {/* <button className="btn btn-sm btn-outline" onClick={jumpRandom}>jump!</button> */}
                </div>

                <style>
                    {injectedStyle}
                </style>
                <div className="w-full p-4 pt-0 overflow-y-scroll h-full max-h-[850px]" ref={parentRef}>
                    {/* {playerlist.map((player) => (
                        <PlayerlistItem key={player.id} id={player.id} name={player.name} />
                    ))} */}
                    <div
                        style={{
                            height: `${rowVirtualizer.getTotalSize()}px`,
                            width: '100%',
                            position: 'relative',
                        }}
                    >
                        {rowVirtualizer.getVirtualItems().map((virtualItem) => (
                            <div
                                key={virtualItem.key}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: `${virtualItem.size}px`,
                                    transform: `translateY(${virtualItem.start}px)`,
                                }}
                            >
                                <PlayerlistItem
                                    key={filteredPlayerlist[virtualItem.index].id}
                                    id={filteredPlayerlist[virtualItem.index].id}
                                    name={filteredPlayerlist[virtualItem.index].name}
                                />
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    )
}
