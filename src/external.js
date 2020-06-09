var currentScript = document.currentScript;
var search = currentScript.src.split('?')[1];

var params = {
  businessId: null,
  embedVersion: "latest",
};

var paramString = search.split('&')
for (i = 0; i < paramString.length; i++) {
  var param = paramString[i].split('=');
  params[param[0]] = param[1];
};

if (!params.businessId) {
  throw new Error("You must include a businessId as a query param.");
};

window.TweekerSettings = {
  businessId: params.businessId,
};

(function(){
  var d = document;
  var i = d.createElement("script");
  i.async = 1;
  i.src = "https://embed.tweeker.io/" + params.embedVersion + ".js";
  var e = d.getElementsByTagName("script")[0];e.parentNode.insertBefore(i, e);
})();