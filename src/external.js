(function(){
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

  var doc = document;
  var element = doc.createElement("script");
  element.async = 1;
  element.src = "https://embed.tweeker.io/" + params.embedVersion + ".js";
  var script = doc.getElementsByTagName("script")[0];
  script.parentNode.insertBefore(element, script);
})();