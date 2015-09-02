
var ajaxUtil = (function(){

    var baseApiUrl = "https://sandboxapic.cisco.com/api/v0/";
    var root = 'host';
    var countConfig = [
        {url: 'host', elemId: 'hostCount'}, {url: 'network-device', elemId: 'networkDeviceCount'},
        {url: 'link', elemId: 'linkCount'}, {url: 'location', elemId: 'locationCount'},
        {url: 'application', elemId: 'applicationCount'}, {url: 'category', elemId: 'categoryCount'},
        {url: 'policy', elemId: 'policyCount'}];


    var get = function(url,async,successcallback,errorcallback){
        $.ajax({
            url:baseApiUrl+url,
            type: "GET",
            async:async||false,
            context: document.body,
            success:function(data){
                successcallback(data);
            },
            error:function(errorData){
                errorcallback(errorData);
            }
        });
    };
    var getCount = function(url,type,async,elementId){

        get(url,async,function(data){
            $("#"+elementId).html(data.response);
        });
    };

    var getCounts = function (){
        countConfig.forEach(function (config) {
            getCount( config.url + '/count', 'GET', true, config.elemId);
        });
    };
    var getData = function(module,successcallback){
        $.ajax({
            url: baseApiUrl+module,
            type: "GET",
            async:false,
            context: document.body,
            success:function(data){
                successcallback(data);
            },
            error:function(errorData){

            }
        });

    }


     return {
         get : get,
         getCounts :getCounts,
         getData : getData
     }

})();

var datatableUtil  =(function(ajaxUtil){
    var list = [];
    var showList =  function(module){
         ajaxUtil.getData(module,successcallback);

       function successcallback(data){
           list = data.response;
           var config = modulesConfig[module];
           setTable(data,config);
           $('.nav-tabs a[href="#host"]').tab('show');
           if(module === "host"){
               var dropdownList = [];
               _.each(list,function(item,index){
                   dropdownList.push({id:index,text:item.hostIp});
               })
               setTopoDropDown(dropdownList);;
           }
           $('a.detaillink').click(function(e){
               e.preventDefault();
               var id = $(this).attr('id');

               if(list.length>0){
                   var item = _.findWhere(list,{id:id});
                   var source   = $("#detailtable").html();
                   var template = Handlebars.compile(source);
                   $("#detailHolder").html(template(item));
                   $('#detailModal').modal('show');
               }
           })
       }

    };

    var setTable = function (data,config) {
        var tableObj={};
        tableObj.columns = config.columns;
        var rows = [];
        _.each(data.response,function(item){
            var obj = _.pick(item,tableObj.columns);
            rows.push(obj);
        });
        tableObj.rows = rows;
        var source   = $("#maintable").html();
        var template = Handlebars.compile(source);
        $("#tableHolder").html(template(tableObj));

    }
    var setTopoDropDown = function (list) {
          var source   = $("#dropdownId").html();
          var template = Handlebars.compile(source);
          $("#sourceDD").html("<option>--Source--</option>"+template(list));
          $("#targetDD").html("<option>--Destination--</option>"+template(list));

    }


    var modulesConfig ={

        "host":{
             "columns":["id", "hostMac", "hostIp", "hostType", "connectedInterfaceName", "vlanId", "numUpdates", "userStatus"]
        },
        "network-device":{
            "columns":["id", "hostname",  "macAddress", "type", "vendor", "family", "numUpdates"]
        },"link":{
            "columns":["id", "startDeviceId", "startPortId", "endDeviceId", "endPortId", "linkStatus",  "endDeviceHostName"]
        },"location":{
            "columns":["id", "civicAddress", "geographicalAddress", "description", "locationName"]
        },"application":{
            "columns":["id", "applicationGroup", "category", "subCategory",  "name", "references","appProtocol"]
        },"category":{
            "columns":["id", "name"]
        },"policy":{
            "columns":["id", "policyName", "policyOwner", "resource", "state", "taskId"]
        }
    }

    return {
        showList : showList
    }


})(ajaxUtil);