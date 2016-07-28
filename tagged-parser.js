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
	function execute( ctx, taggedTemplater, eval_){
		eval_= eval_|| eval
		var templater= !!taggedTemplater|| taggedTemplater=== false

		// serialize context
		if( typeof ctx=== "object"){
			var ctxStrs= []
			for( var i in ctx){
				ctxStrs.push( i, "=", JSON.stringify( ctx[ i]), ";")
			}
			ctx= ctxStrs.join( "")
		}
		ctx= ctx || ""

		// evaluate all expressions
		var expr= templater ? [execute.literals] : []
		for(var i= 0; i< execute.exprs.length; ++i){
			var val= eval_( ctx+ execute.exprs[ i])
			if( templater){
				expr.push(val) // gather expr
			}else{
				expr.push( execute.literals[i], val) // concat in pieces
			}
		}

		if( taggedTemplater){
			// run tagged templater
			return taggedTemplater.apply(null, expr)
		}else if( taggedTemplater=== false){
			// pass back raw components to apply to a tagged templater
			return expr
		}else{
			// execute a condensed equivalent to String.raw
			expr.push( execute.literals[ i]|| "")
			return expr.join( "")
		}
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
