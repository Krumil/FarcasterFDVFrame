/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "./frames";

const handleRequest = frames(async ctx => {
	return {
		image: <div tw='flex bg-purple'>{`Compare every coin market cap`}</div>,
		buttons: [
			<Button action='post' target={{ pathname: "/route1" }}>
				Next Step
			</Button>
		],
		textInput: "Insert address 1"
	};
});

export const GET = handleRequest;
export const POST = handleRequest;
