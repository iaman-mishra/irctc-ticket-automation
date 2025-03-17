let user_data = {};

function fillVPA() {
    function updateTextChange(elem, value) {
        elem.dispatchEvent(new Event('keydown', {
            bubbles: true
        }));
        elem.value = value;
        elem.dispatchEvent(new Event('keyup', {
            bubbles: true
        }));
        elem.dispatchEvent(new Event('input', {
            bubbles: true
        }));
        elem.dispatchEvent(new Event('change', {
            bubbles: true
        }));
    }
    console.log('Fill paytm VPA');
    document.getElementById('ptm-upi').getElementsByTagName('div')[1].getElementsByTagName('div')[0].click();
    console.log('Fill paytm VPA-after click');
    var tt = setInterval(function() {
        if (document.getElementsByName('upiMode').length > 0) {
            clearInterval(tt);
            var tt2 = setInterval(function() {
                var elem = document.getElementsByName('upiMode')[0].parentNode.parentNode.parentNode.getElementsByTagName('input')[1];
                if (elem != null) {
                    clearInterval(tt2);
                    updateTextChange(elem, user_data["vpa"]["vpa"]);
                    setTimeout(function() {
                        document.getElementsByClassName('btn-primary')[1].click();
                    }, 500);
                }
            }, 100);
        }
    }, 500);
}



chrome.storage.local.get(null, (result) => {
    user_data = result;

   if ( user_data["other_preferences"]["paymentmethod"] == "UPIID")

    {

	if (document.readyState !== 'loading') {
		fillVPA();
		
	} else {
			document.addEventListener('DOMContentLoaded', function () {
                fillVPA();
		});
	}
    }

  });