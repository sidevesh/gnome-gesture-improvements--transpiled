/* eslint-disable @typescript-eslint/no-explicit-any */
/* exported easeActor, easeAdjustment */
export function easeActor(actor, params) {
	actor.ease(params);
}

export function easeAdjustment(actor, value, params) {
	actor.ease(value, params);
}
