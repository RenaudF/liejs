/* liejs - v0.0.0 - 2015-06-29
 * Copyright (c) 2015 Renaud Fontana <sirgzu@hotmail.com>
 * Licensed MIT */
function Lie(){
	var pending=true;
	Object.defineProperty(this, 'pending', {get: function(){ return pending; } });

	var then;
	Object.defineProperty(this, 'then', {get: function(){ then = then || new Lie(); return then; } });

	var autoforward;
	Object.defineProperty(this, 'forward', {get: function(){ autoforward=true; return this; } });
	Object.defineProperty(this, 'block', {get: function(){ autoforward=false; return this; } });

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
			if (autoforward && then) then.resolve(this.yes.out);
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
			if (autoforward && then) then.reject(this.no.out);
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
			if (autoforward && then) then.notify(this.maybe.out);
		};
		return this;
	} });
}