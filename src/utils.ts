import { ZapProvider } from "@zapjs/provider";
import { ZapSubscriber } from "@zapjs/subscriber";
import { hexToAddress, isIpfsAddress, addressToHex } from "./ipfs-utils";
const {utf8ToHex, hexToUtf8} = require("web3-utils");

/**
 * Promise that is resolved after a certain timeout
 *
 * @param timeout - Amount of ms to wait
 */
export function sleep(timeout: number): Promise<void> {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, timeout);
	})
}

/**
 * Loads the first account from the current loaded provider in a web3 instance
 *
 * @param web3 - Web3 instance to load accounts from
 * @returns The first account found
 */
export async function loadAccount(web3: any): Promise<string> {
	const accounts: string[] = await web3.eth.getAccounts();
	if ( accounts.length == 0 ) {
		throw new Error('Unable to find an account in the current web3 provider');
	}
	return accounts[0];
}

/**
 * Loads a ZapProvider from a given Web3 instance
 *
 * @param web3 - Web3 instance to load from
 * @returns ZapProvider instantiated
 */
export async function loadProvider(web3: any, owner: string): Promise<ZapProvider> {
	const contracts = {
		networkId: (await web3.eth.net.getId()).toString(),
		networkProvider: web3.currentProvider,
	};

	const handler = {
		handleIncoming: (data: string) => {
			console.log('handleIncoming', data);
		},
		handleUnsubscription: (data: string) => {
			console.log('handleUnsubscription', data);
		},
		handleSubscription: (data: string) => {
			console.log('handleSubscription', data);
		},
	};

	return new ZapProvider(owner, Object.assign(contracts, { handler }));
}

/**
 * Loads a ZapProvider from a given Web3 instance
 *
 * @param web3 - Web3 instance to load from
 * @returns ZapProvider instantiated
 */
export async function loadSubscriber(web3: any, owner: string): Promise<ZapSubscriber> {
	const contracts = {
		networkId: (await web3.eth.net.getId()).toString(),
		networkProvider: web3.currentProvider,
	};

	return new ZapSubscriber(owner, contracts);
}

export function decodeParam(hex: string): string {
	try {
		return hexToUtf8(hex);
	} catch (e) {
		console.log(e);
	}
	try {
		const address = hexToAddress(hex.replace('0x', ''));
		if (isIpfsAddress(address)) return address;
	} catch (e) {
		console.log(e);
	}
	return hex;
}

export function encodeParam(input: string): string {
	if (isIpfsAddress(input)) return '0x' + addressToHex(input);
	return input.startsWith('0x') ? input : utf8ToHex(input);
}