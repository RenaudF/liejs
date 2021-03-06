// chai must be required through requirejs, chai-as-promised
// sinon and should are already exported to the global scope
var assert = chai.assert;
var expect = chai.expect;

describe('Testing environment', function () {
	it('should work with chai', function () {
		assert.equal('test', 'test');
		expect('test').to.equal('test');
		('test').should.equal('test');
	});
	it("should work with sinon", function () {
		var spy = sinon.spy();
		spy.should.not.have.been.called;
	});
	it('should work asynchronously', function(done){
		// using deferred syntax
		var promise = new Promise(function(resolve, reject) { setTimeout(resolve, 500); });
		promise.should.eventually.be.fulfilled.notify(done);
	});
});

describe('Testing resolution', function(){
	it('should resolve something', function(){
		var lie = new Lie(), test = {};
		var resolve = sinon.spy(function(value){ value.should.equal(test); });
		lie.yes(resolve).resolve(test);
		resolve.should.have.been.calledOnce;
	});
	it('shouldn\'t resolve after rejection', function(){
		var lie = new Lie();
		var resolve = sinon.spy();
		lie.yes(resolve).reject().resolve();
		resolve.should.not.have.been.called;
	});
	it('shouldn\'t resolve multiple times', function(){
		var lie = new Lie();
		var resolve = sinon.spy();
		lie.yes(resolve).resolve().resolve();
		resolve.should.have.been.calledOnce;
	});
});

describe('Testing rejection', function(){
	it('should reject something', function(){
		var lie = new Lie(), test = {};
		var spy = sinon.spy(function(value){ value.should.equal(test); });
		lie.no(spy).reject(test);
		spy.should.have.been.calledOnce;
	});
	it('shouldn\'t reject after resolving', function(){
		var lie = new Lie();
		var reject = sinon.spy();
		lie.no(reject).resolve().reject();
		reject.should.not.have.been.called;
	});
	it('shouldn\'t reject multiple times', function(){
		var lie = new Lie();
		var reject = sinon.spy();
		lie.no(reject).reject().reject();
		reject.should.have.been.calledOnce;
	});
});

describe('Testing notification', function(){
	it('should notify something', function(){
		var lie = new Lie(), test = {};
		var notify = sinon.spy(function(value){ value.should.equal(test); });
		lie.maybe(notify).notify(test);
		notify.should.have.been.calledOnce;
	});
	it('should notify multiple times', function(){
		var lie = new Lie();
		var notify = sinon.spy();
		lie.maybe(notify).notify().notify();
		notify.should.have.been.calledTwice;
	});
	it('shouldn\'t notify after resolve', function(){
		var lie = new Lie();
		var notify = sinon.spy();
		lie.maybe(notify).notify().resolve().notify();
		notify.should.have.been.calledOnce;
	});
	it('shouldn\'t notify after reject', function(){
		var lie = new Lie();
		var notify = sinon.spy();
		lie.maybe(notify).notify().reject().notify();
		notify.should.have.been.calledOnce;
	});
});

describe('Testing chaining', function(){
	it('should chain lies', function(){
		var add = sinon.spy(function(x){ return x+1; });
		var check = sinon.spy(function(x){ x.should.equal(2); });
		var head = new Lie();
		head.forward.yes(add).then.forward.yes(add).then.yes(check);
		head.resolve(0);
		add.should.have.been.calledTwice;
		check.should.have.been.calledOnce;
	});
	it('should forward values when no handlers', function(){
		var resolve = sinon.spy(function(value){ value.should.be.defined; });
		var lie = new Lie().then.yes(resolve);
		lie.resolve({});
		resolve.should.have.been.calledOnce;
	});
	it('should not forward to the wrong channels', function(){
		var resolve = sinon.spy(), reject = sinon.spy(), notify = sinon.spy();
		// resolve
		var lie = new Lie();
		lie.forward.then.yes(resolve).no(reject).maybe(notify);
		lie.resolve();
		resolve.should.have.been.calledOnce;
		reject.should.not.have.been.called;
		notify.should.not.have.been.called;
		// reject
		lie = new Lie();
		lie.forward.then.yes(resolve).no(reject).maybe(notify);
		lie.reject();
		resolve.should.have.been.calledOnce;
		reject.should.have.been.calledOnce;
		notify.should.not.have.been.called;
		// notify
		lie = new Lie();
		lie.forward.then.yes(resolve).no(reject).maybe(notify);
		lie.notify();
		resolve.should.have.been.calledOnce;
		reject.should.have.been.calledOnce;
		notify.should.have.been.calledOnce;
	});
	it('should be possible to switch channel', function(){
		var resolve = sinon.spy(function(x){ console.log('resolve',x++); this.then.notify(x); return x; });
		var notify = sinon.spy(function(x){ console.log('notify',x++); this.then.reject(x); return x; });
		var reject = sinon.spy(function(x){ console.log('reject',x++); this.then.resolve(x); return x; });
		var lie = new Lie();
		lie.forward.yes(resolve).maybe(notify).no(reject)
			.then.forward.yes(resolve).maybe(notify).no(reject)
			.then.forward.yes(resolve).maybe(notify).no(reject)
			.then.yes(resolve).maybe(notify).no(reject);
		lie.resolve(0);
		resolve.should.have.been.calledThrice;
		reject.should.have.been.calledOnce;
		notify.should.have.been.calledOnce;
	});
	it('should support asynchronous forwarding', function(done){
		var resolve = sinon.spy(function(){ setTimeout(this.then.resolve.bind(this.then),500); });
		var lie = new Lie();
		lie.yes(resolve).then.yes(done);
		lie.resolve();
	});
});

describe('Testing it all together', function(){
	it('should do all together', function(){
		var goodTest = {}, badTest = {}, updateTest = {};
		var resolve = sinon.spy(function(value){ value.should.equal(goodTest); });
		var reject = sinon.spy(function(value){ value.should.equal(badTest); });
		var notify = sinon.spy(function(value){ value.should.equal(updateTest); });
		var goodLie = new Lie().yes(resolve).no(reject).maybe(notify);
		var badLie = new Lie().yes(resolve).no(reject).maybe(notify);
		goodLie.notify(updateTest).resolve(goodTest);
		badLie.notify(updateTest).reject(badTest).notify();
		resolve.should.have.been.calledOnce;
		reject.should.have.been.calledOnce;
		notify.should.have.been.calledTwice;
	});
});