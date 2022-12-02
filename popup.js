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

// now we have a cache of keys of the base urls and a value that is an array of all of the urls that match the base url !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  // loop through the cache object
    // call chrome.tabs.group(the array of IDs)
    // chrome.tabGroups.update(the new group, { title: cleaned up string of the base url})

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
