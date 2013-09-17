var app = app ||{};
	
  //Model
(function(){
  app.Quote = Backbone.Model.extend({
    defaults:{
      'id':'',
      'say':'',
      'who':''
    },

    //favorite local
    favorite: function(){
      //console.log('favorite it...');
    }
  });
}());
  


//console.log(quotesRef.quotes[2].say);

(function(){
  app.QuotesCollection = Backbone.Collection.extend({
    model:app.Quote,
  });
}());


  app.quotes = new app.QuotesCollection();
  app.quotes.add(quotesArr);	

(function(){

app.Dispatcher = {};
_.extend(app.Dispatcher, Backbone.Events);
})();
  
  //View
(function(){
  app.QuoteView = Backbone.View.extend({
	className:'quote',
	tagName:'div',
initialize:function(){
	//this.render();
	var self = this;
},
    events: {
	'click .makefav':'makeFav',
	'click .removefav':'removeFav'
    },
    render: function(){
      //var template = _.template($('#quote-temp').html(),this.model.toJSON());
      var template = _.template($(this.options.template).html(),this.model.toJSON());
      var html = this.$el.html(template);
	$('#content').append(html);
      return this;
    },
	makeFav: function(){	
		//localStorage.removeItem('quotefavs');
		var toAdd = this.model.id;
		if(localStorage['quotefavs']){
			var favsStr = JSON.parse(localStorage['quotefavs'])+'';
			//console.log(favsStr);
			var favs = favsStr.split(',');
			if(favs.indexOf(toAdd)<0){
			favs.push(toAdd);
			localStorage['quotefavs'] = JSON.stringify(favs);
			}
		}else{
			localStorage['quotefavs'] = JSON.stringify(toAdd);
		}	
	app.Dispatcher.trigger('notify',{text:'Saved'});	
	//this.navigate('#favs');
	},
	removeFav: function(){	
		//localStorage.removeItem('quotefavs');
		var toRemove = this.model.id;
		if(localStorage['quotefavs']){
			var favsStr = JSON.parse(localStorage['quotefavs'])+'';
			//console.log(favsStr);
			var favs = favsStr.split(',');
			var pos = favs.indexOf(toRemove);
			if(pos>-1){
				favs.splice(pos,1);
				localStorage['quotefavs'] = JSON.stringify(favs);
			}
		}
	av.displayFavs();	
	}
  });
}());
//_.extend(app.QuoteView, Backbone.Events);

(function(){
app.GenView = Backbone.View.extend({
	el:'#content',
	
	initialize:function(){
		this.render();
		//var temp = this.options.tname;
	},
	render:function(){
	if(this.options.tname =='#favs-temp'){
	var favs = JSON.parse(localStorage['quotefavs'])+'';
	favs = favs.split(',');
      	var template = _.template($(this.options.tname).html(),{quotes:favs});
	}else{
      	var template = _.template($(this.options.tname).html());
	}
	this.$el.html(template);	
	}
}); 
}());

  //main view
  app.AppView = Backbone.View.extend({

  el:'#wrapper',
  events: {
    'click #mreload':'displayRandom',
    'click #mheart':'displayFavs',
    'click #menu':'displayMenu'
  },

	
  initialize:function(){
	app.Dispatcher.on('notify', this.notify, this);
  },

  render: function(){},

  //custom

  save:function(){
    //console.log('saving..');
  },
 notify: function(obj){
//console.log(obj);
//$('<div class="notify">'+obj.text+'</div>').appendTo('#container').fadeToggle(800,'linear',function(){
$('<div class="notify">'+obj.text+'</div>').appendTo('.quotefooter').fadeToggle(800,'linear',function(){
	$('.notify').remove();
});

},
 currView :null,

 displayFavs : function(){
	//display favorites
	$('#content').empty();
	//console.log(localStorage['quotefavs']);
	if(localStorage['quotefavs'].length>0){
	var favsStr = JSON.parse(localStorage['quotefavs'])+'';
			//console.log(favsStr);
			var favs = favsStr.split(',');
	for(var i=0,len = favs.length; i<len; i++){
		if(favs[i]!=''){
		var favquote = app.quotes.get(favs[i]);
		var currView = new app.QuoteView({model:favquote,template:'#quotefav-temp'}); 
		currView.render();
		}
	}
	}
	
},
 
  displayRandom : function(){
	var remv = this.currView;
	if(remv){
	remv.remove();
	}
	
      var max = app.quotes.length -1;
      var rand = 1+Math.floor(Math.random()*max);
      var currquote = app.quotes.at(rand);
   	this.currView = new app.QuoteView({model:currquote,template:'#quote-temp'}); 
	this.currView.render();
	//testing
  },

  displayOne:function(){
    // todo
  },

  displayMenu: function(){
    //console.log('show menu');
	$("#mnav").slideToggle();
	$(this).toggleClass("active");
  }

  });

(function(){
app.AppRouter = Backbone.Router.extend({
	routes:{
	'home': 'defaultRoute',
	'about': 'showAbout',
	'howto': 'showHowTo',
	'favs': 'showFavs',
	'privacy': 'showPrivacy',
	'*path' : 'defaultRoute'
	},

	defaultRoute:function(path){
		$('#content').empty();
		av.displayRandom();
		$("#mnav").css('display','none');
	},
	
	showAbout:function(){
	  var sa = new app.GenView({tname:'#about-temp'});
		$("#mnav").css('display','none');
	},

	showPrivacy:function(){
	  var sp = new app.GenView({tname:'#privacy-temp'});
		$("#mnav").css('display','none');
	},
	showHowTo:function(){
	  var sh = new app.GenView({tname:'#howto-temp'});
		$("#mnav").css('display','none');
	},
	showFavs:function(){
	  //var sf = new app.GenView({tname:'#favs-temp'});
		av.displayFavs();
		$("#mnav").css('display','none');
	}
	
});
}());
_.extend(app.AppView, Backbone.Events);

  //kick off
var router = new app.AppRouter();
var av = new app.AppView();
Backbone.history.start();
	
