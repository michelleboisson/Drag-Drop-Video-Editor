$(document).ready(function(){
   
   var number = 0;
   var i = 0;
   
   Local.Init(number);
   
   //init canvas
   $("#videos").resize(function(e){
		$("canvas").height($("#videos").height());
		console.log($("canvas").height());
	});
   /* removed
   $("#add").live('click', function(){
   		Local.Init(number+=1);
   });
*/	


	$("#videos").sortable();
	$("#videos").disableSelection();
	
	$("#playallfs").live('click', function(){
		if ($("#fullscreenvids").length <= 0){
			$("#playallfs").text("Close Preview");
		
		$("._jsPlumb_endpoint").hide();
		$("._jsPlumb_connector").hide();
		$("._jsPlumb_overlay").hide();
		
		var allVideos = [];
				
		//loop through the elements in the dom, count the videos
		$("video").each(function(index){			
			allVideos.push($(this));
		});
		
		//$(".local_drop").
		console.log(allVideos.length);
		
		var fsVidHtml = "<div id='fullscreenvidsdiv'><video src='' id='fullscreenvids' class='video-js vjs-default-skin' preload='auto' height=360 width=640></video></div>";
		console.log(fsVidHtml);
		
		for (var j=0; j< allVideos.length; j++){
			console.log("pausing");
			allVideos[j][0].pause();
			allVideos[j][0].currentTime = 0;
			
		}
		
		
		$("#videos").before(fsVidHtml);
		$("#videos .local_drop").animate({
			opacity: 0.25,
			bottom: '0'
		}, 500, function() {
				// Animation complete.
				
				
			var r = 0;
			console.log("playing vids, switching.");
			$("#fullscreenvids").attr('src', allVideos[0].attr('src')).center(); 
			$("#fullscreenvids").get(0).play();
		
			$("#fullscreenvids").get(0).addEventListener("ended", function(){
				if (r < allVideos.length){
					r++;
					$(this).attr('src', allVideos[r].attr('src'));
					$("#fullscreenvids").get(0).play();
				}//r++;
				else{
					$("#videos .local_drop").animate({
						opacity: 1,
						bottom: '0'
					}, 500, function() {
						});
				}//close else
				
			});//video ended eventlistener
		//}
		
		var fsVids = document.getElementById("fullscreenvids");
		console.log(fsVids);
		fsVids.addEventListener('click', function(){
			this.webkitEnterFullscreen();
		});

				
				
				});//end function animate callback
				
		
		
		//document.getElementById("fullscreenvids").webkitEnterFullscreen();
		
		//play each video
		//allVideos[i][0].webkitEnterFullscreen();
		//allVideos[i][0].play();
		
	}//end if fullscreenvids exists
	else{
		$("#playallfs").text("Play Preview Fullscreen");
		$("#fullscreenvidsdiv").remove();
		$("#videos .local_drop").animate({opacity: 1}, 500);
		
		$("._jsPlumb_endpoint").show();
		$("._jsPlumb_connector").show();
		$("._jsPlumb_overlay").show();
	}
	});//playallfs click


	$("#playall").live('click', function(){
	
	
//		var c = jsPlumb.getConnections();
//		console.log(c[0].sourceId, c[0].targetId);

		var c = jsPlumb.getConnections(0); 	
		console.log(c);

		
		var allVideos = [];
		var firstVid;
		var lastVid;
		
		//loop through the elements in the dom, count the videos
		$("video").each(function(index){
			var parentID = $(this).parent().attr("id");
/*			
			if (!jsPlumb.isTarget($(this))){
				firstVid = parentID;
				console.log("firstVid", firstVid);
			}
			if (!jsPlumb.isSource($(this))){
				lastVid = parentID;
				console.log("lastVid", lastVid);
			}	
			
*/
			if($(this).get(0).paused == false){
				console.log("now playing", parentID);
				playNextConnected(parentID, -1); 
			}
			
			allVideos.push($(this));
		});

		for (var j=0; j< allVideos.length; j++){
			console.log("stopping all videos");
			allVideos[j][0].pause();
			allVideos[j][0].currentTime = 0;
			
		}
		
		//lined sequence
		//playNextConnected(firstVid, lastVid);
		
			var r = 0;
			console.log(allVideos.length +" movies to play");
			playNext(0, allVideos);
	});
	
	
});//end document ready


function playNext(v, allVideos){
					allVideos[v].get(0).play();
					allVideos[v].get(0).addEventListener("ended", function(){
						if (v < allVideos.length){
							console.log("updating r", v+1);
							playNext(v+1, allVideos);
						}else{
							return;
						}
					});
}

function playNextConnected(x, lastVid){
					//$("#"+x+" video").get(0).play();
					$("#"+x+" video").get(0).play();
					console.log(x);
					var vid = document.getElementById(x);
					$("#video"+x).get(0).addEventListener("ended", function(){
					console.log("stopped");
						var next = jsPlumb.getConnections({source: x});
						console.log(x, next);
							next = next[0].targetId;
							console.log(next);
						if (x != lastVid){
							console.log("updating video", next);
							
							playNextConnected(next, lastVid);
						}else{
							$("#"+lastVid+" video").get(0).play();
						}
					});
}




//center function
jQuery.fn.center = function () {
    this.css("position","absolute");
    //this.css("top", (($(window).height() - this.outerHeight()) / 2) + $(window).scrollTop() + "px");
    this.css("left", (($(window).width() - this.outerWidth()) / 2) + $(window).scrollLeft() + "px");
    return this;
}

