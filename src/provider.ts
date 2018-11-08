import { Curve } from "@zapjs/curve";
import { ZapProvider } from "@zapjs/provider";
import { ZapSubscriber } from "@zapjs/subscriber";
import { txid, DEFAULT_GAS, BNType } from "@zapjs/types";
const {toHex, utf8ToHex, toBN, hexToUtf8} = require("web3-utils");

import { loadAccount, loadProvider, loadSubscriber, decodeParam, encodeParam, getUrlText } from "./utils";
import { curveString } from "./curve";
import { func } from "prop-types";
import { isIpfsAddress } from "./ipfs-utils";
// import { createCurve, curveString } from "./curve";

/**
 * Create a provider for a ZapProvider instance based on user input
 *
 * @param provider - Provider to use
 */
/* export async function createProvider(web3: any): Promise<void> {
	console.log('Create a provider');
	const title = await ask('Title> ');

	if ( title.length == 0 ) {
		console.log('Not creating a provider now. Title cannot be empty.');
		return;
	}

	const public_key = await ask('Public Key (hex)> ');

	if ( !public_key.startsWith('0x') ) {
		console.log('Not creating provider now. Public key must be a hex string.');
		return;
	}

	console.log('Creating provider...');

	const provider = await loadProvider(web3, await loadAccount(web3));
	await provider.initiateProvider({ public_key, title, gas: DEFAULT_GAS });
} */

/**
 * Create a provider curve for a ZapProvider instance based on user input
 *
 * @param provider - Provider to use
 */
/* export async function createProviderCurve(web3: any): Promise<void> {
	try {
		const provider = await loadProvider(web3, await loadAccount(web3));

		const endpoint: string = await ask('Endpoint> ');

		if ( endpoint.length == 0 ) {
			return;
		}

		const curve: Curve = await createCurve();

		console.log(curveString(curve.values));
		await provider.initiateProviderCurve({ endpoint, term: curve.values });

		console.log('Created endpoint', endpoint);
	}
	catch(err) {
		console.log('Failed to parse your input', err);
	}
} */

/**
 * Get the information for an endpoint
 *
 * @param provier - Provider to use
 */
export function getEndpointInfo(web3: any, user: string, oracle: string, endpoint: string): Promise<any> {
	if ( oracle.length == 0 ) {
		return;
  }
  return loadProvider(web3, oracle).then(provider => getProviderEndpointInfo(provider, endpoint, user));
}

export function getProviderEndpointInfo(provider, endpoint, user): Promise<any> {
	return Promise.all([
    provider.getBoundDots({ subscriber: user, endpoint }),
    provider.getCurve(endpoint),
    provider.getDotsIssued(endpoint),
    provider.getZapBound(endpoint),
  ]).then(([bound, curve, totalBound, zapBound]) => {
    if (!curve.values.length) throw new Error('Unable to find the endpoint.');
    return {
      bound: bound.toString(),
      curve: curveString(curve.values),
      totalBound: totalBound.toString(),
      zapBound: zapBound.toString(),
    };
  });
}

/**
 * Do a query and receive the response as the bytes32 array.
 *
 * @param subscriber The subscriber to do the query with
 */
/* export async function doQuery(web3: any): Promise<void> {
	const user: string = await loadAccount(web3);
	const subscriber: ZapSubscriber = await loadSubscriber(web3, user);

	const provider_address: string = await ask('Provider Address> ');

	if ( provider_address.length == 0 ) {
		return;
	}

	const endpoint: string = await ask('Endpoint> ');

	if ( endpoint.length == 0 ) {
		return;
	}

	const provider: ZapProvider = await loadProvider(web3, provider_address);

	const bound: BNType = web3.utils.toBN(await provider.getBoundDots({ subscriber: user, endpoint}));

	if ( bound.isZero() ) {
		console.log('You do not have any bound dots to this provider');
		return;
	}

	console.log(`You have ${bound} DOTs bound to this provider's endpoint. 1 DOT will be used.'`);

	const endpointParams: string[] = [];

	console.log(`Input your provider's endpoint parameters. Enter a blank line to skip.'`)

	while ( true ) {
		const endpointParam: string = await ask('Endpoint Params> ');

		if ( endpointParam.length == 0 ) {
			break;
		}

		endpointParams.push(endpointParam);
	}

	const query: string = await ask('Query> ');

	console.log('Querying provider...');
	const txid: any = await subscriber.queryData({ provider: provider_address, query, endpoint, endpointParams, gas: DEFAULT_GAS.toNumber() });
	console.log('Queried provider. Transaction Hash:', typeof txid == 'string' ? txid : txid.transactionHash);

	const _id = txid.events['Incoming'].returnValues['id'];
	const id = web3.utils.toBN(_id);
	console.log('Query ID generate was', '0x' + id.toString(16));

	// Create a promise to get response
	const promise: Promise<any> = new Promise((resolve: any, reject: any) => {
		console.log('Waiting for response');
		let fulfilled = false;

		// Get the off chain response
		subscriber.listenToOffchainResponse({ id }, (err: any, data: any) => {
			// Only call once
			if ( fulfilled ) return;
			fulfilled = true;

			// Output response
			if ( err ) reject(err);
			else       resolve(data.returnValues.response);
		});
	});

	const res = await promise;
	console.log('Response', res);
} */

