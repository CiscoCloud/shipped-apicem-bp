var topoconfig = (function(nx, global) {

     function nodeconfig(topologyData){
        nx.define('Base.NodeConfig', nx.ui.Component, {
            properties: {
                icon: {
                    value: function() {
                        return function(vertex) {
                           var type = vertex.get("nodeType");
						if(type=="host")
						{
							return "host"
						}
						else{
						return vertex.get("deviceType");
						}
                        }
                    }
                }
            },
            view: {
                content: {
                    name: 'topo',
                    type: 'nx.graphic.Topology',
                    props: {
                        adaptive: true,
                        identityKey:'id',
                        width: 600,
                    	height: 600,
                        nodeConfig: {
                            label: function(vertex) {
                                return vertex.get("label");
                            },
                            iconType: '{#icon}'
                        },
 			linkConfig: {
                     	   linkType: 'curve'
                    	},
                        nodeSetConfig: {
                            iconType: 'model.deice_type'
                        },
                        showIcon: true,
                        data: topologyData
                    }
                }
            }
        });
        return new Base.NodeConfig();
    }

    return{
        nodeconfig:nodeconfig
    }

})(nx, nx.global);

var host = (function(nx,ajaxUtil){

    var host_columns = [];
    var routingParams=[];

    var Shell = nx.define(nx.ui.Application, {
        methods: {
            start: function (topoLogyData) {
                //your application main entry

                var view = topoconfig.nodeconfig(topoLogyData);
                view.attach(this);
                // initialize a topology


            },
            getContainer: function() {
                return new nx.dom.Element(document.getElementById('topo-container'));
            }
        }
    });


    var shell=new Shell();

    var updateSourceDestination= function (){

        var condition=(routingParams.length==0);
        var source=(condition)?'?':routingParams[0];
        var destination=(condition)?'?':routingParams[1];
        $("#source").text(source);
        $("#destination").text(destination);
    };
    function clearRoutingParams() {
        app.clearRoutingParams();
        app.updateSourceDestination();
    }


    var getTopologyUrl = function(source,destination){
        if(source === destination){
            alert('Source and Destination are same,please change it.');
            return false;
        }
        else
        {
            return 'routing-path/'+source+'/'+destination;
        }


    };
    var showTopology = function(source,destination){

        var url = getTopologyUrl(source,destination);
        getTopology(url);
    };

    var showPhysicalTopology = function(){
        var url = "topology/physical-topology";
        getTopology(url);
    }

    var getTopology = function(url){

        ajaxUtil.get(url,false,successCallBack);

        function successCallBack(data){
            $('#topo-container').html("");
            $('.nav-tabs a[href="#topology"]').tab('show')
            try {
                if(_.isObject(data.response)){
                    var topologyData=data.response;
                }
                if(_.isArray(data.response)){
                    var topologyData=data.response[0];
                }
                topoconfig.nodeconfig(topologyData);
                console.log(JSON.stringify(topologyData));
                shell.start(topologyData);

            }
            catch(ex){
                console.log(ex);
                console.log('error while rendering topology');
                console.log('using sample data');
                shell.start(topologyData);
            }
        }

    };

    return {
        showTopology : showTopology,
        showPhysicalTopology : showPhysicalTopology
    }

}(nx,ajaxUtil));
