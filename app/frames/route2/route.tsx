/* eslint-disable react/jsx-key */
import { frames } from "../frames";

interface TokenData {
	symbol: string;
	usdPrice: number;
	fdv: number;
}

const isValidAddress = (address: string) => {
	if (!address) return false;
	return true;
};

const getTokenData = async (address: string) => {
	const url = `https://api.dexscreener.com/latest/dex/search?q=${address}`;
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Network response was not ok: ${response.statusText}`);
		}
		const data = await response.json();
		const symbol = `$${data.pairs[0].baseToken.symbol}`;
		const usdPrice = data.pairs[0].priceUsd;
		let fdv = data.pairs[0].fdv;
		let fdvString = fdv.toString();

		if (fdv > 1000000000) {
			fdvString = (fdv / 1000000000).toFixed(2) + "B";
		} else if (fdv > 1000000) {
			fdvString = (fdv / 1000000).toFixed(2) + "M";
		} else {
			fdvString = (fdv / 1000).toFixed(2) + "K";
		}
		return { symbol, usdPrice, fdv, fdvString };
	} catch (error) {
		console.error("Fetch error:", error);
		return null;
	}
};

const calculatePriceWithSameFDV = (tokenDataOne: TokenData, tokenDataTwo: TokenData) => {
	const fdvOne = tokenDataOne.fdv;
	const fdvTwo = tokenDataTwo.fdv;
	const priceOne = tokenDataOne.usdPrice;
	const priceTwo = tokenDataTwo.usdPrice;

	const multiplierOne = fdvTwo / fdvOne;
	const multiplierTwo = fdvOne / fdvTwo;

	const newPriceOne = multiplierOne * priceOne;
	const newPriceTwo = multiplierTwo * priceTwo;

	// find a nice way to format the numbers like 1.2278315987126877e-7
	const newPriceOneString = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 5
	}).format(newPriceOne);

	const newPriceTwoString = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 5
	}).format(newPriceTwo);

	return { newPriceOne, newPriceTwo, multiplierOne, multiplierTwo, newPriceOneString, newPriceTwoString };
};

const handleRequest = frames(async ctx => {
	let state = ctx.state;
	const addressOne = state.addressOne;
	const addressTwo = ctx.message?.inputText || "";

	if (!isValidAddress(addressOne) || !isValidAddress(addressTwo)) {
		return {
			image: <div tw='flex'>Invalid address</div>,
			state: state
		};
	}
	state = { ...state, addressTwo };

	try {
		const tokenDataOne = await getTokenData(addressOne);
		const tokenDataTwo = await getTokenData(addressTwo);
		if (!tokenDataOne || !tokenDataTwo) {
			return {
				image: <div tw='flex'>Error fetching data</div>,
				state: state
			};
		}
		const { newPriceOneString, newPriceTwoString, multiplierOne, multiplierTwo } = calculatePriceWithSameFDV(
			tokenDataOne,
			tokenDataTwo
		);

		const amountToBeAMillionaire = 1000000 / multiplierOne;

		return {
			image: (
				<div tw='flex flex-col items-center p-4 bg-custom-dark text-black rounded-lg'>
					<div tw='flex font-bold mb-4 text-xl'>
						<span tw='text-green-300'> {tokenDataOne.symbol} WITH THE FDV CAP OF</span>
						<span tw='text-blue-400'> {tokenDataTwo.symbol} </span>
					</div>
					<div tw='flex items-center mb-4'>
						<span tw='flex text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold'>
							{newPriceOneString}
						</span>
						<span tw='flex text-green-500 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold ml-2'>
							({multiplierOne.toFixed(2)}x)
						</span>
					</div>
				</div>
			),
			state: state
		};
	} catch (error) {
		console.error("Fetch error:", error);
		return {
			image: <div tw='flex'>Error fetching data</div>,
			state: state
		};
	}
});

export const GET = handleRequest;
export const POST = handleRequest;
