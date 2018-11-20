

            var global_datas;
            d3.json("json_datas/nodes_edges.json", function(data) {
                //console.log('read',data);
                //因为d3.json是异步调用，所以必须在异步获取数据里做 visiualize
                new_data = generate_nodes_edges(data.nodes);
                new_data.edges = data.edges;
                global_datas = new_data;
                localStorage.setItem("global_datas",JSON.stringify(global_datas)); //存入 参数： 1.调用的值 2.所要存入的数据 
                visiual(new_data);
                
               
            });

            function generate_nodes_edges(datas){
                var nodes = [];
                for (i in datas){
                    for (var key in datas[i]) {
                        nodes.push({name:key})
                        // for (var k in data[0][key]["keywords"]){
                        //     console.log(k)
                        // }
                    }
                }
                // var edges = [];
                // for(var j=0 ;j<nodes.length; j++){
                //         edges.push({
                //             "source":Math.ceil(Math.random() * (nodes.length - 1) ),
                //             "target":Math.ceil(Math.random() * (nodes.length - 1) ),
                //         })
                // }
                //console.log(nodes,edges)
                
                return {
                    "nodes":nodes,
                    "edges":{},
                }

            };
                //调用visiual函数
            function visiual(data){
                //console.log('x',data)
                //获取var and nodes
                var nodes =data.nodes;
                var edges =data.edges;
                var offset = "translate(10,-100)"
                var body =d3.selectAll("body")
                var width = 1100;
                var height = 1080;
                var svg = body.append("svg")
                    .attr("width",1100)
                    .attr("height",1000)

                //console.log(nodes,edges, )//nodes.length,edges.length)
                var force = d3.layout.force()
                    .nodes(nodes) //指定节点数组
                    .links(edges) //指定连线数组
                    .size([width,height]) //指定作用域范围
                    .linkDistance(60) //指定连线长度
                    .charge([-400]); //相互之间的作用力;
                    force.start();

                //添加连线
                var svg_edges = svg.selectAll("line")
                    .data(edges)
                    .enter()
                    .append("line")
                    .attr("pointer-events","none")
                    .attr("class","Edge")
                    .attr("transform",offset)
                    // .style("stroke","#ccc")
                    // .style("stroke-width",1)

                var color = d3.scale.category20();

                //添加节点
                var svg_nodes = svg.selectAll("circle")
                    .data(nodes)
                    .enter()
                    .append("circle")
                    .attr("transform",offset)
                    //.attr("r",5)
                    .attr("r", function(d) {
                        var minRadius = 5;
                        return minRadius + (d.weight*0.2);
                      })
                    .style("fill",function(d,i){
                        return color(i);
                    })
                    .on("mouseover",function(d){mouseover_node(d);})
                    .on("mouseout", function(d){mouseout_node(d);})
                    .call(force.drag);  //使得节点能够拖动

                //添加描述节点的文字
                var svg_texts = svg.selectAll("text")
                    .data(nodes)
                    .enter()
                    .append("text")
                    .attr("pointer-events","none")
                    .attr("transform",offset)
                    .style("fill", "black")
                    .attr("dx", 20)
                    .attr("dy", 8)
                    .attr("font-size","7px")
                    .text(function(d){
                        return d.name;
                    });

                force.on("tick", function(){ //对于每一个时间间隔
                    //更新连线坐标
                    svg_edges.attr("x1",function(d){ return d.source.x; })
                        .attr("y1",function(d){ return d.source.y; })
                        .attr("x2",function(d){ return d.target.x; })
                        .attr("y2",function(d){ return d.target.y; });

                    //更新节点坐标
                    svg_nodes.attr("cx",function(d){ return d.x; })
                        .attr("cy",function(d){ return d.y; });

                    //更新文字坐标
                    svg_texts.attr("x", function(d){ return d.x; })
                        .attr("y", function(d){ return d.y; });
                });



                var mouseout_node = function(z){
                    svg_edges.style("stroke-opacity", 0.2);
                    svg_nodes.style("stroke-width", 1)
                        // .attr("r",5)
                        .attr("r", function(d) {
                            var minRadius = 5;
                            return minRadius + (d.weight*0.2);
                          })
                    svg_texts.attr("font-size", 10)
                        .style("fill-opacity", 1)
                };

                var mouseover_node = function(z){
                    var neighbors = {};
                    neighbors[z.index] = true;
                    svg_edges.filter(function(d){
                        if (d.source == z) {
                            neighbors[d.target.index] = true
                            return true
                        } else if (d.target == z) {
                            neighbors[d.source.index] = true
                            return true
                        } else {
                            return false
                        }
                    })
                        .style("stroke-opacity", 1);

                    svg_nodes.filter(function(d){ return neighbors[d.index] })
                        .style("stroke-width", 3)
                        .attr("r" ,Math.ceil(Math.random() * 10+10));

                    svg_texts.filter(function(d){ return !neighbors[d.index] })
                        .style("fill-opacity", 0.2);

                    svg_texts.filter(function(d){ return neighbors[d.index] })
                        .attr("font-size", "30px")

                };

            }
            var text_id = 0 ;
            //需要jquery动态添加 http://www.w3school.com.cn/jquery/event_delegate.asp
            $("#searchWrapper").delegate("#mytable","click",function(){
                console.log($(this).text())
                //var txt1="<li>Text.sdasdas"; 
                var txt1 = "<div id= 'text_id' > <input type='text' onkeydown='getKey(this)'> <input type='button' value='save and close' index=‘text_id’ onclick='deleteText(this)'></div>";    
                
                console.log("aaaaaaa",this.childNodes.length)//nodeName)
                //onclick='update_1'
                if (this.childNodes.length == 1){
                    $(this).append(txt1);
                    update_1($(this).text())
                }

            })
            function getKey(e){
                if(event.keyCode==13){
                    //save info 
                    console.log($(e).val())
                    alert( $(e).val() + ' save done');
                }   
            }
            
            
            function deleteText(e){
                var child=document.getElementById("text_id");
                //save sth
                
                //因为是动态添加的元素所以需要通过父节点来删除，不能直接通过$($(e)prev[0]).remove
                getKey();
                //save info
                console.log($($(e).prev()[0]).val())
                $(e).parent().remove()
                alert( $(e).val() + ' save done');
                //$(e).remove()
                //$($(e).prev()[0]).empty()
                //$(e).hide()
                //$(e).prev().hide()

                //child.parentNode.removeChild(child);
            }
            
            // var ta = d3.select("#searchWrapper")
            // console.log(ta)
            // var lii 
            // ta.on("click",function(d,i){
            //     $("#mytable").hide()
            //     console.log("dasdas")   
            //     lii = ta.selectAll("#table") 
            //     // d3.select(this)
            //     //     .text("abcd")
            //     }
            // )
            
