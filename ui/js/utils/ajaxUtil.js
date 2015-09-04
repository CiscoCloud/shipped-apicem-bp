var ajaxUtil = (function () {

    var baseApiUrl = "https://sandboxapic.cisco.com/api/v0/";
    var root = 'host';
    var countConfig = [
        {url: 'host', elemId: 'hostCount'}, {url: 'network-device', elemId: 'networkDeviceCount'},
        {url: 'link', elemId: 'linkCount'}, {url: 'location', elemId: 'locationCount'},
        {url: 'application', elemId: 'applicationCount'}, {url: 'category', elemId: 'categoryCount'},
        {url: 'policy', elemId: 'policyCount'}];


    var get = function (url, async, successcallback, errorcallback) {
        $.ajax({
            url: baseApiUrl + url,
            type: "GET",
            async: async || true,
            context: document.body,
            success: function (data) {
                successcallback(data);
            },
            error: function (errorData) {
                errorcallback(errorData);
            }
        });
    };
    var getCount = function (url, type, async, elementId) {

        get(url, async, function (data) {
            $("#" + elementId).html(data.response);
        });
    };

    var getCounts = function () {
        countConfig.forEach(function (config) {
            getCount(config.url + '/count', 'GET', true, config.elemId);
        });
    };
    var getData = function (module, successcallback) {
        $.ajax({
            url: baseApiUrl + module,
            type: "GET",
            async: false,
            context: document.body,
            success: function (data) {
                successcallback(data);
            },
            error: function (errorData) {

            }
        });

    }


    return {
        get: get,
        getCounts: getCounts,
        getData: getData
    }

})();

var datatableUtil = (function (ajaxUtil) {
    var list = [];
    var showList = function (module) {
        ajaxUtil.getData(module, successcallback);

        function successcallback(data) {
            list = data.response;
            var config = modulesConfig[module];
            setTable(data, config);
            $('.nav-tabs a[href="#host"]').tab('show');
            if (module === "host") {
                var dropdownList = [];
                _.each(list, function (item, index) {
                    dropdownList.push({id: index, text: item.hostIp});
                })
                setTopoDropDown(dropdownList);
                ;
            }
            $('a.detaillink').click(function (e) {
                e.preventDefault();
                var id = $(this).attr('id');
                if (list.length > 0) {
                    var item = _.findWhere(list, {id: id});
                    var source = $("#detailtable").html();
                    var template = Handlebars.compile(source);
                    $("#detailHolder").html(template(item));
                    $('#detailModal').modal('show');
                }
            })
        }

    };

    //refactor use Immutable Data structures,reduce mutations
    var setTable = function (data, config) {
        var tableObj = {};
        //var cols= _.union(_.difference(config.columns,['id']),['View More']);
        tableObj.columns = config.columns;
        console.log(tableObj.columns);
        var rows = (data.response).map(function (item) {
            // var obj = _.pick(item, tableObj.columns);
            // //console.log(obj);
            // var reorderedValues = _.union(_.filter(_.values(obj), function (prop, index) {
            //     return index != 0;
            // }), [_.values(obj)[0]]);
            // //console.log(reorderedValues);

            // return _.object(tableObj.columns, reorderedValues);

           return _.pick(item, tableObj.columns);

        });

        var cols = _.union(_.difference(config.columns, ['id']), ['']);
        tableObj.columns = cols.map(function (column) {
           return  column.replace(/([A-Z])/g, ' $1')
                .replace(/^./, function (str) {
                    return str.toUpperCase();
                });

        });

        rows = rows.map(function (row) {

            var reorderedKeys = _.difference(_.keys(row), ['id']);
            reorderedKeys.push('id');
            return _.object(reorderedKeys, _.values(row));

        });
        tableObj.rows = rows;
        var source = $("#maintable").html();
        var template = Handlebars.compile(source);
        $("#tableHolder").html(template(tableObj));

    }
    var setTopoDropDown = function (list) {
        var source = $("#dropdownId").html();
        var template = Handlebars.compile(source);
        $("#sourceDD").html("<option>--Source--</option>" + template(list));
        $("#targetDD").html("<option>--Destination--</option>" + template(list));

    }


    var modulesConfig = {

        "host": {
            "columns": [ "hostMac", "hostIp", "hostType", "connectedInterfaceName", "vlanId", "numUpdates", "userStatus","id"]
        },
        "network-device": {
            "columns": [ "hostname", "macAddress", "type", "vendor", "family", "numUpdates","id"]
        }, "link": {
            "columns": [ "startDeviceId", "startPortId", "endDeviceId", "endPortId", "linkStatus", "endDeviceHostName","id"]
        }, "location": {
            "columns": [ "civicAddress", "geographicalAddress", "description", "locationName","id"]
        }, "application": {
            "columns": [ "applicationGroup", "category", "subCategory", "name", "references", "appProtocol","id"]
        }, "category": {
            "columns": [ "name","id"]
        }, "policy": {
            "columns": ["policyName", "policyOwner", "state", "taskId","id"]
        }
    }

    return {
        showList: showList
    }


})(ajaxUtil);