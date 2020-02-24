
const newsApp = {
};

newsApp.newsStore = [];
newsApp.currentArticles = 6;


newsApp.pageLoad = function () {
    window.onload = function () {
        newsApp.getNewsHeadlines('top-headlines', '', 'country=us&');
    }
}

newsApp.getNewsHeadlines = (search='', topic='', country='') => {
    newsApp.newsStore = [];
    // pull main headlines
    async function getHeadlines() {
        try {
            const results = await Promise.all([
                fetch(new Request(`https://newsapi.org/v2/${search}?` + `${topic}` + `${country}` + `sortBy=popularity&` + 'apiKey=125340baa44e4aefb7771338e7d73af8'))
            ])
            results.map(result => {
                // apply the .json method to each response.
                result.json().then(response => {
                    // this is where we can do whatever we want with the data as arrays of objects are returned.
                    console.log(response);
                    console.log(response.articles)
                    let array = response.articles.map((news) => {
                        
                        newsApp.newsStore.push(news)
                        return news
                    })
                    newsApp.displayHeadlines(array, newsApp.currentArticles)
                });
            });


        } catch {
            console.error(error)
        }
    }
    // maybe add return
    getHeadlines()
}

newsApp.displayHeadlines = (news, articleAmount, sentiment) => {
    // clear old headlines 
    news.forEach((item, index) => {  
        if (index < articleAmount) {
            // Create new Div, title and Img tag and add classnames
            const newDiv = document.createElement("div");
            newDiv.className = "headlineCard";
            const newPTag = document.createElement("p");
            newPTag.className = "sourceInCard";
            newPTag.id = `${item.title}`
            const newATag = document.createElement("a");
            newATag.className = "aTagInCard";
            newATag.id = `${item.title}`
            newATag.className = "aTagInCard" + index;
            const imgDiv = document.createElement("div");
            imgDiv.className = "headlineImageDiv";
            const newImg = document.createElement("img");
            newImg.className = "headlineImage";
            newImg.id = `${item.title}`
            const newH2 = document.createElement("h2");
            newH2.className = "headlineText";
            newH2.id = `${item.title}`
            const linkATag = document.createElement("a");
            linkATag.className = "linkATag";


            // add news api data to the title and image tags
            const headlineText = document.createTextNode(`${item.title}`);
            linkATag.setAttribute('href', `${item.url}`);
            newImg.setAttribute("src", `${item.urlToImage}`);
            const sourceText = document.createTextNode(`Source: ${item.source.name}`);
            const linkText = document.createTextNode(`(go to article here)`);

            // append text to h2 then h2 and and Image tag to div. Then append div to section ready
            linkATag.appendChild(linkText);
            newH2.appendChild(headlineText);
            newPTag.appendChild(sourceText)
            imgDiv.appendChild(newImg)
            newDiv.appendChild(newATag)
            newATag.appendChild(newH2);
            newATag.appendChild(imgDiv);
            newDiv.appendChild(newPTag);
            newDiv.appendChild(linkATag);
            document.querySelector('.newsCardsSection').appendChild(newDiv);

            //finally get the sentiment of the URL process and append it to the card 
            newsApp.checkURLForSentiment(item.url, index)  
        }
        
    })
}

newsApp.clearHeadlines = function() {
    const headlineSection = document.querySelector('.newsCardsSection');
    headlineSection.innerHTML = '';

    console.log('cleared')
} 


newsApp.checkURLForSentiment = (url, index) => {

    // pull main headlines
    // const API_KEY = '4d9a7a8d7bf72865d0a6735aecde4bfc';
    // const API_ID = '057b23f0'
    // const baseURL = 'https://api.aylien.com/api/v1/';
    // const articleURL = 'https://www.biography.com/news/frida-kahlo-bus-accident';
    // const sentiment = 'sentiment?url=';
    // let requestString = baseURL + sentiment + articleURL
    const API_KEY = 'add9724d11f8001f0046cceb959d5cee';
    const API_ID = '4ba605d0'
    const baseURL = "https://api.aylien.com/api/v1/";
    const articleURL = url;
    const sentiment = "sentiment?url=";
    requestString = baseURL + sentiment + articleURL;
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    requestString = proxyUrl + requestString

    fetch(requestString, {
        method: "GET",
        headers: {
            "X-AYLIEN-TextAPI-Application-Key": API_KEY,
            "X-AYLIEN-TextAPI-Application-ID": API_ID,
        }
    })
        .then(function (data) {
            data.json().then(data => {
                // add sentiment to the card
                newsApp.displaySentimentOnPage(data.polarity, index)
            })
            
    })
    
}

