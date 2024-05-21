/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "../frames";

const handleRequest = frames(async ctx => {
	// Todo: check if the input is a valid address and redirect to the error route if not
	let state = ctx.state;
	state = { ...state, addressOne: ctx.message?.inputText || "" };

	return {
		image: <div tw='flex'>{`Input: ${ctx.message?.inputText}`}</div>,
		buttons: [
			<Button action='post' target={{ pathname: "/route2" }}>
				Go to route 2
			</Button>
		],
		textInput: "Insert address 2",
		state: state
	};
});

export const GET = handleRequest;
export const POST = handleRequest;
