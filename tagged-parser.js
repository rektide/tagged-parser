function parse(str){
	var parses= /(.*?)\${(.*?)}/g
	var literals= []
	var expr= []
	var loop
	var index= 0
	while((loop= parses.exec(str)) !== null){
		literals.push(loop[1])
		expr.push(loop[2])
		index= loop.index
	}
	literals.push(str.slice(index))
	function execute(ctx, eval_){
		eval_ = eval_ || eval
	}
	execute.literals = literals
	execute.expr = expr
	return execute
}

module.exports = parse

if(require.main === module){
	var str= process.argv.slice(2).join(" ")
	console.log("input", str)
	var parsed= parse(str)
	console.log("parse", parsed)
	var exec= parsed({a:"alpha", z:"omega"})
	console.log("exec", exec)
}
