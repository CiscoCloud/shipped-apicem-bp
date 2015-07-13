var app = (function(){
    var headers = [];
    var tableRows = [];
    var colMin = 1;
    var colMax = 10;
    var createTableData = function(data){
        $.each(data,function(key,val){
            tableRows.push(data[key]);
        });

    };
    var createHeaders = function(data){
        $.each(data,function(key,val){
            headers.push(key);
        });
    };


    return{

        callService : function(url,type,async){
            $.ajax({
                url: url,
                type: type||"GET",
                async:async||false,
                context: document.body,
                success:function(data){
                 createHeaders(data.response[0]);
                 createTableData(data.response);

                },
                error:function(errorData){

                }
            });

        },
        createTable : function(elId){
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

                            var td = '<td>' + tableRows[k][j] + '</td>';
                            tr = tr + td;

                    }
                    tr = tr + "</tr>"
                }
                tbody.append(tr);
            }


        }
    }

})();