
var URLmeElement;
var StoreItButtonElement;
var RedCategoryElement;
var GreenCategoryElement;
var BlueCategoryElement;
var OrangeCategoryElement;
var CategoriesEnum;
var SelectedCategory;
var FoundRed = false;
var FoundGreen = false;
var FoundBlue = false;
var FoundOrange = false;
var FoundUrlper = false;
var ASyncLock_LookForUrlperFolders = true;
var Finished = false;
var Timer;
var BookmarksCounter;

//TODO Is this gonna be used YAGNI
var UrlperID;
var RedID;
var GreenID;
var BlueID;
var OrangeID;

	function InitBookMarkFolders()
	{
		chrome.bookmarks.getTree(function(bookmarks) 
		{
			console.debug("Looking for bookmark folders");
			ASync_LookForUrlperFolders(bookmarks);

		});
		
		TimedCheckOfBookMarks();
	}
	
	function TimedCheckOfBookMarks()
	{
		Timer = setInterval(function(){ TimerCompletionCheck(CheckIfBookmarkFoldersHaveBeenFound())},100);
	}
	
	function TimerCompletionCheck(Done)
	{
		if(Done)
		{
			clearInterval(Timer);
			//All done, lets display them
			ConstructBookmarks();
			
		}
	}
	
	function CheckIfBookmarkFoldersHaveBeenFound()
	{
		//Lock is open, we can now assume the bool values: FoundBlue, FoundOrange etc are properly set
		if(ASyncLock_LookForUrlperFolders == false)
		{
			CheckAndCreateBookmarkFolders();
			//Todo, remove this and fix dependancies, Lets close this lock again so that The timer completion check only returns true once
			//Why the flute is the timer check calling more than once?
			ASyncLock_LookForUrlperFolders = true;
			return true;
		}
		return false;
	}
	
	function CheckAndCreateBookmarkFolders()
	{
		//If theyre not found then create them
		if(FoundUrlper != true)
		{
			console.debug("Couldnt find the urlper folder, attempting to create it");
			chrome.bookmarks.create({parentId: "1", title: "Urlper"});
			FoundUrlper =true;
		}
		if(FoundRed != true)
		{
			//TODO URLPER RED SHOULD BE DEFINED GLOBALY
			console.debug("Couldnt find the urlper red folder, attempting to create it");
			ASync_AddChildToUrlper("Urlper Red");
			FoundRed = true;
		}
		if(FoundGreen != true)
		{
			console.debug("Couldnt find the urlper green folder, attempting to create it");
			ASync_AddChildToUrlper("Urlper Green");
			FoundGreen = true;
		}
		if(FoundBlue != true)
		{
			console.debug("Couldnt find the urlper blue folder, attempting to create it");
			ASync_AddChildToUrlper("Urlper Blue");
			FoundBlue = true;
		}
		if(FoundOrange != true)
		{
			console.debug("Couldnt find the urlper orange folder, attempting to create it");
			ASync_AddChildToUrlper("Urlper Orange");
			FoundOrange = true;
		}
	
	}
	
	function ASync_LookForUrlperFolders(bookmarks) 
	{
		//Open lock, this block could be the last to execute
		ASyncLock_LookForUrlperFolders = false;
		bookmarks.forEach(function(bookmark) 
		{
			if(bookmark.title =="Urlper")
			{
				console.debug("Found the urlper folder");
				FoundUrlper = true;
				UrlperID = bookmark.id;
			}
			else if(bookmark.title =="Urlper Red")
			{
				console.debug("Found the urlper red folder");
				FoundRed = true;
				RedID = bookmark.id;
			}
			else if(bookmark.title =="Urlper Green")
			{
				console.debug("Found the urlper green folder");
				FoundGreen = true;
				GreenID = bookmark.id;
			}
			else if(bookmark.title =="Urlper Blue")
			{
				console.debug("Found the urlper blue folder");
				FoundBlue = true;
				BlueID = bookmark.id;
			}
			else if(bookmark.title =="Urlper Orange")
			{
				console.debug("Found the urlper orange folder");
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

	//TODO NAME THESE PROPERLY!
	function ASync_AddChildToUrlper(Title)
	{
		chrome.bookmarks.getTree(function(bookmarks) 
		{
			ASync_sgsgsf(bookmarks, Title)
		});
	}
	
	function ASync_sgsgsf(bookmarks, Title)
	{
			bookmarks.forEach(function(bookmark) 
			{	
				console.debug("Wat");
				if(bookmark.title == "Urlper")
				{
					chrome.bookmarks.create({parentId: bookmark.id, title: Title}, function(newFolder) 
					{
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
					console.debug("Created the folder " + Title);
				}
				if(bookmark.children)
				{
					ASync_sgsgsf(bookmark.children, Title);
				}
			});
	}
	

	function DefineCategoryButtonVisuals()
	{
	//Todo, replace with css, hover
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
	//Todo, replace with css, hover
		URLmeElement.onmouseover = function() 
		{
			URLmeElement.style.backgroundColor="#b8d4d3"; 
		};
		
		URLmeElement.onmouseout = function() 
		{
			URLmeElement.style.backgroundColor="#85a6a5";
		};
		
		URLmeElement.onmousedown = function()
		{
			URLmeElement.style.backgroundColor="#e2eded"; 
		};
		
		URLmeElement.onmouseup = function()
		{
			URLmeElement.style.backgroundColor="#b8d4d3";
		};
		
		
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
		SelectedCategory = CategoriesEnum.Red;
		ConstructBookmarks();
	}

	function GreenCategoryClick()
	{
		SelectedCategory = CategoriesEnum.Green;
		ConstructBookmarks();
	}

	function BlueCategoryClick()
	{
		SelectedCategory = CategoriesEnum.Blue;
		ConstructBookmarks();
	}

	function OrangeCategoryClick()
	{
		SelectedCategory = CategoriesEnum.Orange;
		ConstructBookmarks();
	}
	

	function DefineButtonFunctionalities()
	{

		RedCategoryElement = document.getElementById('RedSquare');
		RedCategoryElement.style.cursor = 'pointer';
		RedCategoryElement.onclick = function() 
		{
			RedCategoryClick();
		};	
		
		GreenCategoryElement = document.getElementById('GreenSquare');
		GreenCategoryElement.style.cursor = 'pointer';
		GreenCategoryElement.onclick = function() 
		{
			GreenCategoryClick();
		};
		
		BlueCategoryElement = document.getElementById('BlueSquare');
		BlueCategoryElement.style.cursor = 'pointer';
		BlueCategoryElement.onclick = function() 
		{
			BlueCategoryClick();
		};
		
		OrangeCategoryElement = document.getElementById('OrangeSquare');
		OrangeCategoryElement.style.cursor = 'pointer';
		OrangeCategoryElement.onclick = function() 
		{
			OrangeCategoryClick();
		};
		
		URLmeElement = document.getElementById('UrlMeButton');
		URLmeElement.style.cursor = 'pointer';
		URLmeElement.onclick = function() 
		{
			URLme();
		};
		
		StoreItButtonElement= document.getElementById('StoreItButton');
		StoreItButtonElement.style.cursor = 'pointer';
		StoreItButtonElement.onclick = function() 
		{
			StoreIt();
		};
		
		
		DefineSideButtonVisuals();
		DefineCategoryButtonVisuals();
	}
	function ConstructBookmarks()
	{
		BookmarksCounter = 0;
		var ParentElement = document.getElementById('BookmarksPane');
		//Clear out the div
		ParentElement.innerHTML = "";
		var ParentID;
		var Class;
		if(SelectedCategory == CategoriesEnum.Red)
		{
			Class = "BookMarkRed";
			ParentID = RedID;
		}
		else if(SelectedCategory == CategoriesEnum.Green)
		{
			Class = "BookMarkGreen";
			ParentID = GreenID;
		}
		else if(SelectedCategory == CategoriesEnum.Blue)
		{
			Class = "BookMarkBlue";
			ParentID = BlueID;
		}
		else if(SelectedCategory == CategoriesEnum.Orange)
		{
			Class = "BookMarkOrange";
			ParentID = OrangeID;
		}
		
		
		chrome.bookmarks.getChildren(ParentID,function(bookmarks) 
		{
			bookmarks.forEach(function(bookmark) 
			{
				//Dump bookmarks to div emement
				ParentElement.appendChild(ConstructBookmark(Class,bookmark));				
				BookmarksCounter++;
			});
		});

	}
	
	function ConstructBookmark(Class,bookmark)
	{
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
		chrome.bookmarks.remove(ID);
		//Refresh bookmarks
		ConstructBookmarks();
	}

	function ConstructBookmarkUrlElement(Title,URL)
	{
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
		var FaviconElement = document.createElement('div');
		FaviconElement.className = 'Favicon';
		var img = document.createElement("IMG");
		img.src = ConstructFaviconString(URL);
		FaviconElement.appendChild(img);
		FaviconElement.onclick = function() { OpenNewTab(URL); };
		
		return FaviconElement;
	}

	function ConstructFaviconString(URL)
	{
		URL = URL.replace(/^https?:\/\//,'')
		URL = URL.replace(/^http?:\/\//,'')
		var StringEndIndexPos = 0 ;//position 2 
		StringEndIndexPos = URL.indexOf("/") ; 
		URL = URL.substring(0,StringEndIndexPos);
		var returnVal = "http://www.google.com/s2/favicons?domain="
		returnVal +=  URL;
		return returnVal;
	}

	function URLme()
	{
		var SelectedID;
		if(SelectedCategory == CategoriesEnum.Red)
		{
			 SelectedID = RedID;
		}
		if(SelectedCategory == CategoriesEnum.Green)
		{
			SelectedID = GreenID;
		}
		if(SelectedCategory == CategoriesEnum.Blue)
		{
			SelectedID = BlueID;
		}
		if(SelectedCategory == CategoriesEnum.Orange)
		{
			SelectedID = OrangeID;
		}
	
		chrome.bookmarks.getChildren(SelectedID,function(bookmarks) 
		{
			var Length = bookmarks.length;
			Length--;
			var RandomIndex = Math.floor((Math.random()*Length)+0);
			OpenNewTab(bookmarks[RandomIndex].url);
			//This should be configurable
			DeleteBookmark(bookmarks[RandomIndex].id);
		})
	}
	
	

	function StoreIt()
	{
		if(SelectedCategory == CategoriesEnum.Red)
		{
			StoreTabToID(RedID)
		}
		if(SelectedCategory == CategoriesEnum.Green)
		{
			StoreTabToID(GreenID)
		}
		if(SelectedCategory == CategoriesEnum.Blue)
		{
			StoreTabToID(BlueID)
		}
		if(SelectedCategory == CategoriesEnum.Orange)
		{
			StoreTabToID(OrangeID)
		}
	}
	
	//Todo rename
	function StoreTabToID(ID)
	{
		chrome.tabs.getSelected(null,function(CurrentTab)
		{
			chrome.bookmarks.create({parentId: ID, title: CurrentTab.title, url: CurrentTab.url}, function(){ConstructBookmarks();});
			
		});
	}
	
	function OpenNewTab(URL)
	{
		chrome.tabs.create({url: URL});
	}




	function Init()
	{
		CategoriesEnum = Object.freeze({"Red":0, "Green":1, "Blue":2, "Orange":3});
		SelectedCategory = CategoriesEnum.Red;
		DefineButtonFunctionalities();
		InitBookMarkFolders();
	}

	document.addEventListener('DOMContentLoaded', 
		function () 
		{
			Init();	
		}
	);
