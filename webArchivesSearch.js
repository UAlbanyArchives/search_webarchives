
window.onload= function() { 
	$("#webArchivesSearch button[type='submit']").prop("disabled", false);
	if (window.location.hash) {
		query = window.location.hash.substring(1); 
		getResults(query)
		history.pushState('', document.title, window.location.pathname);
	}
	// Searches Archive-it opensearch
	$("#webArchivesSearch").submit(function(e) {
	  e.preventDefault();
	  $("#results").fadeOut(100);
	  var query = $("#webArchivesSearch input[type='text']").val();
	  if (query.length < 1) {
		showFeedback("error", "#search-error", "You didn't enter anything!");
	  }
	  else {
		getResults(query, 0);
		$("#webArchivesSearch input[type='text']").val('');
	  }
	});
}

//pagination links
$(".pageNext").click(function(e) {
	  e.preventDefault();
	  $("#results").fadeOut(100);
	  getResults(query, 0);
	});

// Returns results from Archive-It for a query search
function getResults(query, page) {
	if (page == 0){
		urlPath = "https://archive-it.org/seam/resource/opensearch?i=6372&i=3308&i=6914&i=7081&i=3308&i=6917&i=3308&i=7802&i=6915&i=6918&i=5967&i=7082&i=7801&i=6916&i=8702&i=6913&i=8098&q=" + query
	} else {urlPath = "https://archive-it.org/seam/resource/opensearch?i=6372&i=3308&i=6914&i=7081&i=3308&i=6917&i=3308&i=7802&i=6915&i=6918&i=5967&i=7082&i=7801&i=6916&i=8702&i=6913&i=8098&q=" + query + '&p=' + page
	}
		
  
  
  $("#search-error").empty().removeClass(function(index, css) {
	  return (css.match(/(^|\s)alert?\S+/g) || []).join(' ');
	});
		
  $("#results").empty();
  $("#results").append('<img src="img/loading.gif" />');
  $("#results").fadeIn(100);
  
  objects = $.ajax({
    type: "GET",
    dataType: "xml",
    url: urlPath,
	async: true,
    success: function(results) {
		$("#results").empty();
		resultCount = results.getElementsByTagName("totalResults")[0].childNodes[0].nodeValue;
		

		  if (resultCount < 1) {
			showFeedback("error", "#search-error", "Sorry, I couldn't find anything for " + query);
		  } else {
			  
			pageValue = Number(results.getElementsByTagName("startIndex")[0].childNodes[0].nodeValue)
			startValue = pageValue + 1
			endValue = pageValue + Number(results.getElementsByTagName("itemsPerPage")[0].childNodes[0].nodeValue)
			previousPage = pageValue - Number(results.getElementsByTagName("itemsPerPage")[0].childNodes[0].nodeValue)
			$("#results").append('<div class="row"><div id="pagination" class="col-xs-12"></div></div>')
			if (pageValue != 0) {
				$("#pagination").append('<a class="pageLink" onclick="getResults(\'' + query + '\', previousPage);" href="javascript:void(0);"><span class="glyphicon glyphicon-chevron-left"></span></a>')
			}	else {
				$("#pagination").append('<span class="glyphicon glyphicon-chevron-left pageLink"></span>')
			}
			$("#pagination").append('<h4>Viewing ' + startValue +  ' - ' + endValue + ' of  ' + resultCount + ' results for "' + results.getElementsByTagName("query")[0].childNodes[0].nodeValue + '"</h4>');
			$("#pagination").append('<a class="pageLink" onclick="getResults(\'' + query + '\', endValue);" href="javascript:void(0);"><span class="glyphicon glyphicon-chevron-right"></span></a>')
			
			
			for(i=0; i<results.getElementsByTagName("item").length; i++) {
			  var resultItem = results.getElementsByTagName("item")[i];
			  var timestamp = resultItem.getElementsByTagName("date")[0].childNodes[0].nodeValue;
			  var isoTime = timestamp.slice(0,4) + '-' + timestamp.slice(4,6) + '-' + timestamp.slice(6,8) + 'T' + timestamp.slice(8,10) + ':' + timestamp.slice(10,12) + ':' + timestamp.slice(12,14) + 'Z'
				date = new Date(isoTime),
			  $("#results").append('<div id="'+i+'" class="panel panel-default">'+
				'<div class="panel-body">'+
					'<h4 class="title" style="margin-top:10px">' + 
						'<a href="http://wayback.archive-it.org/' + resultItem.getElementsByTagName("index")[0].childNodes[0].nodeValue + '/' + resultItem.getElementsByTagName("date")[0].childNodes[0].nodeValue + '/' + resultItem.getElementsByTagName("link")[0].childNodes[0].nodeValue + '">' +
							resultItem.getElementsByTagName("title")[0].childNodes[0].nodeValue + 
						'</a>' +
						' <span class="liveLink">(<a href="' + resultItem.getElementsByTagName("link")[0].childNodes[0].nodeValue + '">Live Web</a>)</span>' +
					'</h4>'+
					//'<h5 class="collectionLink"><span class="glyphicon glyphicon-arrow-right"></span> Part of collection: </h5>' +
					'<h5>Captured on ' +
						 date.toString().split('GMT')[0] + ' (<a href="http://wayback.archive-it.org/' + resultItem.getElementsByTagName("index")[0].childNodes[0].nodeValue + '/*/' + resultItem.getElementsByTagName("link")[0].childNodes[0].nodeValue+ '">More Captures</a>)' +
					'</h5>' +
					'<p>'+
						resultItem.getElementsByTagName("description")[0].childNodes[0].nodeValue +
					'</p>'+
				'</div>'+
			  '</div>');
			}
		  }
	  
	},
	 error: function(XMLHttpRequest, textStatus, errorThrown) {
		 showFeedback("error", "#search-error", "Sorry, there was an error with this query");
        console.log("Status: " + textStatus); 
		console.log("Error: " + errorThrown); 
    }  
  });
}

// Adds HTML with results to the page
function displayData(target, data) {
  $(target).append(data);
}

// Displays error, warning and success messages to users
function showFeedback(type, target, message) {
  if (type == "error") {
    if (target.match(/(^|\s)#as-\S+/g)) {
      $(target).removeClass(function(index, css) {
        return (css.match(/(^|\s)label\S+/g) || []).join(' ');
      });
      $(target).addClass("label-danger").text(message).fadeIn(400);
      $('#webArchivesSearch button[type="submit"]').prop("disabled", true);
      $('#resourceid_0-search button[type="submit"]').prop("disabled", true);
    } else {
      $(target).removeClass(function(index, css) {
        return (css.match(/(^|\s)alert\S+/g) || []).join(' ');
      });
      $(target).addClass("alert alert-danger").text(message).fadeIn(400);
    }
  } else if (type == "success") {
    if (target.match(/(^|\s)#as-\S+/g)) {
      $(target).removeClass(function(index, css) {
        return (css.match(/(^|\s)label\S+/g) || []).join(' ');
      });
      $(target).addClass('label-success').text(message).fadeIn(400);
      $("#webArchivesSearch button[type='submit']").prop("disabled", false);
      $("#resourceid_0-search button[type='submit']").prop("disabled", false);
    } else {
      $(target).removeClass(function(index, css) {
        return (css.match(/(^|\s)alert\S+/g) || []).join(' ');
      });
      $(target).addClass('alert-success').text(message).fadeIn(400);
    }
  } else if (type == "warning") {
    $(target).removeClass(function(index, css) {
      return (css.match(/(^|\s)label\S+/g) || []).join(' ');
    });
    $(target).addClass("label-warning").text("Checking Status").fadeIn(400);
  }
}
