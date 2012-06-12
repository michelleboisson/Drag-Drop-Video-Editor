/*
some of this taken from Dan Kantor's audio player http://ex.fm/static/js/labs/local.js
*/

if (typeof(Local) == 'undefined'){
	Local = {}
	var _position;
	var localDrop;
}


Local.Init = function(position){
    //Local.Video.video = new Video();
    
    _position = position;

    var vidHolderHtml = "<div class='local_drop ui-widget-content' id="+_position+"><div class='local_drop_text'>Drop movie files here<br>(mp4)</div></div>";
    
    $("#videos").append(vidHolderHtml);
         
    var myVid = document.getElementById(_position);
    localDrop = document.getElementById(_position);    
    Local.Video.video = myVid;
    //Local.Video.addEvents();
    
    //var localDrop = document.getElementById(_position);
    localDrop.addEventListener("dragenter", Local.Drag.enter, false);
    localDrop.addEventListener("dragleave", Local.Drag.leave, false);
    localDrop.addEventListener("dragover", Local.Drag.over, false);
    localDrop.addEventListener("drop", Local.Drag.drop, false);
    localDrop.addEventListener("click", Local.Drag.click, false);
    localDrop.addEventListener("dblclick", Local.Edit.open, false);
    
    Canvas.Bind(_position);   

}
//Dragging videos onto the placeholder
Local.Drag = {
    enter : function(e){
        jQuery(this).addClass("drag_over");
        jQuery(this).find(".local_drop_text").addClass("drag_over");
        e.stopPropagation();
        e.preventDefault();
    },
    leave : function(){
        jQuery(this).removeClass("drag_over");
        jQuery(this).find(".local_drop_text").removeClass("drag_over");
    },
    over : function(e){
        jQuery(this).addClass("drag_over");
        jQuery(this).find(".local_drop_text").addClass("drag_over");
        e.stopPropagation();
        e.preventDefault();
    },
    drop : function(e){
        jQuery(this).removeClass("drag_over");
        jQuery(this).find(".local_drop_text").remove();
        var dt = e.dataTransfer;
        var files = dt.files;
        for (var i = 0; i < files.length; i++){
            var file = files[i];
            Local.Songs.add(file, this);
        }
        Local.Init(Local.Songs.list.length+1);
        
        e.stopPropagation();
        e.preventDefault();          
    },
    click : function(e){
    	var parentID = e.target.parentNode.getAttribute("id");
    	//is this click from a drag, do nothing
    	if ($("#"+parentID).hasClass("ui-draggable-dragged")){
	    	$("#"+parentID).removeClass("ui-draggable-dragged");
    	}else{
    		//if this click is a true click, not a drag, play/pause the click
    		Local.Video.play(e.target.parentElement.getAttribute('id'));
    	}
    }
}

Local.Songs = {
    list : [],
    queueNumber : 0,
    add : function(file, target){
        Local.Songs.list.push(file);
        //var position = Local.Songs.list.length - 1;
        var videohtml = "<video position='"+_position+"' src='' id='video"+_position+"' class='video-js vjs-default-skin' "+
  "preload='auto' width='320' height='180' startClip='' endClip='' stopped='true'></video>";
		
	//jQuery("#local_drop").append(videohtml);
      		var localDrop = target;
      		localDrop.innerHTML += videohtml;
      		
        //var file = files[0];
        
        	
            var type = file.type;
            console.log("type: "+type);

            var videoNode = localDrop.getElementsByTagName('video'); 
            //document.getElementById("video"+_position);
            var fileURL = window.webkitURL.createObjectURL(file);
            videoNode[0].src = fileURL;

            var canPlay = videoNode[0].canPlayType(type);

            canPlay = (canPlay === '' ? 'no' : canPlay);

            var message = 'Can play type "' + type + '": ' + canPlay;

            var isError = canPlay === 'no';

            console.log(message, isError);

            if (isError) {
            	console.log("ERROR", message);
                return;
            }

           // var fileURL = window.URL.createObjectURL(file);
            console.log("videoNode: " + videoNode);
            //var popcorn = popcorn("video"+_position);
            //Canvas.Popcorn.checkReadyState(popcorn);
            //Local.GetID3(file, position);
    },
    click : function(e){
        var offsetX = e.offsetX;
        var percentage = (offsetX * 100) / 800;
        Local.Video.video.currentTime = Local.Video.video.duration * percentage / 100;
    }
}

