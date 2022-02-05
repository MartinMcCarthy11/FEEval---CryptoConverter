/*
 * https://frontendeval.com/questions/crypto-converter
 *
 * Create a Cryptocurrency converter
 */
//Get current currency selection
//Get conversion rate throiugh api call with current currency
//Calculate cyrpto value
{
	let currentCurrency = '';
	let currencyTotalAmount = 0;
	let conversionRate = '';
	let currentCryptoValue = 0;
	const cryptoStack = [];
	const url = 'https://api.frontendeval.com/fake/crypto/';
	const currentCryptoValueSpan =
		document.getElementById('currentCryptoValue');

	const currencySelector = document.getElementById('currencySelector');
	currencySelector.addEventListener('change', async function () {
		currentCurrency = this.value;
		await getCryptoAmount(url, (currentCurrency = 'USD'));
		compareCryptoValue(currentCryptoValue);
	});

	const currencyFormatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});

	function debounce(func, wait, immediate) {
		let timeout;
		return function () {
			const context = this,
				args = arguments;
			const later = function () {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			const callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	}

	const getInputAmount = async function (e) {
		currencyTotalAmount = e.target.value;
		await getCryptoAmount(url, (currentCurrency = 'USD'));
		compareCryptoValue(currentCryptoValue);
	};

	const debouncedGetInputAmount = debounce(getInputAmount, 500);

	const currencyInput = document.getElementById('currencyInput');
	currencyInput.addEventListener('keyup', async (e) => {
		await debouncedGetInputAmount(e);
	});

	const getCryptoAmount = async (url, currencyType) => {
		await fetch(`${url}${currencyType}`)
			.then((response) => response.json())
			.then((data) => (conversionRate = data.value));
		currentCryptoValue = calculateCryptoValue(
			conversionRate,
			currencyTotalAmount
		);
		currentCryptoValueSpan.textContent = `${currentCryptoValue.toLocaleString(
			'en-US',
			{ maximumFractionDigits: 2 }
		)} WUC`;
	};

	const calculateCryptoValue = (conversionRate, currencyTotalAmount = 0) =>
		conversionRate * currencyTotalAmount;

	//Refresh cyrpto value every 10 seconds
	//make call to api every 10 seconds
	//recalculate cryptovalue
	const recalculateEveryTenSeconds = setInterval(async function () {
		await getCryptoAmount(url, (currentCurrency = 'USD'));
		compareCryptoValue(currentCryptoValue);
	}, 10000);

	recalculateEveryTenSeconds;

	// store current crypto value in stack
	// compare new value every 10 seconds
	// present didffernce
	// green up arrow for increase
	// red down arrow for decrease
	const compareCryptoValue = (currentCryptoValue) => {
		const priceChangeSinceLastUpdateSpan = document.getElementById(
			'priceChangeSinceLastUpdate'
		);
		let difference = 0;
		//check if stack is empty rteturn null if so
		//compare currentCrptyoValue to stack[0]
		//if greater then or less then vreturn difference and attach class
		if (cryptoStack.length === 0) {
			priceChangeSinceLastUpdateSpan.textContent = 0;
			cryptoStack.push(currentCryptoValue);
		} else if (cryptoStack[0] < currentCryptoValue) {
			difference =
				cryptoStack[0] - currentCryptoValue < 0
					? (cryptoStack[0] - currentCryptoValue) * -1
					: cryptoStack[0] - currentCryptoValue;
			priceChangeSinceLastUpdateSpan.classList = '';
			priceChangeSinceLastUpdateSpan.classList.add('cryptoGreaterThan');
			priceChangeSinceLastUpdateSpan.textContent =
				difference.toFixed(2) * 1;
			cryptoStack.pop();
			cryptoStack.push(currentCryptoValue);
		} else if (cryptoStack[0] > currentCryptoValue) {
			difference =
				currentCryptoValue - cryptoStack[0] < 0
					? (currentCryptoValue - cryptoStack[0]) * -1
					: currentCryptoValue - cryptoStack[0];
			priceChangeSinceLastUpdateSpan.classList = '';
			priceChangeSinceLastUpdateSpan.classList.add('cryptoLessThan');
			priceChangeSinceLastUpdateSpan.textContent =
				difference.toFixed(2) * 1;
			cryptoStack.pop();
			cryptoStack.push(currentCryptoValue);
		}

		// console.log("currentCryptoValue",currentCryptoValue)
		// console.log("cryptoStack",cryptoStack)
		// console.log("difference",difference)
	};
}
