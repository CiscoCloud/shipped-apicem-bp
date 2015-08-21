var app = (function(){
    var headers = [];
    var tableRows = [];
    var colMin = 1;
    var colMax = 10;
    var baseApiUrl = "https://sandboxapic.cisco.com/api/v0/";
    var root = 'host';
    var backUrl = "";
    var createTableData = function(data){
        tableRows = [];
        if (data[0] === undefined) {
            tableRows.push(data);
        }
        else {
            $.each(data,function(key,val){
                tableRows.push(data[key]);
            });
        }
    };
    var createHeaders = function(data){
        headers = [];
        $.each(data,function(key,val){
            headers.push(key);
        });
    };


    return{
		baseApiUrl:baseApiUrl,
        init: function() {
            $(".menuitem").on("click", function(event) {
                root = $(this).attr("href");
                event.preventDefault();
                app.callService(baseApiUrl + root,'GET',false);
                app.createTable("table1");
            });
            $("body").on("click","a.child", function(event){
                backUrl = baseApiUrl + root;
                $("#backUrl").attr("href",backUrl).show();
                event.preventDefault();
                app.callService($(this).attr("href"),'GET',false);
                app.createTableDescription("table1");
            });
            $("div").on("click","#backUrl", function(event){
                event.preventDefault();
                app.callService($(this).attr("href"),'GET',false);
                app.createTable("table1");
                $(this).hide();
            });
        },
        callService : function(url,type,async){
            $.ajax({
                url: url,
                type: type||"GET",
                async:async||false,
                context: document.body,
                success:function(data){
                 createHeaders(data.response[0] !== undefined ? data.response[0] : data.response);
                 createTableData(data.response);

                },
                error:function(errorData){

                }
            });

        },
        getCount : function(url,type,async,elementId){
            $.ajax({
                url: url,
                type: type||"GET",
                async:async||false,
                context: document.body,
                success:function(data){
                    $("#"+elementId).html(data.response);
                }
            });
        },
        createTable : function(elId){
            $("#"+elId).find('thead').empty();
            $("#"+elId).find('tbody').empty();
            $("#"+elId).find('tfoot').empty();
            var head = $('#'+elId).find('thead');
            var tbody = $('#'+elId).find('tbody');
            var cols = '<tr>';
            for(var i in headers ){

                    var th = '<th>' + headers[i] + '</th>';
                    cols = cols + th;

            }
            cols = cols + "</tr>";
            head.append(cols);

            for(var k in tableRows ) {

                var tr = '<tr>';
                if (typeof  tableRows[k] === 'object'){
                    for (var j in tableRows[k]) {
                        if (j == "id") {
                            var td = '<td><a class="child" href="'+baseApiUrl+root+"/"+tableRows[k][j]+'">' + tableRows[k][j] + '</a></td>';
                            tr = tr + td;
                        } else {
                            var td = '<td>' + tableRows[k][j] + '</td>';
                            tr = tr + td;
                        }
                    }
                    tr = tr + "</tr>"
                }
                tbody.append(tr);
            }
        },
        createTableDescription : function(elId){
            $("#"+elId).find('thead').empty();
            $("#"+elId).find('tbody').empty();
            $("#"+elId).find('tfoot').empty();
            var head = $('#'+elId).find('thead');
            var tbody = $('#'+elId).find('tbody');
            var cols = '';
            var array = $.map(tableRows[0], function(value, index) {
                return [value];
            });
            for(var i in headers) {
                cols += '<tr>';
                var td = '<td>' + headers[i] + '</td>';
                cols = cols + td;
                td = '<td>' + array[i] + '</td>';
                cols = cols + td;
                cols = cols + "</tr>";
            }
            head.append(cols);
            /*for(var i in headers ){

                var th = '<th>' + headers[i] + '</th>';
                cols = cols + th;

            }
            cols = cols + "</tr>";
            head.append(cols);

            for(var k in tableRows ) {
                var tr = '<tr>';
                if (typeof  tableRows[k] === 'object') {
                    for (var j in tableRows[k]) {
                        if (j == "id") {
                            var td = '<td><a class="child" href="' + baseApiUrl + root + "/" + tableRows[k][j] + '">' + tableRows[k][j] + '</a></td>';
                            tr = tr + td;
                        } else {
                            var td = '<td>' + tableRows[k][j] + '</td>';
                            tr = tr + td;
                        }
                    }
                    tr = tr + "</tr>"
                }
                tbody.append(tr);
            }*/
        }
    }

})();