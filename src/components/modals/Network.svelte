<script>
	import Modal from '../modals/Modal.svelte'
	import Button from '../layout/Button.svelte'

	import { switchChains } from '../../lib/wallet'
</script>

<style>

	.note {
		padding: var(--base-padding);
		line-height: 1.618;
	}

</style>

<Modal title='Invalid Network' showHeader={true} showCancel={true}>

	<div class='note'>
		Select Optimism as your wallet's network to trade or pool on ONA. Switch network inside your wallet.
	</div>

	

</Modal>