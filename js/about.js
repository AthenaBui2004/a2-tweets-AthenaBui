function parseTweets(runkeeper_tweets) {
    //Do not proceed if no tweets loaded
    if(runkeeper_tweets === undefined) {
        window.alert('No tweets returned');
        return;
    }

    tweet_array = runkeeper_tweets.map(function(tweet) {
        return new Tweet(tweet.text, tweet.created_at);
    });

    //This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
    //It works correctly, your task is to update the text of the other tags in the HTML file!
    document.getElementById('numberTweets').innerText = tweet_array.length;

    //Find the earliest and latest tweet dates
    var earliestDate = tweet_array[0].time;
    var latestDate = tweet_array[0].time;

    tweet_array.forEach(function(tweet) {
        if (tweet.time < earliestDate) {
            earliestDate = tweet.time;
        }

        if (tweet.time > latestDate) {
            latestDate = tweet.time;
        }
    });

    //Format the dates
    var dateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    var earliestDateString = earliestDate.toLocaleDateString('en-US', dateOptions);
    var latestDateString = latestDate.toLocaleDateString('en-US', dateOptions);

    //Display the dates on the webpage
    document.getElementById('firstDate').innerText = earliestDateString;
    document.getElementById('lastDate').innerText = latestDateString;

    //Filter the tweets into the four categories
    var completedEvents = tweet_array.filter(function(tweet) {
        return tweet.source == 'completed_event';
    });

    var liveEvents = tweet_array.filter(function(tweet) {
        return tweet.source == 'live_event';
    });

    var achievements = tweet_array.filter(function(tweet) {
        return tweet.source == 'achievement';
    });

    var miscellaneous = tweet_array.filter(function(tweet) {
        return tweet.source == 'miscellaneous';
    });

    //Calculate the percentage of tweets in each category
    var completedEventsPct = (completedEvents.length / tweet_array.length) * 100;
    var liveEventsPct = (liveEvents.length / tweet_array.length) * 100;
    var achievementsPct = (achievements.length / tweet_array.length) * 100;
    var miscellaneousPct = (miscellaneous.length / tweet_array.length) * 100;

    //Display the number of tweets in each category
    var completedElements = document.getElementsByClassName('completedEvents');

    for (var i = 0; i < completedElements.length; i++) {
        completedElements[i].innerText = completedEvents.length;
    }

    document.getElementsByClassName('liveEvents')[0].innerText = liveEvents.length;
    document.getElementsByClassName('achievements')[0].innerText = achievements.length;
    document.getElementsByClassName('miscellaneous')[0].innerText = miscellaneous.length;

    //Display the percentages with two decimal places
    document.getElementsByClassName('completedEventsPct')[0].innerText = completedEventsPct.toFixed(2) + '%';
    document.getElementsByClassName('liveEventsPct')[0].innerText = liveEventsPct.toFixed(2) + '%';
    document.getElementsByClassName('achievementsPct')[0].innerText = achievementsPct.toFixed(2) + '%';
    document.getElementsByClassName('miscellaneousPct')[0].innerText = miscellaneousPct.toFixed(2) + '%';

    //Find the completed tweets that include user-written text
    var writtenTweets = completedEvents.filter(function(tweet) {
        return tweet.written;
    });

    //Calculate the percentage of completed tweets with user-written text
    var writtenPct = (writtenTweets.length / completedEvents.length) * 100;

    //Display the number and percentage of user-written tweets
    document.getElementsByClassName('written')[0].innerText = writtenTweets.length;
    document.getElementsByClassName('writtenPct')[0].innerText = writtenPct.toFixed(2) + '%';
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
    loadSavedRunkeeperTweets().then(parseTweets);
});