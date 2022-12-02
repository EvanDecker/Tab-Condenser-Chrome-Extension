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

// now we have a cache of keys of the base urls and a value that is an array of all of the urls that match the base url !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  // loop through the cache object
    // call chrome.tabs.group(the array of IDs)
    // chrome.tabGroups.update(the new group, { title: cleaned up string of the base url})


  // we need to get the new groupIds from the created groups
  // append to the ul (link-list) a <li> element with a <a> that focuses on the corresponding group

  // each iteration of the for loop
    // 


const button = document.querySelector('button');
button.addEventListener("click", async () => {
  const cache = createCache();
  const cacheArr = Object.entries(cache);
  const tabNumberCheck = document.getElementById('tab-number-check').value;
  const linkList = document.getElementById('link-list');

  for(let i = 0; i < cacheArr.length; i++) {
    console.log(cacheArr[i]);

    if(cacheArr[i][1].length >= tabNumberCheck) {
      const newGroup = await chrome.tabs.group({ tabIds: cacheArr[i][1] });
      
      await chrome.tabGroups.update(newGroup, {
        title: cacheArr[i][0],
        collapsed: true
      });
      chrome.tabGroups.get(newGroup, (el) => {
        console.log(el);

        const liElement = document.createElement('div');
        liElement.className = 'list-div';
        liElement.innerText = el.title;

        liElement.addEventListener('click', async (e) => {
          const tabGroup = await chrome.tabGroups.get(el.id);
          console.log(tabGroup);
          if(tabGroup.collapsed === false) {
            await chrome.tabGroups.update(el.id, { collapsed: true });
          } else if(tabGroup.collapsed === true) {
            await chrome.tabGroups.update(el.id, { collapsed: false });
          }

        });

        linkList.appendChild(liElement);
      });
    }
  }
});

// await chrome.tabs.update(tab.id, { active: true });

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
  // const pathname = new URL(tab.url).pathname.slice("/docs".length);

//   element.querySelector(".title").textContent = title;
//   element.querySelector(".pathname").textContent = pathname;
//   element.querySelector("a").addEventListener("click", async () => {
//     // need to focus window as well as the active tab
    // await chrome.tabs.update(tab.id, { active: true });
    // await chrome.windows.update(tab.windowId, { focused: true });
//   });

//   elements.add(element);
// }
// document.querySelector("ul").append(...elements);

//group all tabs



      


