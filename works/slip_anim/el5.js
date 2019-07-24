/**
 * 
 * @param {*} content 容器
 * @param {*} img_arr 需要显示的图片数组
 */
function init_el_wrap(content,img_arr,aspect){
    let bound_obj = content.getBoundingClientRect() // 容器坐标对象
    let content_width = bound_obj.width             // 容器宽高
    let content_height = bound_obj.height
    let content_top = bound_obj.top
    let content_left = bound_obj.left

    // let k = 1/5 // 10
    let k = 1/10
    // let k = 1/7
    let w = 3
    let sub_content_count = 300                     // 子容器的数量
    // let sub_content_count = 147
    let show_img_list = mixin_img_arr(img_arr,sub_content_count)
    let sub_content_space = content_width/5 * k                      // 子容器之间的间隔
    let sub_content_width = ( content_width - sub_content_space/k ) * k       // 子容器宽度
    let sub_content_height = sub_content_width * aspect//( content_height -sub_content_space/k ) * k     // 子容器高度
                                                    // 子容器的对角线半径
    let sub_content_radius = 4*Math.sqrt(Math.pow(sub_content_height/2,2) + Math.pow(sub_content_width/2,2))
    let content_center = {                          // 容器中心位置 ( 相对于三维偏移 )
        x : 3 * (content_width / 2 ) - sub_content_width / 2,
        y : content_height / 2 + sub_content_height / 2
    }
    let sub_content_left =  0     // 子容器横向排放的其实坐标做边界
    let sub_content_right = 3 * content_width
    let rect_animate_timer                      // 横向运动的timer
    let circle_sub_animate_timer                // 环绕运动的timer
    let involved_sub_list = []                  // 当前受到影响的子容器列表
    let content_perspective = 500
    content.style.position = "relative"
    content.style.perspective = content_perspective + "px"
    content.style.transformStyle = "preserve-3d"
    content.style.webkitTransformStyle = "preserve-3d"
    content.style.overflow = "hidden";
    
    // content.style.border = "1px solid red"
    let content_wrap = document.createElement("div")
    let content_wrap_left = content_left - content_width
    content_wrap.style.width = content_width * 3 + "px"
    content_wrap.style.height = content_height + "px"
    content_wrap.style.position = "absolute"
    content_wrap.style.top = "0px"
    content_wrap.style.left = `-${ content_width }px`
    // content_wrap.style.border = "1px solid blue"
    content.appendChild(content_wrap)

    let rect_anim_position = []                     // 横向动画时的子对象的坐标信息 ( 默认子元素的坐标信息 )

    // ----------- new
        let selected_sub_content = { // 当前处于选中状态的子容器的信息对象
            isEmpty:true
        }            

    // -----------



    fill_content()                  // 默认先填充子容器
    
    function fill_content(){        // 填充子容器
        let row_len = w/k           // 每一行能排放几个子容器
        let row = 0                 // 当前子容器排放到第几行
        let count = 0               // 当前行已经排放几个子容器
        let index = 0               // 记录当前子容器对象在容器列表中的位置
        
        for(let i = 0;i < sub_content_count;i++){
            
            var sub_item = init_sub_content(show_img_list[i])   // 创建一个子容器
            
            if( count == row_len ){ 
                count = 0
                row++
            }
            let sub_x = count * sub_content_width + count*sub_content_space
            let sub_y = row * sub_content_height + row*sub_content_space
            sub_item.style.left = sub_x + "px"
            sub_item.style.top = sub_y + "px"
            count++
            sub_item._my_index = index  // 为子容器元素添加标记
            index++
            rect_anim_position.push({
                element:sub_item,
                status:"move",  // 表示子容器的状态 ( move : 正常移动 drag : 拖动  )
                x:sub_x,
                y:sub_y,
                z:0
            })
            content_wrap.appendChild(sub_item)
        }
        rect_animate()             // 填充完子容器后默认执行横向动画  
    }
    /**
     *  子容器默认动画 ( 向左边移动 )
     */
    function rect_animate(){        
        rect_anim_position.forEach(function(item){
            // 时刻记录子容器的位置坐标数据
            if(item.element._my_index == selected_sub_content.sub_index){ // 选中的子容器只改变记录数据而不移动
                item.x -= 0.4
                if(item.x < 0){
                    item.x = sub_content_right
                }
                return
            }else{
                  item.x -= 0.4
                if(item.x < 0){
                    item.x = sub_content_right
                }
                item.element.style.zIndex = "0"
                item.element.style.left = item.x + "px"
                item.element.style.top = item.y + "px"
                // item.element.style.transform = "scale(1)"
            }
            if(!selected_sub_content.isEmpty){
                var center = {
                    x : selected_sub_content.x,// + sub_content_width*3/2,
                    y : selected_sub_content.y// + sub_content_height*3/2
                }
                var list = involved_subs(center)
                move_involved_subs(center, list)
               
            }
        })
        rect_animate_timer = requestAnimationFrame(rect_animate)
    }
    /**
     * 
     * @param {Array:Number} img_url
     *  创建默认的子容器
     */
    function init_sub_content(img_url){    // 创建默认子容器对象元素
        let ele = document.createElement('div')
        ele.style.backgroundClip = "content-box"
        ele.style.backgroundImage = `url(${ img_url })`
        // ele.style.backgroundSize = "100% 100%"
        ele.style.backgroundSize = "100% 100%"
        ele.classList.add("sub_content")
        ele.style.display = "inline-block"
        ele.style.position = "absolute"             // 使得所有子容器的偏移中心一致
        ele.style.width = sub_content_width +"px"
        ele.style.height = sub_content_height+"px"
        ele.style.cursor = "pointer"
        ele.style.zIndex = "0"
        // ele.onclick = sub_content_click             // 给每个子容器绑定事件监听
        ele.onmousedown = sub_content_click

        ele.ontouchstart = sub_content_touch

        // ele.onmouseenter = function(){
        //     ele.style.transform = "scale(1.2)"
        //     ele.onmouseout = function(){
        //         ele.style.transform = "scale(1)"
        //     }
        // }
        return ele
    }
    /**
     * 
     * @param {*} e
     * 每个子容器绑定的事件监听 
     */
    function sub_content_click(down_e){
        var isDrag = false                                      // 默认用户的操作是点击 ( 选择 )
        var current_sub_content = down_e.target                 // 当前的子容器目标
        var current_sub_content_bound = current_sub_content.getBoundingClientRect()
        var current_sub_top = current_sub_content_bound.top
        var current_sub_left = current_sub_content_bound.left
        var offset_x = down_e.clientX - current_sub_left    // 子容器放大三倍
        var offset_y = down_e.clientY - current_sub_top
        current_sub_content.style.transform = "scale(3)"        // 当前的子容器目标放大
       
        current_sub_content.onmousemove = function(move_e){
            if(Math.abs(move_e.clientX - down_e.clientX) < 0.01){ return }   // 过滤鼠标轻微抖动导致的移动事件
            isDrag = true                           // 用户当前的操作是拖动
            // console.log('move')
            if(!selected_sub_content.isEmpty){      // 之前有选中的子容器
                if(selected_sub_content.sub_index == current_sub_content._my_index){ // 拖动之前选中子容器
                    selected_sub_content.x = move_e.clientX - content_wrap_left - offset_x/3
                    selected_sub_content.y = move_e.clientY - content_top - offset_y/3
                    current_sub_content.style.left = selected_sub_content.x + "px"
                    current_sub_content.style.top = selected_sub_content.y + "px"

                }else{  // 拖动不同子容器
                    console.log('diff')
                    var last_selected_sub = rect_anim_position[selected_sub_content.sub_index]
                    last_selected_sub.element.style.zIndex = "0"
                    last_selected_sub.element.style.top = last_selected_sub.y + "px"
                    last_selected_sub.element.style.left = last_selected_sub.x + "px"
                    last_selected_sub.element.style.transform = "scale(1)"
                    last_selected_sub.element.style.transition = "0.5s"
                    setTimeout(function(){
                        last_selected_sub.element.style.transition = "0s"
                        last_selected_sub.element.style.transform = "scale(1)"
                        last_selected_sub.element.style.top = last_selected_sub.y + "px"
                        last_selected_sub.element.style.left = last_selected_sub.x + "px"
                    },520)

                    selected_sub_content.sub_index = current_sub_content._my_index
                    selected_sub_content.element = current_sub_content
                    selected_sub_content.x = move_e.clientX - content_wrap_left
                    selected_sub_content.y = move_e.clientY - content_top

                    current_sub_content.style.zIndex = "2"
                    current_sub_content.style.transform = "scale(3)"
                    current_sub_content.style.left = selected_sub_content.x + "px"
                    current_sub_content.style.top = selected_sub_content.y + "px"
                }

            }else{  // 之前没有选中的子容器
                
                selected_sub_content.element = current_sub_content
                selected_sub_content.sub_index = current_sub_content._my_index
                // selected_sub_content.x = move_e.clientX - offset_x
                // selected_sub_content.y = move_e.clientY - offset_y
                selected_sub_content.x = move_e.clientX - content_wrap_left - offset_x
                selected_sub_content.y = move_e.clientY - content_top - offset_y


                current_sub_content.style.zIndex = "2"
                current_sub_content.style.left = selected_sub_content.x + "px"
                current_sub_content.style.top = selected_sub_content.y + "px"
            }
          
        }

        current_sub_content.onmouseup = function(up_e){
            current_sub_content.onmousemove = null
            if(isDrag){ // 用户的操作是拖动
                selected_sub_content.isEmpty = false
                hide_info(selected_sub_content.element)
                selected_sub_content.element = current_sub_content
                selected_sub_content.element.style.transition = "0s"
                
                selected_sub_content.sub_index = current_sub_content._my_index
                
                show_info(current_sub_content,"User Show Message")

            }else{      // 用户额操作是点击 ( 选择 )
                if(selected_sub_content.isEmpty){       // 当前处于选中状态的子容器的信息对象为空

                    selected_sub_content.isEmpty = false
                    selected_sub_content.element = current_sub_content
                    selected_sub_content.sub_index = current_sub_content._my_index
                    selected_sub_content.x = content_center.x
                    selected_sub_content.y = content_center.y

                    current_sub_content.style.top = content_center.y + "px"
                    current_sub_content.style.left = content_center.x + "px "
                    current_sub_content.style.zIndex = "2"
                    current_sub_content.style.transition = "0.5s"
                    setTimeout(function(){
                        current_sub_content.style.transition = "0s"
                        show_info(current_sub_content,"User Show Message")
                    },520)

                }else{                                  // 当前处于选中状态的子容器的信息对象不为空

                    if(selected_sub_content.sub_index == current_sub_content._my_index){    // 用户重复点击上一次点击的子容器
                        selected_sub_content.isEmpty = true // 设置当前处于选中状态的子容器的信息对象为空
                        selected_sub_content.sub_index = -1
                        selected_sub_content.x = ""
                        selected_sub_content.y = ""
                        hide_info(selected_sub_content.element)

                        current_sub_content.style.transform = "scale(1)"
                        current_sub_content.style.transition = "0.5s"
                        current_sub_content.style.left = rect_anim_position[current_sub_content._my_index].x + "px"
                        current_sub_content.style.top = rect_anim_position[current_sub_content._my_index].y + "px"
                        setTimeout(function(){  
                            current_sub_content.style.transition = "0s"
                            current_sub_content.style.zIndex = "0"
                            current_sub_content.style.transform = "scale(1)"
                            current_sub_content.style.left = rect_anim_position[current_sub_content._my_index].x + "px"
                            current_sub_content.style.top = rect_anim_position[current_sub_content._my_index].y + "px"
                            
                        },520)

                    }else{ // 用户点击是新的子容器
                        // 恢复之前选中子容器
                        var last_selected_sub = rect_anim_position[selected_sub_content.sub_index]
                        last_selected_sub.element.style.top = last_selected_sub.y + "px"
                        last_selected_sub.element.style.left = last_selected_sub.x + "px"
                        last_selected_sub.element.style.transform = "scale(1)"
                        last_selected_sub.element.style.transition = "0.5s"
                        hide_info(selected_sub_content.element)
                        // 改变当前处于选中状态的子容器的信息对象
                        selected_sub_content.sub_index = current_sub_content._my_index
                        selected_sub_content.element = current_sub_content

                        setTimeout(function(){  
                            last_selected_sub.element.style.transition = "0s"
                            last_selected_sub.element.style.zIndex = "0"
                            last_selected_sub.element.style.top = last_selected_sub.y + "px"
                            last_selected_sub.element.style.left = last_selected_sub.x + "px"
                            last_selected_sub.element.style.transform = "scale(1)"
                        },520)

                        // 改变新选中的子容器

                        current_sub_content.style.transition = "0.5s"
                        current_sub_content.style.transform = "scale(3)"
                        current_sub_content.style.zIndex = "2"
                        current_sub_content.style.top = selected_sub_content.y + "px"
                        current_sub_content.style.left = selected_sub_content.x + "px"

                        setTimeout(function(){
                            current_sub_content.style.transition = "0s"
                            show_info(current_sub_content,"User Show Message")
                        },520)
                    }

                }
            }
        }
        current_sub_content.onmouseleave = function(){
            current_sub_content.onmousemove = null
            hide_info(current_sub_content)
        }

    }

    function sub_content_touch(down_e){
        var isDrag = false                                      // 默认用户的操作是点击 ( 选择 )
        // console.log(down_e.changedTouches[0])
        var current_sub_content = down_e.changedTouches[0].target                 // 当前的子容器目标
        var current_sub_content_bound = current_sub_content.getBoundingClientRect()
        var current_sub_top = current_sub_content_bound.top
        var current_sub_left = current_sub_content_bound.left
        var offset_x = down_e.changedTouches[0].clientX - current_sub_left    // 子容器放大三倍
        var offset_y = down_e.changedTouches[0].clientY - current_sub_top
        current_sub_content.style.transform = "scale(3)"        // 当前的子容器目标放大
       
        current_sub_content.ontouchmove = function(move_e){
            if(Math.abs(move_e.changedTouches[0].clientX - down_e.changedTouches[0].clientX) < 0.01){ return }   // 过滤鼠标轻微抖动导致的移动事件
            isDrag = true                           // 用户当前的操作是拖动
            // console.log('move')
            if(!selected_sub_content.isEmpty){      // 之前有选中的子容器
                if(selected_sub_content.sub_index == current_sub_content._my_index){ // 拖动之前选中子容器
                    selected_sub_content.x = move_e.changedTouches[0].clientX - content_wrap_left - offset_x/3
                    selected_sub_content.y = move_e.changedTouches[0].clientY - content_top - offset_y/3
                    current_sub_content.style.left = selected_sub_content.x + "px"
                    current_sub_content.style.top = selected_sub_content.y + "px"

                }else{  // 拖动不同子容器
                    console.log('diff')
                    var last_selected_sub = rect_anim_position[selected_sub_content.sub_index]
                    last_selected_sub.element.style.zIndex = "0"
                    last_selected_sub.element.style.top = last_selected_sub.y + "px"
                    last_selected_sub.element.style.left = last_selected_sub.x + "px"
                    last_selected_sub.element.style.transform = "scale(1)"
                    last_selected_sub.element.style.transition = "0.5s"
                    setTimeout(function(){
                        last_selected_sub.element.style.transition = "0s"
                        last_selected_sub.element.style.transform = "scale(1)"
                        last_selected_sub.element.style.top = last_selected_sub.y + "px"
                        last_selected_sub.element.style.left = last_selected_sub.x + "px"
                    },520)

                    selected_sub_content.sub_index = current_sub_content._my_index
                    selected_sub_content.element = current_sub_content
                    selected_sub_content.x = move_e.changedTouches[0].clientX - content_wrap_left
                    selected_sub_content.y = move_e.changedTouches[0].clientY - content_top

                    current_sub_content.style.zIndex = "2"
                    current_sub_content.style.transform = "scale(3)"
                    current_sub_content.style.left = selected_sub_content.x + "px"
                    current_sub_content.style.top = selected_sub_content.y + "px"
                }

            }else{  // 之前没有选中的子容器
                
                selected_sub_content.element = current_sub_content
                selected_sub_content.sub_index = current_sub_content._my_index
                // selected_sub_content.x = move_e.clientX - offset_x
                // selected_sub_content.y = move_e.clientY - offset_y
                selected_sub_content.x = move_e.changedTouches[0].clientX - content_wrap_left - offset_x
                selected_sub_content.y = move_e.changedTouches[0].clientY - content_top - offset_y


                current_sub_content.style.zIndex = "2"
                current_sub_content.style.left = selected_sub_content.x + "px"
                current_sub_content.style.top = selected_sub_content.y + "px"
            }
          
        }

        current_sub_content.ontouchend = function(up_e){
            current_sub_content.onmousemove = null
            if(isDrag){ // 用户的操作是拖动
                selected_sub_content.isEmpty = false
                selected_sub_content.element = current_sub_content
                selected_sub_content.element.style.transition = "0s"
                
                selected_sub_content.sub_index = current_sub_content._my_index
              

            }else{      // 用户额操作是点击 ( 选择 )
                if(selected_sub_content.isEmpty){       // 当前处于选中状态的子容器的信息对象为空

                    selected_sub_content.isEmpty = false
                    selected_sub_content.element = current_sub_content
                    selected_sub_content.sub_index = current_sub_content._my_index
                    selected_sub_content.x = content_center.x
                    selected_sub_content.y = content_center.y

                    current_sub_content.style.top = content_center.y + "px"
                    current_sub_content.style.left = content_center.x + "px "
                    current_sub_content.style.zIndex = "2"
                    current_sub_content.style.transition = "0.5s"
                    setTimeout(function(){
                        current_sub_content.style.transition = "0s"
                    },520)

                }else{                                  // 当前处于选中状态的子容器的信息对象不为空

                    if(selected_sub_content.sub_index == current_sub_content._my_index){    // 用户重复点击上一次点击的子容器
                        selected_sub_content.isEmpty = true // 设置当前处于选中状态的子容器的信息对象为空
                        selected_sub_content.sub_index = -1
                        selected_sub_content.x = ""
                        selected_sub_content.y = ""

                        current_sub_content.style.transform = "scale(1)"
                        current_sub_content.style.transition = "0.5s"
                        current_sub_content.style.left = rect_anim_position[current_sub_content._my_index].x + "px"
                        current_sub_content.style.top = rect_anim_position[current_sub_content._my_index].y + "px"
                        setTimeout(function(){  
                            current_sub_content.style.transition = "0s"
                            current_sub_content.style.zIndex = "0"
                            current_sub_content.style.transform = "scale(1)"
                            current_sub_content.style.left = rect_anim_position[current_sub_content._my_index].x + "px"
                            current_sub_content.style.top = rect_anim_position[current_sub_content._my_index].y + "px"
                        },520)

                    }else{ // 用户点击是新的子容器
                        // 恢复之前选中子容器
                        var last_selected_sub = rect_anim_position[selected_sub_content.sub_index]
                        last_selected_sub.element.style.top = last_selected_sub.y + "px"
                        last_selected_sub.element.style.left = last_selected_sub.x + "px"
                        last_selected_sub.element.style.transform = "scale(1)"
                        last_selected_sub.element.style.transition = "0.5s"
                        // 改变当前处于选中状态的子容器的信息对象
                        selected_sub_content.sub_index = current_sub_content._my_index
                        selected_sub_content.element = current_sub_content

                        setTimeout(function(){  
                            last_selected_sub.element.style.transition = "0s"
                            last_selected_sub.element.style.zIndex = "0"
                            last_selected_sub.element.style.top = last_selected_sub.y + "px"
                            last_selected_sub.element.style.left = last_selected_sub.x + "px"
                            last_selected_sub.element.style.transform = "scale(1)"
                        },520)

                        // 改变新选中的子容器

                        current_sub_content.style.transition = "0.5s"
                        current_sub_content.style.transform = "scale(3)"
                        current_sub_content.style.zIndex = "2"
                        current_sub_content.style.top = selected_sub_content.y + "px"
                        current_sub_content.style.left = selected_sub_content.x + "px"

                        setTimeout(function(){
                            current_sub_content.style.transition = "0s"
                        },520)
                    }

                }
            }
        }
        current_sub_content.ontouchend = function(){
            current_sub_content.ontouchmove = null
        }
    }
   
    // 控制滑动商品列表
    document.onmousedown = content_event
    function content_event(down_event){
        if(!selected_sub_content.isEmpty){return}
        down_event.stopPropagation()
        var down_x = down_event.clientX
        document.onmousemove = function(move_event){
            var drop_x = move_event.clientX - down_x
            down_x = move_event.clientX
            rect_anim_position.forEach(function(item){
                item.x += drop_x
                if(item.x < sub_content_left){
                    item.x = sub_content_right
                }
                item.element.style.left = item.x
            })
            
        }
        document.onmouseup = function(e){
            document.onmousemove = null
            document.onmouseleave = null
        }
        document.onmouseleave = function(e){
            document.onmousemove = null
            document.onmouseup = null
        }
    }
    // 控制滑动商品列表 ( 移动端适配 )
    document.ontouchstart = content_touch_event
    function content_touch_event(down_event){
        if(!selected_sub_content.isEmpty){return}
        var down_x = down_event.changedTouches[0].clientX
        document.ontouchmove = function(move_event){
            var drop_x = move_event.changedTouches[0].clientX - down_x
            down_x = move_event.changedTouches[0].clientX
            rect_anim_position.forEach(function(item){
                item.x += drop_x
                if(item.x < sub_content_left){
                    item.x = sub_content_right
                }
                item.element.style.left = item.x
            })
            
        }
        document.ontouchend = function(e){
            document.ontouchmove = null
        }
        document.ontouchcancel = function(e){
            document.ontouchmove = null
        }
    }
    /**
     * 
     * @param { center:object,rect_index:number } 
     * 返回当前选中某个子容器时四周受到影响的其他子容器
     */
    function involved_subs(center){
        var involved_sub_list = []
        
        rect_anim_position.forEach(function(item,index){
            if(selected_sub_content.sub_index !== index){
                if( Math.pow(item.x - center.x , 2 ) + Math.pow( item.y - center.y , 2 ) < Math.pow(sub_content_radius,2)){
                    // 确定到当前的受到影响的子容器
                    involved_sub_list.push(item)
                }
            }
        })
        return involved_sub_list
    }
    /**
     * 
     * @param { center:object, involved_sub_list:array } involved_sub_list 
     * 将受到影响的子容器向四周移动
     */
    function move_involved_subs(center, involved_sub_list){
        // 将受到波及的子容器向四周环形移动
       
        involved_sub_list.forEach(function(item){
            let aX = Math.abs(item.x - center.x)
            let aY = Math.abs(item.y - center.y)
            let aXY = Math.sqrt(aX*aX + aY*aY)

            let sinA = aY / aXY
            let cosA = aX / aXY
            item.element.style.zIndex = "1"

            //----
            // if(item.y < center.y && item.y > center.y - sub_content_radius){ // r-l
            //     item.element.style.top = item.y - (item.y - (center.y - sub_content_radius))*sinA + "px"
            // }else if(item.y > center.y && item.y < center.y + sub_content_radius){
            //     item.element.style.top = item.y + (center.y + sub_content_radius - item.y)*sinA + "px"
            // }

            //----


            // var sub_x = (sub_content_radius - Math.abs(item.x - sub_content_width/2 - center.x))*2/3
            // var sub_x = (sub_content_radius - Math.abs(item.x - center.x))*2/3
            var sub_x = (sub_content_radius - Math.sqrt(aX*aX + aY*aY))/2
            
            if(item.y < center.y){  // 受影响的子容器在上方
               
                // item.element.style.zIndex = "1"
                // item.element.style.top = item.y - sub_x*sinA - sub_content_radius*sinA*2/3 + "px"
                item.element.style.top = item.y - sub_x - sub_content_radius*sinA*2/3 + "px"
                
                // item.element.style.top = item.y - sub_content_height*1.5*sinA/2 - sub_content_radius*sinA/2 + "px"
                // item.element.style.top = item.x - sub_content_width/2 - center.x
            }else{                  // 受影响的子容器在下方
              
                // item.element.style.top = item.y + sub_x*sinA + sub_content_radius*sinA*2/3 + "px"
                item.element.style.top = item.y + sub_x + sub_content_radius*sinA*2/3 + "px"
                // item.element.style.top = item.y + sub_content_height*1.5*sinA/2 + sub_content_radius*sinA/2 + "px"
            }
            
            
        })
    }
    
    function mixin_img_arr(img_arr,sub_content_count){    // 控制传入的图片数组
        if(img_arr.length > sub_content_count){
            return img_arr.slice(0,sub_content_count)
        }else{
            var arr = []
            var len = img_arr.length 
            for(var i = 0;i < sub_content_count;i++){
                var index = Math.floor( Math.random() * ( len ) )
                arr.push(img_arr[index])
            }
            return arr
        }
    }

    function show_info(wrap, info){
        wrap.innerHTML = info
    }

    function hide_info(wrap){
        wrap.innerHTML = ""
    }

    return function(new_imgs){
        var imgs = mixin_img_arr(new_imgs,sub_content_count)
        // rect_anim_position
        // imgs.forEach(function(val){

        // })
        // console.log(new_imgs)
        // console.log(rect_anim_position[0].element.style.backgroundImage)
        // console.log(imgs[0])
        for(var i = 0;i < sub_content_count;i++){
            // ele.style.backgroundImage = `url(${ img_url })`
            rect_anim_position[i].element.style.backgroundImage= `url(${ imgs[i] })`
        }
    }
}
