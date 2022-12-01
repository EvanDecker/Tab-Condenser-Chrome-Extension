//query retrives the tabs

// when we call query, pass no parameters so that we get all tabs
// get all tabs into one array
let tabs = await chrome.tabs.query({});

  // sort the big array by "url" aka alphabetically
function compare (a,b) {
    if (a.url < b.url) {
        return -1;
    }
    if (a.url > b.url) {
        return 1;
    }
    return 0;
}
tabs = tabs.sort(compare);
// console.log(tabs);

  // declare a cache object
    // loop through the array
    // check the cache keys for the base url string (https://www.youtube.com)
    // value is an array that we push the tab's IDs into

function createCache() {
  const cache = {};

  const pinnedCheckboxValue = document.getElementById('pinned-toggle').checked;

  for(let i = 0; i < tabs.length; i++) {
      const regex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img;
  
      let hostname = regex.exec(tabs[i].url);
      
      // cache[hostname[1]].push(tabs[i].id);
      if(pinnedCheckboxValue === true) {
        if (cache[hostname[1]] === undefined) {
          cache[hostname[1]] = [];
        } 
        cache[hostname[1]].push(tabs[i].id);
      } else {
        if (tabs[i].pinned === false) {
          if (cache[hostname[1]] === undefined) {
            cache[hostname[1]] = [];
          } 
          cache[hostname[1]].push(tabs[i].id);
        }
      }
      
      // cache[hostname[1]].push([tabs[i].id, tabs[i].pinned]);
    }
  
  console.log(cache);
  return cache;
}
// const cache = createCache();
// console.log(cache);

// {
//   youtube.com: [[23746298374, true], [28934702983472, false], [980273048234, true]]

//   github.com: {
//     ids: [2897402874092843, 820734092873408, 289734092734],
//     pinned: [true, false, true]
//   }
// }

//pinned = true

// now we have a cache of keys of the base urls and a value that is an array of all of the urls that match the base url !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  // loop through the cache object
    // call chrome.tabs.group(the array of IDs)
    // chrome.tabGroups.update(the new group, { title: cleaned up string of the base url})


const button = document.querySelector('button');
button.addEventListener("click", async () => {
  const cache = createCache();

  const cacheArr = Object.entries(cache);
  console.log(cacheArr);

  for(let i = 0; i < cacheArr.length; i++) {
    console.log(cacheArr[i]);

    const newGroup = await chrome.tabs.group({ tabIds: cacheArr[i][1] });
    await chrome.tabGroups.update(newGroup, {
      title: cacheArr[i][0],
      collapsed: true
    });
  }
});

// const button = document.querySelector("button");
// button.addEventListener("click", async () => {
//   // tabIds is using destructing/shorthand for extracting just the id properties of each tab object within the tabs array
//   const tabIds = tabs.map(({ id }) => id);
//   // the chrome.tabs.group function is what actually collects the tabs (by id) into a group
//   const group = await chrome.tabs.group({ tabIds });
//   // the tabGroups.update is here to simply apply the title of DOCS to the new group
//   await chrome.tabGroups.update(group, { title: "DOCS" });
// });



// const template = document.getElementById("li_template");
// const elements = new Set();
// for (const tab of tabs) {
//   // instatiating a copy of the template in the DOM I think?
//   const element = template.content.firstElementChild.cloneNode(true);

//   // not for us
//   const title = tab.title.split("-")[0].trim();
//   // parsing the pathname for the specific query they are doing
//   const pathname = new URL(tab.url).pathname.slice("/docs".length);

//   element.querySelector(".title").textContent = title;
//   element.querySelector(".pathname").textContent = pathname;
//   element.querySelector("a").addEventListener("click", async () => {
//     // need to focus window as well as the active tab
//     await chrome.tabs.update(tab.id, { active: true });
//     await chrome.windows.update(tab.windowId, { focused: true });
//   });

//   elements.add(element);
// }
// document.querySelector("ul").append(...elements);

//group all tabs



      


