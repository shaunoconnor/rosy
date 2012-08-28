define(function () {
	
	var state = {
		currentState : null,
		transitionState : null,
		changeState : function (a) {
			state.currentState = a;
			if (state.onChange) {
				state.onChange(state.transitionState);
			}
		},
		changeTransitionState : function (a) {
			state.transitionState = a;
			if (state.onTransitionChange) {
				state.onTransitionChange(state.transitionState);
			}
		},
		onChange : null,
		onTransitionChange : null
	};

	return state;
});