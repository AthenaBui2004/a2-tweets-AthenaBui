var writtenTweets = [];

function parseTweets(runkeeper_tweets) {
    if(runkeeper_tweets === undefined) {
        window.alert('No tweets returned');
        return;
    }

    var tweet_array = runkeeper_tweets.map(function(tweet) {
        return new Tweet(tweet.text, tweet.created_at);
    });

    //Filter to just the written tweets
    writtenTweets = tweet_array.filter(function(tweet) {
        return tweet.written;
    });
}

function addEventHandlerForSearch() {

    var searchBox = document.getElementById('textFilter');

    searchBox.addEventListener('input', function() {

        var searchText = searchBox.value;
        var tableBody = document.getElementById('tweetTable');

        //Clear the table before adding new results
        tableBody.innerHTML = "";

        //Update the text being searched
        document.getElementById('searchText').innerText = searchText;

        //If the search box is empty, show zero results
        if (searchText == "") {
            document.getElementById('searchCount').innerText = "0";
            return;
        }

        //Find written tweets containing the search text
        var matchingTweets = writtenTweets.filter(function(tweet) {
            return tweet.writtenText.toLowerCase().includes(searchText.toLowerCase());
        });

        //Update the number of matching tweets
        document.getElementById('searchCount').innerText = matchingTweets.length;

        //Add each matching tweet to the table
        matchingTweets.forEach(function(tweet, index) {
            tableBody.innerHTML += tweet.getHTMLTableRow(index + 1);
        });
    });
}

document.addEventListener('DOMContentLoaded', function (event) {
    addEventHandlerForSearch();
    loadSavedRunkeeperTweets().then(parseTweets);
});