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

describe('Testing promises as lies', function(){
	it('should resolve', function(){
		var lie = new Lie(), test = {};
		var spy = sinon.spy(function success(value){ value.should.equal(test); });
		lie.yes(spy);
		lie.true = test;
		spy.should.have.been.calledOnce;
	});
	it('should reject', function(){
		var lie = new Lie(), spy = sinon.spy();
		lie.no(spy);
		lie.false;
		spy.should.have.been.calledOnce;
	});
	it('should notify', function(){
		var lie = new Lie(), spy = sinon.spy();
		lie.maybe(spy);
		lie.big;
		spy.should.have.been.calledOnce;
	});
	it('should do all together', function(){
		var goodLie = new Lie(), goodTest = {};
		var badLie = new Lie(), badTest = {};
		var updateTest = {};
		var resolve = sinon.spy(function(value){ value.should.equal(goodTest); });
		var reject = sinon.spy(function(value){ value.should.equal(badTest); });
		var notify = sinon.spy(function(value){ value.should.equal(updateTest); });
		goodLie.yes(resolve);
		goodLie.no(reject);
		goodLie.maybe(notify);
		badLie.yes(resolve);
		badLie.no(reject);
		badLie.maybe(notify);
		goodLie.big = updateTest;
		goodLie.true = goodTest;
		badLie.big = updateTest;
		badLie.false = badTest;
		badLie.big;
		resolve.should.have.been.calledOnce;
		reject.should.have.been.calledOnce;
		notify.should.have.been.calledTwice;
	});
});