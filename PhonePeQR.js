let user_data = {};

GetVpa();

function addDelay(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

let intervalID = "";
function DataHandler() {
	
	    intervalID = setInterval(function(){
		if(!IsInPrograss())
		{
			document.querySelector('button').click();		
		}
		},200);
}

function IsInPrograss()
{
	if(document.querySelector('button'))
	{
		console.log("Show QR button found.");
		clearInterval(intervalID);
		return false;
	}
	return true;
}

function GetVpa()
{
	console.log("GetVpa");
  chrome.storage.local.get(null, (result) => {
    user_data = result;


	if (document.readyState !== 'loading') {
		DataHandler();
		
	} else {
			document.addEventListener('DOMContentLoaded', function () {
			DataHandler();
		});
	}

  });
  
}