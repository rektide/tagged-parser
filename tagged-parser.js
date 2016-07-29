"use strict"

function parse(str){
	// parse str
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
		eval_= eval_|| module.exports.defaults.eval
		if( taggedTemplater|| taggedTemplater=== false){
			// evaluate all expressions
			var expr= [execute.literals] // will 'apply' expr to templater. first param: literal array.
			var i;
			for(i= 0; i< execute.exprs.length; ++i){
				var val= eval_( ctx, execute.exprs[ i], execute)
				expr.push(val) // gather expr
			}

			if( taggedTemplater){
				// run tagged templater
				return taggedTemplater.apply(null, expr)
			}else{ // === false
				// pass back raw components to apply to a tagged templater
				return expr
			}
		}else{

			// evaluate all expressions
			var expr= []
			var i;
			for(i= 0; i< execute.exprs.length; ++i){
				var val= eval_( ctx, execute.exprs[ i], execute)
				expr.push( execute.literals[i], val) // concat in pieces
			}
	
			// execute a condensed equivalent to String.raw
			expr.push( execute.literals[ i]|| "")
			return expr.join( "")
		}
	}
	execute.literals= literals
	execute.exprs= exprs
	execute.eval= module.exports.defaults.eval
	execute.serialize= module.exports.defaults.serialize
	return execute
}

function defaultSerialize( ctx/*, execute*/){
	// serialize context
	if( typeof ctx=== "object"){
		var ctxStrs= []
		for( var i in ctx){
			ctxStrs.push( "var ", i, "=", JSON.stringify( ctx[ i]), ";")
		}
		ctx= ctxStrs.join( "")
	}
	ctx= ctx || ""
	return ctx
}

function defaultEval( ctx, expr, execute){
	var ser= execute.serialize( ctx, execute)
	return eval( ser+ expr)
}

module.exports= parse
module.exports.defaults= {
	serialize: defaultSerialize,
	eval: defaultEval
}

if(require.main === module){
	var str= process.argv.slice( 2).join( " ")
	var parsed= parse( str)
	var exec= parsed({ a:"alpha", z:"omega"})
	console.log( exec)
}
