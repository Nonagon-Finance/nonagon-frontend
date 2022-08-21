// Connects to contracts deduced from router, initializes with ethers js
import { get } from 'svelte/store'
import { ethers } from 'ethers'
import { CHAINDATA, ABIS } from './constants'
import { showModal, hideModal } from './utils'
import * as Stores from './stores'

let router;
let contracts = {};
let ack_network = false;

export async function getContract(contractName, withSigner, _currencyLabel) {

	// console.log('gc', contractName, withSigner, _currencyLabel);

	const _signer = get(Stores.signer);

	if (_currencyLabel) {
		contractName += _currencyLabel;
	}

	const _chainId = get(Stores.chainId);
	const _provider = get(Stores.provider);

	// console.log('_chainId', _chainId, _provider, ack_network, CHAINDATA[_chainId]);

	if (!_chainId || !_provider) return;

	if (!CHAINDATA[_chainId]) {
		Stores.wrongNetwork.set(true);
		if (!ack_network) {
			showModal('Network');
			// ack_network = true;
		}
		return;
	}
	
	// hideModal();
	Stores.wrongNetwork.set(false);

	if (contracts[contractName]) {
		if (withSigner) {
			return contracts[contractName].connect(_signer);
		}
		return contracts[contractName];
	}

	if (!router) {
		const routerAddress = CHAINDATA[_chainId].router;
		const routerAbi = ABIS.router;
		router = new ethers.Contract(routerAddress, routerAbi, _provider);
	}

	if (contractName == 'router') return router;

	const currencies = CHAINDATA[_chainId].currencies;

	// Currencies (ERC20)
	if (!contracts['weth'] || !contracts['usdc']) {	
		for (const currencyLabel in currencies) {
			contracts[currencyLabel] = new ethers.Contract(currencies[currencyLabel], ABIS.erc20, _provider);
		}
	}

	// ONA capital token (ERC20)
	if (!contracts['cap']) {
		const cap = CHAINDATA[_chainId].cap;
		contracts['cap'] = new ethers.Contract(cap, ABIS.erc20, _provider);
	}

	let address;

	const currency = currencies[_currencyLabel];

	let abiName = contractName;

	if (contractName.toLowerCase().includes('oldpoolrewards')) {
		if (_currencyLabel == 'weth') {
			address = '';
		} else if (_currencyLabel == 'usdc') {
			address = '';
		}
		abiName = 'rewards';
	} else if (contractName.toLowerCase().includes('oldpool')) {
		if (_currencyLabel == 'weth') {
			address = '';
		} else if (_currencyLabel == 'usdc') {
			address = '';
		}
		abiName = 'pool';
	} else if (contractName.toLowerCase().includes('poolrewards')) {
		address = await router.getPoolRewards(currency);
		// if (_currencyLabel == 'weth') {
		// 	address = '';
		// } else if (_currencyLabel == 'usdc') {
		// 	address = '';
		// }
		abiName = 'rewards';
	} else if (contractName.toLowerCase().includes('caprewards')) {
		address = await router.getCapRewards(currency);
		abiName = 'rewards';
	} else if (contractName == 'capPool') {
		address = await router[contractName]();
		abiName = 'pool';
	} else if (contractName.toLowerCase().includes('pool')) {
		address = await router.getPool(currency);
		// if (_currencyLabel == 'weth') {
		// 	address = '';
		// } else if (_currencyLabel == 'usdc') {
		// 	address = '';
		// }
		abiName = 'pool';
	} else {
		address = await router[contractName]();
	}
		
	// console.log('contract address', abiName, address);
	
	const abi = ABIS[abiName];

	contracts[contractName] = new ethers.Contract(address, abi, _provider);

	// console.log('contracts', contracts);

	if (withSigner) {
		return contracts[contractName].connect(_signer);
	}
	return contracts[contractName];

}