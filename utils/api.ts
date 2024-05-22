import { JsonObject } from "frames.js/types";

export interface TokenData extends JsonObject {
	symbol: string;
	usdPrice: number;
	fdv: number;
	fdvString: string;
}

export const getTokenData = async (address: string) => {
	const url = `https://api.dexscreener.com/latest/dex/search?q=${address}`;
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Network response was not ok: ${response.statusText}`);
		}
		const data = await response.json();
		let symbol = data.pairs[0].baseToken.symbol;
		if (!symbol.startsWith("$")) {
			symbol = "$" + symbol;
		}
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

export const isValidAddress = (address: string) => {
	if (!address) return false;
	return true;
};
