

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

newsApp.displayHeadlines = (news, articleAmount) => {
    // clear old headlines 
    news.forEach((item, index) => {  
        if (index < articleAmount) {
            // Create new Div, title and Img tag and add classnames
            const newDiv = document.createElement("div");
            newDiv.className = "headlineCard";
            const newATag = document.createElement("a");
            const imgDiv = document.createElement("div");
            imgDiv.className = "headlineImageDiv";
            const newImg = document.createElement("img");
            newImg.className = "headlineImage";
            const newH2 = document.createElement("h2");
            newH2.className = "headlineText";

            // add news api data to the title and image tags
            const headlineText = document.createTextNode(`${item.title}`);
            newImg.setAttribute("src", `${item.urlToImage}`);
            newATag.setAttribute('href', `${item.url}`);

            console.log('added')
            // append text to h2 then h2 and and Image tag to div. Then append div to section ready
            newH2.appendChild(headlineText);
            imgDiv.appendChild(newImg)
            newDiv.appendChild(newATag)
            newATag.appendChild(newH2);
            newATag.appendChild(imgDiv);
            document.querySelector('.newsCardsSection').appendChild(newDiv);  
        }
        
    })
}

newsApp.clearHeadlines = function() {
    const headlineSection = document.querySelector('.newsCardsSection');
    headlineSection.innerHTML = '';

    console.log('cleared')
} 


newsApp.events = function () {
    newsApp.mobileNavClick()
    newsApp.moreArticles()
    newsApp.buttonSearch()
    newsApp.receiveSearchField()
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





// initial function that kicks off the two main categories of programming i) on load (= explore.html / profile.html) and ii) on click (=guest.html, host.html, explore.html)
newsApp.init = function () {
    newsApp.events();
    newsApp.pageLoad();
}

// run init in 

newsApp.init();



