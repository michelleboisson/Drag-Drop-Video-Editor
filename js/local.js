/*
name: Local
author: Dan Kantor
requires: jquery-1.7.1
description: handle file drops and audio player
*/

if (typeof(Local) == 'undefined'){
	Local = {}
}

Local.Init = function(){
    Local.Audio.audio = new Audio();
    Local.Audio.addEvents();
    var localDrop = document.getElementById("local_drop");
    localDrop.addEventListener("dragenter", Local.Drag.enter, false);
    localDrop.addEventListener("dragleave", Local.Drag.leave, false);
    localDrop.addEventListener("dragover", Local.Drag.over, false);
    localDrop.addEventListener("drop", Local.Drag.drop, false);
}

Local.Drag = {
    enter : function(e){
        jQuery("#local_drop").addClass("drag_over");
        jQuery("#local_drop_text").addClass("drag_over");
        e.stopPropagation();
        e.preventDefault();
    },
    leave : function(){
        jQuery("#local_drop").removeClass("drag_over");
        jQuery("#local_drop_text").removeClass("drag_over");
    },
    over : function(e){
        jQuery("#local_drop").addClass("drag_over");
        jQuery("#local_drop_text").addClass("drag_over");
        e.stopPropagation();
        e.preventDefault();
    },
    drop : function(e){
        jQuery("#local_drop").removeClass("drag_over");
        jQuery("#local_drop_text").removeClass("drag_over").addClass("drag_drop");
        var dt = e.dataTransfer;
        var files = dt.files;
	console.log(files);
        for (var i = 0; i < files.length; i++){
            var file = files[i];
            Local.Songs.add(file);
        }
        e.stopPropagation();
        e.preventDefault();      
    }
}

Local.File = {
    loaded : function(e){
        Local.Audio.audio.src = this.result;
        Local.Audio.audio.load();
        Local.Audio.audio.play();
    }
}

Local.Songs = {
    list : [],
    queueNumber : 0,
    add : function(file){
        Local.Songs.list.push(file);
	console.log("file: ", file);
        var position = Local.Songs.list.length - 1;
//        jQuery("#local_drop").append("<div id=\"song_"+position+"\" class=\"song\"><span id=\"play_button_"+position+"\" class=\"play_button\" position=\""+position+"\"></span><span id=\"song_name_"+position+"\">"+file.name+"</span><div class=\"song_progress\" id=\"song_progress_"+position+"\"></div></div>");
        var videohtml = "<video id='my_video_"+position+"' class='video-js vjs-default-skin' "+
  "preload='auto' width='640' height='360'> " +
  "<source src='video/punch_me,_i_dare_you_-_kinect_game_test_640x360.mp4' type='video/mp4'> " +
  "<source src='my_video.webm' type='video/webm'></video>";
	
	jQuery("#local_drop").append(videohtml);
	_V_("my_video_0", {}, function(){
		var myPlayer = this;

      // EXAMPLE: Start playing the video.
      myPlayer.play();
	});
	
//        <div id=\"song_"+position+"\" class=\"song\"><span id=\"play_button_"+position+"\" class=\"play_button\" position=\""+position+"\"></span><span id=\"song_name_"+position+"\">"+file.name+"</span><div class=\"song_progress\" id=\"song_progress_"+position+"\"></div></div>");
        if (Local.Songs.list.length == 1){
            Local.Audio.play(0);
        }
        Local.GetID3(file, position);
    },
    click : function(e){
        var offsetX = e.offsetX;
        var percentage = (offsetX * 100) / 800;
        Local.Audio.audio.currentTime = Local.Audio.audio.duration * percentage / 100;
    }
}

Local.Audio = {
    audio : null,
    half : false,
    addEvents : function(){
//        Local.Audio.audio.addEventListener("ended", Local.Audio.next, false);
//        Local.Audio.audio.addEventListener("pause", Local.Audio.paused, false);
//        Local.Audio.audio.addEventListener("play", Local.Audio.played, false);
//        Local.Audio.audio.addEventListener("timeupdate", Local.Audio.timeUpdate, false);
    },
    play : function(q){
        Local.Audio.half = false;
        jQuery(".song_progress").css("width", 0);
        Local.Songs.queueNumber = q;
        var file = Local.Songs.list[q];
        var fileReader = new FileReader();
        fileReader.onload = Local.File.loaded;
        fileReader.readAsDataURL(file);
        jQuery(".song").removeClass("playing");
        jQuery("#song_"+q).addClass("playing");
        jQuery(".play_button").removeClass("paused");
       // Local.Scrobble.nowplaying.request();
        document.title = ">> "+file.name;
        if (file.song){
            document.title = ">> "+file.song.title+" by "+file.song.artist+" | exfm Local";
        }
    },
    next : function(){
        if (Local.Songs.queueNumber < Local.Songs.list.length){
            Local.Songs.queueNumber++;
            Local.Audio.play(Local.Songs.queueNumber);
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
        if (Local.Audio.half == false){
            if (this.currentTime / this.duration > .5){
                Local.Audio.half = true;
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
            Local.Audio.audio.pause();
        } else {
            if (position == Local.Songs.queueNumber){
                Local.Audio.audio.play();
            } else {
                Local.Audio.play(position);
            }
        }
        e.stopPropagation();
    }
}

Local.Scrobble = {
    nowplaying : {
        method : "/api/v3/now-playing",
        request : function(){
            if (LoggedInUser){
                var file = Local.Songs.list[Local.Songs.queueNumber];
                data = {
                    "title" : Local.Songs.list[Local.Songs.queueNumber].name, 
                    "client_id" : "exfm_labs_local",
                };
                if (file.song){
                    data = {
                        "title" : file.song.title, 
                        "artist" : file.song.artist, 
                        "album" : file.song.album,
                        "client_id" : "exfm_labs_local",
                    };
                }
                jQuery.post(Local.Scrobble.nowplaying.method, data, Local.Scrobble.nowplaying.response);
            }
        },
        response : function(json){
            //console.log(json)
        }
    },
    scrobble : {
        method : "/api/v3/scrobble",
        request : function(){
            if (LoggedInUser){
                var file = Local.Songs.list[Local.Songs.queueNumber];
                data = {
                    "title" : Local.Songs.list[Local.Songs.queueNumber].name, 
                    "client_id" : "exfm_labs_local",
                };
                if (file.song){
                    data = {
                        "title" : file.song.title, 
                        "artist" : file.song.artist, 
                        "album" : file.song.album,
                        "client_id" : "exfm_labs_local",
                    };
                }
                jQuery.post(Local.Scrobble.scrobble.method, data, Local.Scrobble.scrobble.response);
            }
        },
        response : function(json){
            //console.log(json)
        }
    }
}

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


jQuery(".play_button").live("click", Local.PlayButton.click);
jQuery(".song").live("click", Local.Songs.click);
jQuery(document).ready(Local.Init);