Local.Video = {
    video : null,
    play : function(id){
        var popcorn = Popcorn("#video"+id);
             
        var thisVid = $("#"+id+" video");

        if (popcorn.paused() == true){
	    //if (popcorn.paused() == true ){
	        Local.Video.stopAll();
 
            //Local.Video.play(id-1);
            var start = thisVid.attr('startClip');
            var stop = thisVid.attr('endClip');
            
            if (stop == ''){
	            stop = popcorn.duration();
	            thisVid.attr('endClip', stop);
            }
            
            if (start == ''){
	            start = 0;
	            thisVid.attr('startClip', start);
            }    
            
           	popcorn.play(start);
           	console.log("play until: "+ stop);
           	
           	popcorn.on('timeupdate', function() { 
           	//if it reaches the 'end', meaning the clip end
		       	if(popcorn.currentTime() >= stop){
		       		console.log("done playing");	
		       		//popcorn.pause();
		       		popcorn.currentTime(popcorn.duration());
					console.log(popcorn, popcorn.currentTime(), popcorn.ended());
					popcorn.off('timeupdate');
				}
           	});

        	//thisVid.get(0).play();
        	var percentage = thisVid.get(0).currentTime / thisVid.get(0).duration * 100;
        	//console.log("played", popcorn.played());
        }
        else {
        	//thisVid.get(0).pause();
        	popcorn.pause();
        	console.log("was playing, now pausing at ", popcorn.played());
        }
    },
    next : function(){
        if (Local.Songs.queueNumber < Local.Songs.list.length){
            Local.Songs.queueNumber++;
            Local.Video.play(Local.Songs.queueNumber);
        }
    },
    paused : function(){
        jQuery(".song").removeClass("playing");
        jQuery("#play_button_"+Local.Songs.queueNumber).addClass("paused");
    },
    stopAll : function(){
	    $('video','#videos').each(function(){
			this.pause(); //find all videos in #vid and pause them
		});
    },
    played : function(){
        jQuery(".play_button").removeClass("paused");
        jQuery("#song_"+Local.Songs.queueNumber).addClass("playing");
    },
    timeUpdate : function(){
        if (Local.Video.half == false){
            if (this.currentTime / this.duration > .5){
                Local.Video.half = true;
                Local.Scrobble.scrobble.request();
            }
        }
        var percentage = this.currentTime / this.duration;
        jQuery("#song_progress_"+Local.Songs.queueNumber).css("width", 800 * percentage);
    }
}


Local.Edit = {
	open : function(e){
		console.log("Opening edit window", e);
		
		Local.Video.stopAll();
		var videoId = e.target.id;
		
		//create modal window
		var modal = document.createElement("div");
		modal.setAttribute('id','dialog-modal');
		modal.setAttribute('title', 'Edit '+videoId);		
		document.getElementById("videos").appendChild(modal);
		
		//populate modal window with edit tools
		var videoSrc = document.getElementById(videoId).getAttribute("src");
		
		var videohtml = "<video src='"+videoSrc+"' id='edit-"+videoId+"' "+
  "preload='auto' width='640' height='360'></video><br/>"+
  "<label for='amount'>Clip range:</label>"+
	"<input type='text' id='amount' style='border:0; color:#f6931f; font-weight:bold;' />"+
"<div id='slider-range'></div>"+
"<button id='play-clip'>Play Clip</button> "+
"<button id='delete-clip'>Delete Clip</button>";
		
		
		
		$( "#dialog-modal" ).dialog({
			width: 800,
			height: 500,
			modal: true,
			closeOnEscape: true,
			close: function(event, ui) { 
				$(this).remove();
			}
		});
		
		var modal = document.getElementById("dialog-modal");
		modal.innerHTML = videohtml;
		var popcorn = Popcorn("#"+videoId);
		//var popcorn = Popcorn("#edit-"+videoId);
		//Canvas.Popcorn.checkReadyState(popcorn);
		Canvas.Popcorn.initSlider(popcorn.duration(), videoId);
	} 
};

