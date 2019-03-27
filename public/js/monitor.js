$(function () {
    var cpu_data = anychart.data.set([
        ['CPU usage', 0],
        ['CPU idle', 1]
    ]);
    var cpu_view = cpu_data.mapAs();
    anychart.onDocumentReady(function () {
        // create data set
    
        // create pie chart with passed data
        var chart = anychart.pie(cpu_data);
    
        // set chart radius
        chart.innerRadius('45%')
            // set value for the exploded slices
            .explode(5);
    
        // create standalone label and set settings
        var label = anychart.standalones.label();
        label.enabled(true)
            .text('')
            .width('100%')
            .height('100%')
            .adjustFontSize(true, true)
            .minFontSize(10)
            .maxFontSize(25)
            .fontColor('#60727b')
            .position('center')
            .anchor('center')
            .hAlign('center')
            .vAlign('middle');
    
        // set label to center content of chart
        chart.center().content(label);
    
        // create range color palette with color ranged
        var palette = anychart.palettes.rangeColors();
        palette.items([
            {color: '#c26364'},
            {color: '#dba869'}
        ]);
        // set chart palette
        chart.palette(palette);
    
        // set hovered settings
        chart.hovered()
            .fill('#6f3448');
    
        // set selected settings
        chart.selected()
            .fill('#ff6e40');
    
        // set hovered outline settings
        chart.hovered().outline()
            .fill(function () {
                return anychart.color.lighten('#6f3448', 0.55);
            });
    
        // set selected outline settings
        chart.selected().outline()
            .offset(5)
            .fill(function () {
                return anychart.color.lighten('#ff6e40', 0.25);
            });
    
        // set container id for the chart
        chart.container('cpu-container');
        // initiate chart drawing
        chart.draw();
    });



    
    function emit() {
        socket.emit('monitor-get', 0);
    }
    socket = io.connect('http://localhost:3000/monitor');
    socket.on('connect', function (data) {
        socket.emit('monitor-get', 0);
    });

    function addRow(col = [], name) {
        if (!document.getElementsByTagName) return;
        let tabBody = document.getElementById(name)
        let row = document.createElement("tr");
        col.forEach(element => {
            let cell = document.createElement("td");
            let text = document.createTextNode(element);
            cell.appendChild(text);
            row.appendChild(cell);
        });

        //cell_id = document.createElement("td");
        //cell_ip = document.createElement("td");
        // text_id = document.createTextNode(id);
        // text_ip = document.createTextNode(ip);
        // cell_id.appendChild(text_id);
        // cell_ip.appendChild(text_ip);

        // row.appendChild(cell_id);
        // row.appendChild(cell_ip);
        //row.appendChild(button_div);
        tabBody.appendChild(row);
    }
    function refreshList(list, id_, arg = undefined) {
        tabBody = document.getElementById(id_)
        tabBody.innerHTML = "";
        for (let p in list) {
            if (list[p] != undefined) {
                let to_data = [];
                for(let name in list[p]){
                    if(arg != undefined){
                        if(arg[name] != undefined){
                            to_data.push(list[p][name])
                        }
                    }else{
                        to_data.push(list[p][name])
                    }
                    // let id = list[p].id ? list[p].id : "null";
                    // let ip = list[p].ip ? list[p].ip : "null";
                }
                addRow(to_data, id_)
            }
        }
        $("#" + id_).trigger("updateAll", [true, () => {}]);
    }

    $('[name="backup"]').click(function () {
        socket.emit('backup-blockchain', true);
    });



    socket.on('message', function (message) {
        let backup = [];
        message.backup.forEach(element => {
            var date = new Date(parseInt(element));
            backup.push({id:element,name:"Block-chain", date:date.toSQL() })
        });
        refreshList(message.connections, "main-table-data");
        refreshList(message.block, "block-table-data", {index:true, previousHash:true});
        refreshList(backup, "backup-table-data");
        //let value = Math.floor(message.load * 100);
        cpu_view.set(
            0,
            "value",
            message.load
        );
        cpu_view.set(
            1,
            "value",
            100 - message.load
        );

        setTimeout(emit, 2 * 1000)

    });
    $("#backup-table")
    .on('click', 'tbody tr', function(){
        // closest finds the row, .eq(0) finds the first cell
        if(confirm("Are you sure want to apply data?")){
            var id = $(this).closest('tr').children().eq(0).text();
            socket.emit('set-blockchain', {id:id});
        }
    })
    .tablesorter({
        widthFixed: false,
        widgets: ['zebra']
    });
    $("#block-table")
        .tablesorter({
            widthFixed: false,
            widgets: ['zebra']
        });
    $("#main-table")
        .tablesorter({
            widthFixed: false,
            widgets: ['zebra'],
        });
});
