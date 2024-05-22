/* eslint-disable react/jsx-key */
import { frames } from "../frames";
import { Button } from "frames.js/next";
import { isValidAddress, getTokenData, TokenData } from "@/utils/api";

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
	const addressTwo = ctx.message?.inputText || "";

	if (!isValidAddress(addressTwo)) {
		return {
			image: <div tw='flex'>Invalid address</div>,
			buttons: [
				<Button action='post' target={{ pathname: "/" }}>
					Try again
				</Button>
			],
			state: state
		};
	}
	state = { ...state, addressTwo };

	try {
		const tokenDataTwo = await getTokenData(addressTwo);
		const tokenDataOne = state.tokenOneData;
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
				<div tw='flex flex-col w-full h-full justify-center items-center bg-slate-900 text-black rounded-lg text-white'>
					<div tw='flex text-4xl mb-4 justify-center items-center'>
						<span tw='text-6xl font-bold text-green-300'> {tokenDataOne.symbol} </span>
						<span tw='mx-2'> WITH THE FDV CAP OF </span>
						<span tw='text-6xl font-bold text-indigo-400'> {tokenDataTwo.symbol} </span>
					</div>
					<div tw='flex items-center mb-4'>
						<span tw='flex text-4xl font-bold mr-2'>{newPriceOneString}</span>
						<span tw={`flex ${multiplierOne > 1 ? "text-green-500" : "text-red-500"} text-4xl font-bold`}>
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
