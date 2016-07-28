"use strict"

function parse(str){
	var parses= /(.*?)\${(.*?)}/g
	var literals= []
	var exprs= []
	var loop
	var index= 0
	while((loop= parses.exec( str)) !== null){
		var literal = loop[1]
		literals.push( literal)
		var expr= loop[2]
		exprs.push( expr)
		index= loop.index + literal.length + expr.length + 3
	}
	literals.push( str.slice( index))
	function execute( ctx, eval_){
		eval_= eval_|| eval
		var ctxStrs= []
		for( var i in ctx){
			ctxStrs.push( i, "=", JSON.stringify( ctx[ i]), ";")
		}
		var ctxStr= ctxStrs.join( "")
		var expr= []
		for( var i= 0; i< execute.exprs.length; ++i){
			var val= eval_( ctxStr + execute.exprs[ i])
			expr.push( execute.literals[i], val)
		}
		expr.push( execute.literals[ i]|| "")
		return expr.join( "")
	}
	execute.literals= literals
	execute.exprs= exprs
	return execute
}

module.exports = parse

if(require.main === module){
	var str= process.argv.slice( 2).join( " ")
	var parsed= parse( str)
	var exec= parsed({ a:"alpha", z:"omega"})
	console.log( exec)
}
