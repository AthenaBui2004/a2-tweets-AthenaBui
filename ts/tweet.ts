class Tweet {
    private text:string;
    time:Date;

    constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
        this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
    }

    //returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        if (this.text.includes("Just completed") || this.text.includes("Just posted")) {
            return "completed_event";
        }

        if (this.text.includes("Watch my")) {
            return "live_event";
        }

        if (this.text.includes("Achieved")) {
            return "achievement";
        }

        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        if (this.source != 'completed_event') {
            return false;
        }

        if (this.text.includes(" - ")) {
            return true;
        }

        return false;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }

        var start = this.text.indexOf(" - ") + 3;
        var end = this.text.indexOf(" https://", start);

        if (end == -1) {
            end = this.text.indexOf(" #Runkeeper", start);
        }

        if (end == -1) {
            return this.text.substring(start);
        }

        return this.text.substring(start, end);
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }

        var words = this.text.split(" ");

        for (var i = 0; i < words.length; i++) {
            if (words[i] == "km" || words[i] == "mi") {
                return words[i + 1];
            }

            if (words[i] == "workout") {
                return words[i - 1];
            }
        }

        return "unknown";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }

        var words = this.text.split(" ");

        for (var i = 0; i < words.length; i++) {

            if (words[i] == "km") {
                var kilometers = Number(words[i - 1]);
                return kilometers / 1.609;
            }

            if (words[i] == "mi") {
                var miles = Number(words[i - 1]);
                return miles;
            }
        }

        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        var linkStart = this.text.indexOf("https://");
        var linkEnd = this.text.indexOf(" ", linkStart);

        var link = "";

        if (linkStart != -1) {
            if (linkEnd == -1) {
                link = this.text.substring(linkStart);
            }
            else {
                link = this.text.substring(linkStart, linkEnd);
            }
        }

        return "<tr>" +
            "<td>" + rowNumber + "</td>" +
            "<td>" + this.activityType + "</td>" +
            "<td><a href=\"" + link + "\" target=\"_blank\">" +
            this.writtenText +
            "</a></td>" +
            "</tr>";
    }
}