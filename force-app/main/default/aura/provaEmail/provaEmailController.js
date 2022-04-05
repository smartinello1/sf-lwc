({
  init: function (component, event, helper) {
    component.set("v.url", "/lightning/o/User/list?filterName=Recent");
    component.set("v.url2", "/lightning/o/Opportunity/list?filterName=Recent");
    var url = component.get("v.url");
    var url2 = component.get("v.url2");
    console.log("url " + url);
    console.log("url2 " + url2);
  }
});