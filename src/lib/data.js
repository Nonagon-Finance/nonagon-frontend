import { get } from 'svelte/store'

import { selectProduct, selectCurrency, getPoolInfo, getCapPoolInfo } from './methods'
import { getUserOrders, getUserPositions, getPoolStats } from './graph'
 
import { currentPage } from './stores'

// Fetchs appropriate data from contracts and APIs. Called on route or signer change
export function hydrateData() {

	const _currentPage = get(currentPage);

	// console.log('hydrateData', _currentPage);
	// DONE WBTC

	if (_currentPage == 'trade') {
		selectProduct();
		selectCurrency();
		getUserOrders();
		getUserPositions();
	} else if (_currentPage == 'pool') {
		getPoolInfo('snx');
		getPoolInfo('tusd');
		getPoolInfo('wbtc');		
		getPoolInfo('weth');
		getPoolInfo('usdc');
		getPoolStats('snx');
		getPoolStats('tusd');
		getPoolStats('wbtc');		
		getPoolStats('weth');
		getPoolStats('usdc');
		getCapPoolInfo();
	}

}