jsPlumb.bind("ready", function() {
	
		
	// your jsPlumb related init code goes here

	console.log("jsPlumb is ready");
//	Canvas.Bind(); 
	
});						
		
if (typeof(Canvas) == 'undefined'){
	Canvas = {}
}


Canvas.Bind = function(id){


	//WORK IN PROGRESS!

	console.log("Attemping to bind");
//	jsPlumb.draggable($(".local_drop");
    jsPlumb.draggable($(".local_drop"),{
    	stop: function(){
    		$(this).addClass("ui-draggable-dragged");
    	}	
    });
    
	
	//jsPlumb.draggable($(".local_drop");
	var sourcePointOptions = {
		endpoint:"Dot",
		paintStyle:{ width:25, height:21, fillStyle:'#ff5ff2' },
		connectorStyle : { strokeStyle:"#666" },
		isTarget:true,
		anchor: "LeftMiddle"
	};
	var targetPointOptions = {
		endpoint:"Dot",
		paintStyle:{ width:25, height:21, fillStyle:'#ff5ff2' },
		isSource:true,
		connectorStyle : { strokeStyle:"#666" },
		anchor: "RightMiddle",
		connectorOverlays: [ [ "Arrow", { location:0.5 } ] ]
	};
	var endpoint = jsPlumb.addEndpoint($("#"+id), targetPointOptions);
	var newpoint = jsPlumb.addEndpoint($("#"+id), sourcePointOptions);

}









/*var canvas, context;

if (typeof(Canvas) == 'undefined'){
	Canvas = {
		canvas : '',
		context: ''
	}
}

Canvas.Init = function(){

    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    
    canvas.width = document.width;
    canvas.height = document.height;
    canvasW = canvas.width;
    canvasH = canvas.height;
    
}

Canvas.Line = {

	draw : function(fromX, fromY, toX, toY){
	
		//Local.Connections.ondrag;
		context.beginPath();
        context.moveTo(fromX, fromY);
        context.lineTo(toY, toY);
        context.stroke();
        
	}
	//update
}

window.onload = Canvas.Init();

*/