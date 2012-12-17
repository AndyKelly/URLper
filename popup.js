//Global variables
var URLmeButtonElement;
var StoreItButtonElement;
var RedCategoryElement;
var GreenCategoryElement;
var BlueCategoryElement;
var OrangeCategoryElement;
var SelectedCategoryID;
var FoundRed = false;
var FoundGreen = false;
var FoundBlue = false;
var FoundOrange = false;
var FoundUrlper = false;
var RedID;
var GreenID;
var BlueID;
var OrangeID;
var ASyncLock_LookForUrlperFolders = true;
var Timer;


	function InitBookMarkFolders()
	{
		/// <summary>
		/// This function retrieves a tree of bookmarks from the chrome api & passes the ASync_LookForUrlperFolders() function as a callback
		/// It then begins a timer based check to see if the bookmarks folders have been retrived/ set up correcrtly.
		/// </summary>
		chrome.bookmarks.getTree(function(bookmarks) 
		{
			ASync_LookForUrlperFolders(bookmarks);
		});
		
		TimedCheckOfBookMarks();
	}

	function TimedCheckOfBookMarks()
	{
		/// <summary>
		/// This function creates a time and passes the timer completion check as a callback, to be called 10 times a second 
		/// </summary>
		Timer = setInterval(function(){ TimerCompletionCheck()},100);
	}

	function TimerCompletionCheck()
	{
		/// <summary>
		/// This function Checks if the Bookmark folders have been found, if so it clears the timer and cunstructs the bookmark html element
		/// </summary>
		if(CheckIfBookmarkFoldersHaveBeenFound())
		{
			clearInterval(Timer);
			//All done, lets display them
			ConstructBookmarks();
		}
	}

	function CheckIfBookmarkFoldersHaveBeenFound()
	{
		/// <summary>
		/// Checks if the lock: ASyncLock_LookForUrlperFolders is open(false) if it is then all urlper folders have been found,
		/// if they are not found in the entire bookmark tree, the  CheckAndCreateBookmarkFolders() fucntion will create them.
		/// This function will repeatedly be executed until it returns true.
		/// </summary>
		//Lock is open, we can now assume the bool values: FoundBlue, FoundOrange etc are properly set
		if(ASyncLock_LookForUrlperFolders == false)
		{
			CheckAndCreateBookmarkFolders();
			//Lets close this lock again so that The timer completion check only returns true once
			ASyncLock_LookForUrlperFolders = true;
			return true;
		}
		return false;
	}

	function ASync_LookForUrlperFolders(bookmarks) 
	{
		/// <summary>
		/// This function recursively iterates through each node found beneath the node which is passed to it initaly
		/// If we find a node which has a title of Urlper, Urlper Red etc, then store the Id of the folder in a global var, i.e. RedID
		/// and set the global bools , FoundUrlper, FoundRed, etc to true.
		/// if  a given node N has children, we call ASync_LookForUrlperFolders(N) & close ASyncLock_LookForUrlperFolders
		/// This lock is opened each time the function is called, we assume that each time the function is executed, it could be the last. 
		/// </summary>
		
		//Open lock, this block could be the last to execute
		ASyncLock_LookForUrlperFolders = false;
		bookmarks.forEach(function(bookmark) 
		{
			if(bookmark.title =="Urlper")
			{
				//Found the urlper folder
				FoundUrlper = true;
			}
			else if(bookmark.title =="Urlper Red")
			{
				//Found the urlper red folder
				FoundRed = true;
				RedID = bookmark.id;
				//By default we display the red category, the folder has been found so we can now display it.
				SelectedCategoryID = RedID;
			}
			else if(bookmark.title =="Urlper Green")
			{
				//Found the urlper green folder
				FoundGreen = true;
				GreenID = bookmark.id;
			}
			else if(bookmark.title =="Urlper Blue")
			{
				//Found the urlper blue folder
				FoundBlue = true;
				BlueID = bookmark.id;
			}
			else if(bookmark.title =="Urlper Orange")
			{
				//Found the urlper orange folder
				FoundOrange = true;
				OrangeID = bookmark.id;
			}
			
			//Keep looking through the tree
			if (bookmark.children)
			{
				//Task is still on going, Close lock;
				ASyncLock_LookForUrlperFolders = true;
				ASync_LookForUrlperFolders(bookmark.children);
			}
				
		});
	}

	function ASync_AddChildFolderToUrlper(Title)
	{
		/// <summary>
		/// Takes a Var called title which contains the title of the folder we are creating
		/// The fucntion ASync_CreateFolderWithThisTitleUnderUrlper function is then set as a callback. 
		/// </summary>
		chrome.bookmarks.getTree(function(bookmarks) 
		{
			ASync_CreateFolderWithThisTitleUnderUrlper(bookmarks, Title)
		});
	}

	function ASync_CreateFolderWithThisTitleUnderUrlper(bookmarks, Title)
	{
		/// <summary>
		/// A callback is added to the bookmarks.forEach function which first looks for the Urlper folder
		/// If the current node is the Urlper folder then we create a child of folder with the passed Title
		/// We then check the value of the Title for the created folder and associate the global Id's accordinly
		/// This function is called recursivly on each node found. 
		/// </summary>
		bookmarks.forEach(function(bookmark) 
		{	
			if(bookmark.title == "Urlper")
			{
				chrome.bookmarks.create({parentId: bookmark.id, title: Title}, function(newFolder) 
				{
					// Set the global Id
					if(newFolder.title = "Urlper Red")
					{
						RedID = newFolder.id;
					}
					else if(newFolder.title = "Urlper Green")
					{
						GreenID = newFolder.id;
					}
					
					else if(newFolder.title = "Urlper Blue")
					{
						BlueID = newFolder.id;
					}
					
					else if(newFolder.title = "Urlper Orange")
					{
						OrangeID = newFolder.id;
					}
				});
			}
			if(bookmark.children)
			{
				ASync_CreateFolderWithThisTitleUnderUrlper(bookmark.children, Title);
			}
		});
	}
		
	function CheckAndCreateBookmarkFolders()
	{
		/// <summary>
		/// Checks if the global bools, FoundUrlper, FoundRed etc have been set
		/// If they havnt then the folder is not present within the bookmarks tree
		/// In that case we create either the parent Urlper folder, who's parentId is 1(1 is the Id of the bookmarks bar)
		/// Or we call the ASync_AddChildFolderToUrlper(Title of the folder to create) & set the correspondin bool to true.
		/// </summary>
		//If they're not found, create them.
		if(FoundUrlper != true)
		{
			//Couldnt find the urlper folder, attempting to create it
			chrome.bookmarks.create({parentId: "1", title: "Urlper"});
			FoundUrlper =true;
		}
		if(FoundRed != true)
		{
			//Couldnt find the urlper red folder, attempting to create it
			ASync_AddChildFolderToUrlper("Urlper Red");
			FoundRed = true;
		}
		if(FoundGreen != true)
		{
			//Couldnt find the urlper green folder, attempting to create it
			ASync_AddChildFolderToUrlper("Urlper Green");
			FoundGreen = true;
		}
		if(FoundBlue != true)
		{
			//Couldnt find the urlper blue folder, attempting to create it
			ASync_AddChildFolderToUrlper("Urlper Blue");
			FoundBlue = true;
		}
		if(FoundOrange != true)
		{
			//Couldnt find the urlper orange folder, attempting to create it
			ASync_AddChildFolderToUrlper("Urlper Orange");
			FoundOrange = true;
		}

	}

	function DefineCategoryButtonVisuals()
	{
		/// <summary>
		/// Defines the visual style of the category buttons
		/// </summary>
		
		//Red category
		RedCategoryElement.onmouseover = function() 
		{
			RedCategoryElement.style.backgroundColor="#ffc3e6"; 
		};
		
		RedCategoryElement.onmouseout = function() 
		{
			RedCategoryElement.style.backgroundColor="#ff0097";
		};
		
		RedCategoryElement.onmousedown = function()
		{
			RedCategoryElement.style.backgroundColor="#e2eded"; 
		};
		
		RedCategoryElement.onmouseup = function()
		{
			RedCategoryElement.style.backgroundColor="#ffc3e6";
		};
		
		// Green category		
		GreenCategoryElement.onmouseover = function() 
		{
			GreenCategoryElement.style.backgroundColor="#d5f498"; 
		};
		
		GreenCategoryElement.onmouseout = function() 
		{
			GreenCategoryElement.style.backgroundColor="#8CBF26";
		};
		
		GreenCategoryElement.onmousedown = function()
		{
			GreenCategoryElement.style.backgroundColor="#e2eded"; 
		};
		
		GreenCategoryElement.onmouseup = function()
		{
			GreenCategoryElement.style.backgroundColor="#8CBF26";
		};
		
		//Blue category
		BlueCategoryElement.onmouseover = function() 
		{
			BlueCategoryElement.style.backgroundColor="#b6e7fb"; 
		};
		
		BlueCategoryElement.onmouseout = function() 
		{
			BlueCategoryElement.style.backgroundColor="#00B4FF";
		};
		
		BlueCategoryElement.onmousedown = function()
		{
			BlueCategoryElement.style.backgroundColor="#e2eded"; 
		};
		
		BlueCategoryElement.onmouseup = function()
		{
			BlueCategoryElement.style.backgroundColor="#00B4FF";
		};
		
		//Orange category
		OrangeCategoryElement.onmouseover = function() 
		{
			OrangeCategoryElement.style.backgroundColor="#ffd89a"; 
		};
		
		OrangeCategoryElement.onmouseout = function() 
		{
			OrangeCategoryElement.style.backgroundColor="#f09609";
		};
		
		OrangeCategoryElement.onmousedown = function()
		{
			OrangeCategoryElement.style.backgroundColor="#e2eded"; 
		};
		
		OrangeCategoryElement.onmouseup = function()
		{
			OrangeCategoryElement.style.backgroundColor="#f09609";
		};
	}

	function DefineSideButtonVisuals()
	{
		/// <summary>
		/// Defines the visual style of the side pane buttons
		/// </summary>
		
		//UrlMe Button
		URLmeButtonElement.onmouseover = function() 
		{
			URLmeButtonElement.style.backgroundColor="#b8d4d3"; 
		};
		
		URLmeButtonElement.onmouseout = function() 
		{
			URLmeButtonElement.style.backgroundColor="#85a6a5";
		};
		
		URLmeButtonElement.onmousedown = function()
		{
			URLmeButtonElement.style.backgroundColor="#e2eded"; 
		};
		
		URLmeButtonElement.onmouseup = function()
		{
			URLmeButtonElement.style.backgroundColor="#b8d4d3";
		};
		
		//Store it button
		StoreItButtonElement.onmouseover = function() 
		{
			StoreItButtonElement.style.backgroundColor="#b8d4d3"; 
		};
		
		StoreItButtonElement.onmouseout = function() 
		{
			StoreItButtonElement.style.backgroundColor="#85a6a5";
		};
		
		StoreItButtonElement.onmousedown = function()
		{
			StoreItButtonElement.style.backgroundColor="#e2eded"; 
		};
		
		StoreItButtonElement.onmouseup = function()
		{
			StoreItButtonElement.style.backgroundColor="#b8d4d3";
		};
	}

	function RedCategoryClick()
	{
		/// <summary>
		/// Sets the SelectedCategoryID var to RedID
		/// Refreshes the bookmark element
		/// </summary>
		SelectedCategoryID = RedID;
		ConstructBookmarks();
	}

	function GreenCategoryClick()
	{
		/// <summary>
		/// Sets the SelectedCategoryID var to GreenID
		/// Refreshes the bookmark element
		/// </summary>
		SelectedCategoryID = GreenID;
		ConstructBookmarks();
	}

	function BlueCategoryClick()
	{
		/// <summary>
		/// Sets the SelectedCategoryID var to BlueID
		/// Refreshes the bookmark element
		/// </summary>
		SelectedCategoryID = BlueID;
		ConstructBookmarks();
	}

	function OrangeCategoryClick()
	{
		/// <summary>
		/// Sets the SelectedCategoryID var to OrangeID
		/// Refreshes the bookmark element
		/// </summary>
		SelectedCategoryID = OrangeID;
		ConstructBookmarks();
	}

	function DefineButtonFunctionalities()
	{
		/// <summary>
		/// Associates the functionality of each category, UrlMe & StoreIt buttons with theyre javascript events
		/// </summary>
		RedCategoryElement = document.getElementById('RedSquare');
		RedCategoryElement.onclick = function() 
		{
			RedCategoryClick();
		};	
		
		GreenCategoryElement = document.getElementById('GreenSquare');
		GreenCategoryElement.onclick = function() 
		{
			GreenCategoryClick();
		};
		
		BlueCategoryElement = document.getElementById('BlueSquare');
		BlueCategoryElement.onclick = function() 
		{
			BlueCategoryClick();
		};
		
		OrangeCategoryElement = document.getElementById('OrangeSquare');
		OrangeCategoryElement.onclick = function() 
		{
			OrangeCategoryClick();
		};
		
		URLmeButtonElement = document.getElementById('UrlMeButton');
		URLmeButtonElement.onclick = function() 
		{
			URLme();
		};
		
		StoreItButtonElement= document.getElementById('StoreItButton');
		StoreItButtonElement.onclick = function() 
		{
			StoreIt();
		};
		
	}

	function ConstructBookmarks()
	{
		/// <summary>
		/// Clears the BookmarksPane html element
		/// retrieves the children of the selectedID bookmark node & constructs a bookmark element for each one
		/// The css class to use is decided at this time by checking the selectedID against all of the other possible values it could have
		/// </summary>
		var ParentElement = document.getElementById('BookmarksPane');
		//Clear div
		ParentElement.innerHTML = "";
		
		var Class;
		if(SelectedCategoryID == RedID)
		{
			Class = "BookMarkRed";
		}
		else if(SelectedCategoryID == GreenID)
		{
			Class = "BookMarkGreen";
		}
		else if(SelectedCategoryID == BlueID)
		{
			Class = "BookMarkBlue";
		}
		else if(SelectedCategoryID == OrangeID)
		{
			Class = "BookMarkOrange";
		}
		chrome.bookmarks.getChildren(SelectedCategoryID,function(bookmarks) 
		{
			bookmarks.forEach(function(bookmark) 
			{
				//Dump bookmarks to div emement
				ParentElement.appendChild(ConstructBookmark(Class,bookmark));	
			});
		});

	}

	function ConstructBookmark(Class,bookmark)
	{
		/// <summary>
		/// Constructs and returns a html, bookmark element when passed a css class name and a bookmark node
		/// </summary>
		BookMarkElement = document.createElement('div');
		BookMarkElement.className = Class;
		BookMarkElement.appendChild(ConstructBookmarkUrlElement(bookmark.title, bookmark.url))	
		BookMarkElement.appendChild(ConstructTrashcanElement(bookmark.id));
		BookMarkElement.appendChild(ConstructFaviconElement(bookmark.url));	
		var $elem = $(BookMarkElement);
		$elem.css({display:'block'}).animate({marginTop:'0px', opacity:'1'},'slow');
		return BookMarkElement;
	}

	function ConstructTrashcanElement(ID)
	{
		/// <summary>
		/// Constructs trash can element and associates its javascript onclick event with it
		/// </summary>
		var TrashcanElement = document.createElement('div');
		TrashcanElement.className = 'DeleteIcon';
		var img = document.createElement("IMG");
		img.src = "deleteicon.png";
		TrashcanElement.appendChild(img);
		TrashcanElement.onclick = function() { DeleteBookmark(ID); };
		return TrashcanElement;
	}

	function DeleteBookmark(ID)
	{
		/// <summary>
		/// Removes a bookmark node by ID, refreshes the bookmark html element
		/// </summary>
		chrome.bookmarks.remove(ID);
		//Refresh bookmarks
		ConstructBookmarks();
	}

	function ConstructBookmarkUrlElement(Title,URL)
	{
		/// <summary>
		/// Creates a Bookmark url element
		///	Trims the display string to an acceptable length if it is too long to display
		///	Creates the a href html element and points it towards the passed URL
		/// </summary>
		if(Title.length > 38) 
		{	
			Title = Title.substring(0,35);
			Title+= "...";
		}
		var URLElement = document.createElement('div');
		URLElement.className = 'BookMarkText';
		var TextElement = document.createElement('Normal');
		
		var Link = document.createElement('div');
		Link.innerHTML = Title;
		
		Link.onclick = function() { OpenNewTab(URL); };
		
		TextElement.appendChild(Link);
		URLElement.appendChild(TextElement);
		return URLElement;
	}

	function ConstructFaviconElement(URL)
	{
		/// <summary>
		/// Constructs a favicon image and points its href at the passed URL
		/// </summary>
		var FaviconElement = document.createElement('div');
		FaviconElement.className = 'Favicon';
		var img = document.createElement("img");
		img.src = ConstructFaviconString(URL);
		FaviconElement.appendChild(img);
		FaviconElement.onclick = function() { OpenNewTab(URL); };		
		return FaviconElement;
	}

	function ConstructFaviconString(URL)
	{
		/// <summary>
		/// Constructs and returns the img src value for a favicon element
		/// We take a Url, strip away "http://" or "https://" 
		/// Then we use construct a sub string from the passed string which ends at the first "/"
		/// i.e.  "www.andyjkelly.com/about" becomes "www.andyjkelly.com"
		/// Then we append the url to the location of the google s2 favicon webservice
		/// </summary>
		URL = URL.replace(/^https?:\/\//,'');
		URL = URL.replace(/^http?:\/\//,'');
		var StringEndIndexPos = URL.indexOf("/") ; 
		URL = URL.substring(0,StringEndIndexPos);
		var returnVal = "http://www.google.com/s2/favicons?domain="
		returnVal +=  URL;
		return returnVal;
	}

	function URLme()
	{	
		/// <summary>
		/// Retrieves a random url from the folder current selected category
		/// Opens it in a new tab and deletes it
		/// </summary>
		chrome.bookmarks.getChildren(SelectedCategoryID,function(bookmarks) 
		{
			var Length = bookmarks.length;
			Length--;
			var RandomIndex = Math.floor((Math.random()*Length)+0);
			OpenNewTab(bookmarks[RandomIndex].url);
			DeleteBookmark(bookmarks[RandomIndex].id);
		})
	}

	function StoreIt()
	{
		/// <summary>
		/// Stores the Url of the current tab as a bookmark under the current seleted category
		/// </summary>
		chrome.tabs.getSelected(null,function(CurrentTab)
		{
			chrome.bookmarks.create({parentId: SelectedCategoryID, title: CurrentTab.title, url: CurrentTab.url}, function(){ConstructBookmarks();});
		});
	}

	function OpenNewTab(URL)
	{
		/// <summary>
		/// A wrapper function for the chrome api call chrome.tabs.create() to add to readability
		/// </summary>
		chrome.tabs.create({url: URL});
	}

	function Init()
	{
		/// <summary>
		/// Defines button functionalities and visual apperances
		/// Initalises the bookmark folders which in turn set up everything needed for the app to run, i.e CategoryID's, bookmark folders etc
		/// </summary>
		DefineButtonFunctionalities();
		DefineSideButtonVisuals();
		DefineCategoryButtonVisuals();
		InitBookMarkFolders();
	}

	//Entry point for the application. Calls the init function.
	document.addEventListener('DOMContentLoaded', 
		function () 
		{
			Init();	
		}
	);
