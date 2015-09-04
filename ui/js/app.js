var app = (function (nx, ajaxUtil, datatableUtil, host) {
    var headers = [];
    var tableRows = [];
    var colMin = 1;
    var colMax = 10;
    var baseApiUrl = "https://sandboxapic.cisco.com/api/v0/";
    var root = 'host';
    var backUrl = "";


    return {

        init: function () {
            document.getElementById("host-header").style.visibility = 'hidden';
            $(".menuitem").on("click", function (event) {
                event.preventDefault();
                var module = $(this).attr("href");
                if (module == "host") {
                    document.getElementById("tableHolder").style.marginTop = "0px";
                    document.getElementById("host-header").style.visibility = 'visible';
                }
                else {
                    document.getElementById("host-header").style.visibility = 'hidden';
                    document.getElementById("tableHolder").style.marginTop = "-50px";
                }
                document.getElementById("networkHost").innerHTML = stringUtil.camelCaseToHumanReadable(module);
                datatableUtil.showList(module)

            });
            Handlebars.registerHelper('ifCond', function (v1, v2, options) {
                if (v1 === v2) {
                    return options.fn(this);
                }
                return options.inverse(this);
            });
            ajaxUtil.getCounts();
            host.showPhysicalTopology();
        }

    }

})(nx, ajaxUtil, datatableUtil, host);