newsApp.displaySentimentOnPage = (sentiment, index) => {
    const newPTag = document.createElement("p");
    newPTag.className = "sentimentInCard";
    const headlineText = document.createTextNode(`Mood: ${sentiment}`);
    const aTag = document.querySelector(`.aTagInCard${index}`)
    newPTag.appendChild(headlineText);
    aTag.appendChild(newPTag);
} 

newsApp.events = function () {
    newsApp.mobileNavClick()
    newsApp.moreArticles()
    newsApp.buttonSearch()
    newsApp.receiveSearchField()
    newsApp.goToArticlePage()
}

newsApp.mobileNavClick = function () {
   
    // click event function to make sure the hamburger works
    const hamburgerVariable = document.querySelector(".hamburger");
    const dropdownVariable = document.querySelector(".dropdown");
    // hamburgerVariable.addEventListener("click", function (e) {
    //     hamburgerVariable.toggle("is-active");
    //     dropdownVariable.toggle('dropdown-start')
    // });
    hamburgerVariable.onclick = function () {
        hamburgerVariable.classList.toggle("is-active");
        dropdownVariable.classList.toggle('dropdown-start')
    }
}

newsApp.moreArticles = function () {
    const moreArticlesButton = document.querySelector(".moreNews");
    let newArticleAmount = newsApp.currentArticles + 6;
    moreArticlesButton.onclick = function () {
        newsApp.clearHeadlines()
        newsApp.displayHeadlines(newsApp.newsStore, newArticleAmount)
    }
    
}

newsApp.buttonSearch = function () {
    const techButton = document.querySelector(".techButton");
    const sportsButton = document.querySelector(".sportsButton");
    const entertainmentButton = document.querySelector(".entertainmentButton");
    const businessButton = document.querySelector(".businessButton");
    const scienceButton = document.querySelector(".scienceButton");
    newsApp.refreshNewsOnButton('top-headlines', techButton, 'category=technology&');
    newsApp.refreshNewsOnButton('top-headlines', sportsButton, 'category=sports&');
    newsApp.refreshNewsOnButton('top-headlines', entertainmentButton, 'category=entertainment&');
    newsApp.refreshNewsOnButton('top-headlines', businessButton, 'category=business&');
    newsApp.refreshNewsOnButton('top-headlines', scienceButton, 'category=science&');
}

newsApp.refreshNewsOnButton = function (searchType, button, category) {
    button.onclick = function () {
        newsApp.clearHeadlines()
        newsApp.getNewsHeadlines(searchType, category, 'country=us&');
    }
}


newsApp.receiveSearchField = function () {
    
    const submitButton = document.querySelector(".userSearch");
    submitButton.addEventListener('submit', function (event) {
        event.preventDefault();
        let searchField = document.querySelector('#search').value;
        console.log(searchField)
        searchField = 'q=' + searchField + '&';
        newsApp.refreshNewsOnSearch('everything', searchField);

    })
}

newsApp.refreshNewsOnSearch = function (searchType, searchField) {
    newsApp.clearHeadlines()
    newsApp.getNewsHeadlines(searchType, searchField);
    console.log('search')
}

newsApp.goToArticlePage = function() {
    const link = document.querySelector('.newsCardsSection')
    link.onclick = function (event) {
        console.log(event.target.id)
        var newTitle = event.target.id
        cutTitle = newsApp.removeSourceFromTitle(newTitle)
        console.log(cutTitle)
        const titleForSearch = 'q=' + cutTitle + '&';
        newsApp.refreshNewsOnSearch('everything', titleForSearch);
    }
    

}

newsApp.removeSourceFromTitle = (newTitle)=> {
    // newTitle = newTitle.substr(0, newTitle.indexOf(' ', newTitle.indexOf(' ') + 1));
    newTitle = newTitle.split(/\s+/).slice(0, 6).join(" ");
    return newTitle
}

newsApp.saveToLocalStorage = function (title) {
    localStorage.setItem('title', `${title}`)
}



// initial function that kicks off the two main categories of programming i) on load (= explore.html / profile.html) and ii) on click (=guest.html, host.html, explore.html)
newsApp.init = function () {
    newsApp.events();
    newsApp.pageLoad();
}

// run init in 

newsApp.init();



