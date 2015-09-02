var app = (function(nx,ajaxUtil,datatableUtil,host){
    var headers = [];
    var tableRows = [];
    var colMin = 1;
    var colMax = 10;
    var baseApiUrl = "https://sandboxapic.cisco.com/api/v0/";
    var root = 'host';
    var backUrl = "";


    return{

        init: function() {
            $(".menuitem").on("click", function(event) {
                event.preventDefault();
                var module = $(this).attr("href");
                datatableUtil.showList(module)

            });
            Handlebars.registerHelper('ifCond', function(v1, v2, options) {
                if(v1 === v2) {
                    return options.fn(this);
                }
                return options.inverse(this);
            });
            ajaxUtil.getCounts();
            host.showPhysicalTopology();
        }

    }

})(nx,ajaxUtil,datatableUtil,host);