function Lie(){
	var pending=true;
	Object.defineProperty(this, 'pending', {get: function(){ return pending; } });

	Object.defineProperty(this, 'yes', { value: function(f){
		this.yes.callback = f;
		return this;
	} });
	Object.defineProperty(this, 'resolve', { value: function(value){
		if (pending) {
			pending=false;
			this.yes.value=value;
			if (this.yes.callback) this.yes.callback.call(null, this.yes.value);
		}
		return this;
	} });

	Object.defineProperty(this, 'no', { value: function(f){
		this.no.callback = f;
		return this;
	} });
	Object.defineProperty(this, 'reject', { value:function(value){
		if (pending) {
			pending=false;
			this.no.value=value;
			if (this.no.callback) this.no.callback.call(null, this.no.value);
		};
		return this;
	} });

	Object.defineProperty(this, 'maybe', { value: function(f){
		this.maybe.callback = f;
		return this;
	} });
	Object.defineProperty(this, 'notify', { value: function(value){
		if (pending) {
			this.maybe.value=value;
			if (this.maybe.callback) this.maybe.callback.call(null, this.maybe.value);
		};
		return this;
	} });
}