import { createFrames } from "frames.js/next";

export type State = {
	addressOne: String;
	addressTwo: String;
};

export const frames = createFrames({
	basePath: "/frames",
	initialState: {
		addressOne: "0x69c7bd26512f52bf6f76fab834140d13dda673ca",
		addressTwo: "0xa43fe16908251ee70ef74718545e4fe6c5ccec9f"
	}
});