export function getQueryResponse(subscriber: ZapSubscriber, filter: any = {}) {
	return new Promise((resolve, reject) => {
		let eventEmitters = [];
		let fulfilled = false;
		const listener = (err, data) => {
			if (fulfilled) return;
			if (err) reject(err);
			else resolve(data.returnValues.response1);
			fulfilled = true;
			eventEmitters.forEach(e => { e.unsubscribe(); })
		};
		if(!filter.subscriber) filter.subscriber = subscriber.subscriberOwner;
		eventEmitters.push(subscriber.zapDispatch.contract.events.OffchainResponse({filter}, listener));
		eventEmitters.push(subscriber.zapDispatch.contract.events.OffchainResponseInt({filter}, listener));
		eventEmitters.push(subscriber.zapDispatch.contract.events.OffchainResult1({filter}, listener));
		eventEmitters.push(subscriber.zapDispatch.contract.events.OffchainResult2({filter}, listener));
		eventEmitters.push(subscriber.zapDispatch.contract.events.OffchainResult3({filter}, listener));
		eventEmitters.push(subscriber.zapDispatch.contract.events.OffchainResult4({filter}, listener));
	});
}

/**
 * Returns a provider paramater
 * @param provider ZapProvider
 * @param key utf8 string
 */
export function getProviderParam(provider: ZapProvider, key: string): Promise<string> {
	return provider.zapRegistry.contract.methods.getProviderParameter(provider.providerOwner, utf8ToHex(key)).call().then(decodeParam);
}

/**
 * Sets provider paramater
 * @param provider ZapProvider
 * @param key utf8 string
 * @param param string or hex
 */
export function setProviderParam(provider: ZapProvider, key: string, param): Promise<txid> {
	return provider.zapRegistry.contract.methods.setProviderParameter(utf8ToHex(key), encodeParam(param))
		.send({from: provider.providerOwner, gas: DEFAULT_GAS});
}

/**
 * Returns an array of params
 * @param provider ZapProvider
 * @param endpoint utf8 string
 */
export function getEndpointParams(provider: ZapProvider, endpoint: string): Promise<string[]> {
	return provider.getEndpointParams(endpoint).then((params: any) => params.map(decodeParam));
}

/**
 * Sets endpoints params
 * @param provider ZapProvider
 * @param endpoint utf8 string
 * @param params array of strings or hex
 */
export function setEndpointParams(provider: any, endpoint: string, params: string[]): Promise<txid>{
	const encodedParams = params.map(encodeParam);
	return provider.setEndpointParams(utf8ToHex(endpoint), encodedParams);
}

/* export async function doResponses(web3: any) {
	const address: string = await loadAccount(web3);
	const provider: ZapProvider = await loadProvider(web3, address);

	// Queries that need to be answered
	const unanswered: any[] = [];

	const nextQuery = () => {
		return new Promise((resolve, reject) => {
			let fulfilled = false;
			provider.listenQueries({}, (err: any, data: any) => {
				// Only call once
				if ( fulfilled ) return;
				fulfilled = true;

				// Output response
				if ( err ) reject(err);
				else       resolve(data.returnValues);
			});
		});
	};

	while ( true ) {
		console.log('Waiting for the next query...');

		const data: any = await nextQuery();

		console.log(`Query [${web3.utils.hexToUtf8(data.endpoint)}]: ${data.query}`);

		const res: string = await ask('Response> ');
		const parts: string[] = (res.match(/.{1,32}/g) || []).map(web3.utils.utf8ToHex);

		const tx: string | any = await provider.respond({
			queryId: data.id,
			responseParams: parts,
			dynamic: true
		});

		console.log(`Transaction Hash: ${typeof tx == 'string' ? tx : tx.transactionHash}\n`);
	}
} */