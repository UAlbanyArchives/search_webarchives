# search_webarchives
A client side single page search application for the Archive-It OpenSearch API

Uses the [Archive-It OpenSearch API](https://webarchive.jira.com/wiki/display/search/OpenSearch+API "Archive-It OpenSearch API")

Searches the UAlbany Archive-It collections by default. You can exit the collection params on lines 34 and 35 of webArchivesSearch.js so search different collections.

Just put this code into an html page, link to webArchivesSearch.js and search away:
	
	<div class="col-xs-12">
		<form class="form-inline" id="webArchivesSearch">
			<div class="form-group col-xs-12">
				<input class="form-control input-lg" id="exampleInputName2" placeholder="Search Web Archives" type="text">
					<button class="btn btn-primary input-lg" disabled="" onclick="ga('send', 'event', 'search', 'click', 'button');" type="submit">Search</button>
				</input>
			</div>
		</form>
	</div>

	<div class="text-center col-xs-12" id="search-error" style="margin-top:20px;"></div>

	<div id="results" class="col-xs-12"></div>

	