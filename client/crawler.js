urlSources = new Meteor.Collection('urlSources');
crawlerLog = new Meteor.Collection('crawlerLog');


Template.search.events({
	'submit form': function(theEvent, theTemplate) {
		theEvent.preventDefault();
		Session.set('inputUrl', theTemplate.find('#searchInput').value);
		var inputUrl = Session.get('inputUrl');
		//console.log(inputUrl);

		Meteor.call('inputUrl', inputUrl);
	}
});

Template.result.result = function() {
	return urlSources.find();
};

Template.searchresults.searchresults = function() {
	return urlSources.find();
}