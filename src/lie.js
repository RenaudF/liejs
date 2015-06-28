function Lie(){
	var pending=true;

	Object.defineProperty(this, 'yes', { value: function(f){ this.yes.then = f; } });
	Object.defineProperty(this, 'true', {
		get: function(){ this.true=true; return this.yes.yet; },
		set: function(value){ if (pending) { pending=false; this.yes.yet=value; this.yes.then.call(null, this.yes.yet);} }
	});

	Object.defineProperty(this, 'no', { value: function(f){ this.no.then = f; } });
	Object.defineProperty(this, 'false', {
		get: function(){ this.false=true; return this.no.yet; },
		set: function(value){ if (pending) { pending=false; this.no.yet=value; this.no.then.call(null, this.no.yet);} }
	});

	Object.defineProperty(this, 'maybe', { value: function(f){ this.maybe.then = f; } });
	Object.defineProperty(this, 'big', {
		get: function(){ this.big = this.maybe.yet; },
		set: function(value){ if (pending) { this.maybe.yet=value; this.maybe.then.call(null, this.maybe.yet);} }
	});
}