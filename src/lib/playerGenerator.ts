import * as d3array from 'd3-array';
import * as d3random from 'd3-random';
import { customAlphabet } from 'nanoid/non-secure';
import playerNameParts from './playerNameParts';

const getRandomElement = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];


/** 
 * Identifier Generator
 */
const nums = '1234567890';
const hex = '0123456789abcdef';
export const genDiscord = customAlphabet(nums, 18);
export const genFivem = customAlphabet(nums, 7);
export const genLicense = customAlphabet(hex, 40);
export const genLive = customAlphabet(nums, 15);
export const genSteam = customAlphabet(hex, 8);
export const genXbl = customAlphabet(nums, 16);
const identifierGenerators = [
    () => { return 'discord:' + genDiscord() },
    () => { return 'fivem:' + genFivem() },
    () => { return 'license2:' + genLicense() },
    () => { return 'live:' + genLive() },
    () => { return 'steam:1100001' + genSteam() },
    () => { return 'xbl:' + genXbl() },
]
export const genRandomIds = () => {
    d3array.shuffle(identifierGenerators);
    const out = ['license:' + genLicense()];
    for (let i = 0; i < 4; i++) {
        out.push(identifierGenerators[i]());
    }
    return out;
}

const hwidsNormalGen = d3random.randomNormal(2.35, 0.93);
const hwidsNumGen = () => Math.min(10, hwidsNormalGen() + 3.05);
export const genRandomHwids = () => {
    const num = hwidsNumGen();
    const out: string[] = [];
    for (let i = 0; i < num; i++) {
        out.push(
            Math.floor(Math.random() * 10)
            + ':'
            + Array.from(crypto.getRandomValues(new Uint8Array(32)))
                .map(byte => byte.toString(16).padStart(2, '0'))
                .join('')
        );
    }
    return out;
}


/**
 * Name generator
 */
const availableNameParts = d3array.shuffle(playerNameParts as string[]);
const prefixParts: string[] = [];
const otherParts: string[] = [];
for (const part of availableNameParts) {
    if (!/[a-zA-Z0-9]/.test(part[0])) {
        prefixParts.push(part);
    } else {
        otherParts.push(part);
    }
}
console.log('Unique name parts:', availableNameParts.length);
export const genRandomName = () => {
    const nameParts: number[] = [];
    const numParts = Math.ceil(Math.random() * 2.7 + 0.3); //bias it towards higher numbers
    for (let i = 0; i < numParts; i++) {
        if (i == 0 && numParts > 1 && Math.random() < 0.5) {
            nameParts.push(getRandomElement(prefixParts));
        } else {
            nameParts.push(getRandomElement(otherParts));
        }
    }
    return nameParts.join(' ').substring(0, 74);
};


/**
 * Player generator
 */
export const genRandomPlayer = () => {
    return {
        name: genRandomName(),
        ids: genRandomIds(),
        hwids: genRandomHwids(),
    }
}
