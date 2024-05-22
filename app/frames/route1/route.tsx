/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "../frames";
import { isValidAddress, getTokenData } from "@/utils/api";

const handleRequest = frames(async ctx => {
	const addressOne = ctx.message?.inputText || "";
	let state = ctx.state;

	if (!isValidAddress(addressOne)) {
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

	try {
		const tokenDataOne = await getTokenData(addressOne);

		if (!tokenDataOne) {
			return {
				image: <div tw='flex'>Error fetching data</div>,
				state: state
			};
		}

		state = { ...state, addressOne: addressOne, tokenOneData: tokenDataOne };
		return {
			image: (
				<div tw='text-white w-full h-full justify-center items-center flex bg-slate-900'>
					{`So you want to compare ${tokenDataOne.symbol}?`}
				</div>
			),
			buttons: [
				<Button action='post' target={{ pathname: "/route2" }}>
					Next Address
				</Button>
			],
			textInput: "Insert address 2",
			state: state
		};
	} catch (error) {
		return {
			image: <div tw='flex'>Error fetching data</div>,
			state: state
		};
	}
});

export const GET = handleRequest;
export const POST = handleRequest;
