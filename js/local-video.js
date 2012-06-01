/*
name: Local Video Player
author: Michelle Boisson
requires: jquery-1.7.1, jquery-ui.1.8.20, jquery.ui.draggable, jquery.ui.sortable
description: handle file drops and video player
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
     //connectors
/*    var connectIn = document.createElement("div");
    connectIn.className = "connector left";
    connectIn.setAttribute("parentVid", _position);
    localDrop.appendChild(connectIn);
  */  
    //connectIn.addEventListener("click", Local.Connector.click);
    
/*    var connectOut = document.createElement("div");
    connectOut.className = "connector right";
    connectOut.setAttribute("parentVid", _position);
    localDrop.appendChild(connectOut);
*/
    
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
  "preload='auto' width='320' height='180'></video>";
		
	//jQuery("#local_drop").append(videohtml);
      		var localDrop = target;
      		console.log("localDrop: ", localDrop);
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
    half : false,
    addEvents : function(){
        Local.Video.video.addEventListener("ended", Local.Video.next, false);
        Local.Video.video.addEventListener("pause", Local.Video.paused, false);
        Local.Video.video.addEventListener("play", Local.Video.played, false);
        Local.Video.video.addEventListener("timeupdate", Local.Video.timeUpdate, false);
    },
    play : function(id){
        Local.Video.half = false;
        jQuery(".song_progress").css("width", 0);
        Local.Songs.queueNumber = id;
       // var file = Local.Songs.list[Local.Songs.queueNumber];
                
        
        var thisVid = $("#"+id+" video");
        if (thisVid.get(0).paused == true){
	        $('video','#videos').each(function(){
		        this.pause(); //find all videos in #vid and pause them
		    });

        	thisVid.get(0).play();
        	var percentage = thisVid.get(0).currentTime / thisVid.get(0).duration * 100;
        	console.log("playing", percentage);
        }
        else {
        	thisVid.get(0).pause();
        	console.log("pausing");
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

Local.PlayButton = {
    click : function(e){
        var position = parseInt(jQuery(this).attr("position"));
        if (jQuery(this).parent().hasClass("playing")){
            Local.Video.video.pause();
        } else {
                Local.Video.play(position);
            }
        e.stopPropagation();
    }        
}

Local.Connectors = {
	click : function(e){
		console.log("CONNECT ME!");
	}, 
	ondrag : function(event, ui){
//		console.log("dragging: ", event, ui);
		Canvas.Bind;		
	}
	
};



Local.GetID3 = function(file, position){
    var song = {
        "title" : file.name
    }
    if (file.type == 'audio/mp3'){
        var reader = new FileReader();
        reader.onload = function(){
            var data=this.result;
            var tagPosition=data.length-128;
            var begin={
                "id":tagPosition,
                "title":tagPosition+3,
                "artist":tagPosition+33,
                "album":tagPosition+63,
                "year":tagPosition+93,
                "comment":tagPosition+97,
                "genre":tagPosition+127
            };
            var end={
                "id":tagPosition+3,
                "title":tagPosition+33,
                "artist":tagPosition+63,
                "album":tagPosition+93,
                "year":tagPosition+97,
                "comment":tagPosition+127,
                "genre":tagPosition+128
            };
            var len={
                "id":3,
                "title":30,
                "artist":30,
                "album":30,
                "year":4,
                "comment":30,
                "genre":1
            };
            if (data[tagPosition]=="T"&&data[tagPosition+1]=="A"&&data[tagPosition+2]=="G"){
                song = {
                    "title" : data.slice(begin.title, end.title).replace(/\0/ig,""),
                    "artist" : data.slice(begin.artist, end.artist).replace(/\0/ig,""),
                    "album" : data.slice(begin.album, end.album).replace(/\0/ig,""),
                    "genre" : data.slice(begin.genre, end.genre).replace(/\0/ig,"")
                }
                file.song = song;
                jQuery("#song_name_"+position).html(song.title+" by "+song.artist);
            }
           
        };
        var blob = file.webkitSlice(file.size-128,file.size);
        reader.readAsBinaryString(blob);
    }
};

