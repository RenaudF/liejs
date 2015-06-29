function Lie(){
	var pending=true;
	Object.defineProperty(this, 'pending', {get: function(){ return pending; } });

	var then;
	Object.defineProperty(this, 'then', {get: function(){ then = then || new Lie(); return then; } });

	function identity(x){ return x; }

	Object.defineProperty(this, 'yes', { value: function(f){
		this.yes.callback = f;
		return this;
	} });
	this.yes.callback = identity;
	Object.defineProperty(this, 'resolve', { value: function(value){
		if (pending) {
			pending=false;
			this.yes.in = value;
			this.yes.out = this.yes.callback.call(this, value);
			if (then) then.resolve(this.yes.out);
		}
		return this;
	} });

	Object.defineProperty(this, 'no', { value: function(f){
		this.no.callback = f;
		return this;
	} });
	this.no.callback = identity;
	Object.defineProperty(this, 'reject', { value:function(value){
		if (pending) {
			pending=false;
			this.no.in = value;
			this.no.out = this.no.callback.call(this, value);
			if (then) then.reject(this.no.out);
		};
		return this;
	} });

	Object.defineProperty(this, 'maybe', { value: function(f){
		this.maybe.callback = f;
		return this;
	} });
	this.maybe.callback = identity;
	Object.defineProperty(this, 'notify', { value: function(value){
		if (pending) {
			this.maybe.in = value;
			this.maybe.out = this.maybe.callback.call(this, value);
			if (then) then.notify(this.maybe.out);
		};
		return this;
	} });
}