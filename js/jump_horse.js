var JumpHorse = function () {
	this._mCards = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S0', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D0'];
	this._deck = [];
};

JumpHorse.prototype.shuffle = function() {
	this._deck = [];
	
	var deck = [];
	for (var i=0; i<this._mCards.length; i++) {
		deck.push(this._mCards[i]);
	}
	
	while (this._deck.length < this._mCards.length) {
		var r = Math.floor(Math.random() *deck.length);
		this._deck.push(deck[r]);
		deck.splice(r, 1);
	}
};

JumpHorse.prototype.card = function() {
	return this._deck.pop();
};
