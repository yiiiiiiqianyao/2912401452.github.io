/**
 * 
 * @param {*} content 容器
 * @param {*} img_arr 需要显示的图片数组
 */
function init_el_wrap(content,img_arr){
    let bound_obj = content.getBoundingClientRect() // 容器坐标对象
    let content_x = bound_obj.x                     // 容器坐标
    let content_y = bound_obj.y
    let content_width = bound_obj.width             // 容器宽高
    let content_height = bound_obj.height
    
    let k = 1/5
    let w = 3
    let sub_content_width = content_width * k       // 子容器宽度
    let sub_content_height = content_height * k     // 子容器高度
    let content_center = {                          // 容器中心位置 ( 相对于三维偏移 )
        x : content_width / 2 - sub_content_width / 2,
        y : content_height / 2 - sub_content_height / 2
    }
    let sub_content_left =  - content_width    // 子容器横向排放的其实坐标做边界
    let sub_content_right = 2 * content_width
    let rect_animate_timer
    let circle_animate_timer
    let content_perspective = 1000
    content.style.position = "relative"
    content.style.perspective = content_perspective + "px"
    content.style.transformStyle = "preserve-3d"
    content.style.webkitTransformStyle = "preserve-3d"
    content.style.overflow = "hidden";

    let current_animate_status = "rect_anim"         // 当前的动画状态
    // rect_anim   rect_stop   circle_anim   circle_stop

    let rect_anim_position = []                     // 横向动画时的子对象的坐标信息
    let circle_anim_position = []                   // 环形动画时的子对象的坐标信息

    fill_content()
    rect_animate()             // 默认执行横向动画
    function fill_content(){
        let len = 75                // 一共有几个子容器
        let row_len = w/k           // 每一行能排放几个子容器
        let row = 0                 // 当前子容器排放到第几行
        let count = 0               // 当前行已经排放几个子容器
        
        // let item_width = content_width / 5      
        // let item_height = content_height / 5    
        for(let i = 0;i < len;i++){
            
            var sub_item = init_sub_content()   // 创建一个子容器
            
            if( count == row_len ){ 
                count = 0
                row++
            }
            let sub_x = sub_content_left + count * sub_content_width
            let sub_y = row * sub_content_height
            sub_item.style.transform = `translate3d(
                ${ sub_x }px,
                ${ sub_y }px,
                0px)`
            count++
            rect_anim_position.push({
                element:sub_item,
                x:sub_x,
                y:sub_y,
                z:0
            })
            content.appendChild(sub_item)
        }
    }
    
    function rect_animate(){
        rect_anim_position.forEach(function(item){
            item.x -= 0.4
            if(item.x < sub_content_left){
                item.x = sub_content_right
            }
            item.element.style.transform = `translate3d(
                ${item.x}px,
                ${item.y}px,
                0px)`
        })
        rect_animate_timer = requestAnimationFrame(rect_animate)
    }

    function init_sub_content(){
        let ele = document.createElement('div')
        ele.classList.add("sub_content")
        ele.style.display = "inline-block"
        ele.style.position = "absolute"         // 使得所有子容器的偏移中心一致
        ele.style.width = content_width / 5 +"px"
        ele.style.height = content_height / 5+"px"
        ele.style.backgroundColor = "white"
        ele.style.border = "1px solid red"
        ele.onclick = sub_content_click
        return ele
    }

    function sub_content_click(e){
            // if(current_animate_status != "rect_anim"){
            //     rect_animate() 
            //     current_animate_status = "rect_anim"
            //     // return
            // }
            // current_animate_status = "rect_stop"
            // console.log(current_animate_status)
            content.style.overflow = "";

            cancelAnimationFrame(rect_animate_timer)
            // circle_anim_position = rect_anim_position.concat([])
            circle_anim_position = []   // 用于保存将会在环形区域内部做动画的子容器坐标信息
            // 容器变形
           
            content.style.width = content_height + "px"     // 容器变成半径为 content_height/2 的圆
            content.style.height = content_height + "px"    // 
            content.style.transition = "1s"
            content.style.borderRadius = "50%"
            content_center = {
                x : content_height/2 - sub_content_width/2,
                y : content_height/2 - sub_content_height/2
            }

            // 选中项偏移至中央
            e.target.style.transition = "1s"
            e.target.style.transform = `translate3d(
                ${ content_center.x }px,
                ${ content_center.y }px,
                ${ content_height/2 }px)`

            // e.target.style.opacity = 0

            // 其余项做环状偏移
            content.style.transformStyle = "perserve-3d"
            content.style.WebkitTransformStyle = "perserve-3d"
            
            let circle_len = rect_anim_position.length
            
            for(let i = 0;i < circle_len;i++){
                if(e.target !== rect_anim_position[i].element){   // 其余项
                    // rect_anim_position[i].element.style.transition = "0.5s"
                    // var obj_x = content_height*Math.random(),
                    //  obj_y = content_height*Math.random(),
                    //  obj_z = -1500// + content_height/2 - content_height*Math.random()
                    // rect_anim_position[i].element.style.transform = `translate3d(
                    //     ${ obj_x }px,
                    //     ${ obj_y }px,
                    //     ${ obj_z }px)`
                    rect_anim_position[i].element.onclick = null
                    circle_anim_position.push({
                        element:rect_anim_position[i].element,
                        // x:obj_x,
                        // y:obj_y,
                        // z:obj_z,
                        // offset_x: 0.5 - Math.random(),
                        // offset_y: 0.5 - Math.random()
                    })  
                }

            }
            // circle_animate()
            draw_circle()
    }
    function draw_circle(){
        let circle_len = circle_anim_position.length
        let half_len = Math.floor(circle_len / 3)
        let half_deg = 360/half_len
        let i
        // content.style.transform = "rotateX(90deg)";
        for(i = 0;i < half_len;i++){    // 最内层 
            circle_anim_position[i].element.style.transform = 
            `translate3d(${ content_center.x  }px,${ content_center.y }px,${-content_height*9}px) rotateZ(${ half_deg * i }deg) translateY(${content_height*1.5}px)`
        }
        for(;i < half_len*2;i++){       // 次内层
            circle_anim_position[i].element.style.transform = 
            `translate3d(${ content_center.x }px,${ content_center.y }px,${-content_height*6}px) rotateZ(${ half_deg * i }deg) translateY(${content_height*1.5}px)`   
        }
        for(;i < circle_len;i++){       // 最外层
            circle_anim_position[i].element.style.transform = 
            `translate3d(${ content_center.x }px,${ content_center.y }px,${-content_height*3}px) rotateZ(${ half_deg * i }deg) translateY(${content_height*1.2}px)`   
        }
    }
    function circle_animate(){
        // let circle_len = circle_anim_position.length
        // for(let i = 0;i < circle_len;i++){
        //     // if(circle_anim_position[i].x * circle_anim_position[i].x + circle_anim_position[i].y * circle_anim_position[i].y > (content_height/2)*(content_height/2)){
        //     //     circle_anim_position[i].offset_x *= -1
        //     //     circle_anim_position[i].offset_y *= -1
        //     // }
        //     var bx = circle_anim_position[i].x - content_height/2
        //     var by = circle_anim_position[i].y - content_height/2
        //     if(bx*bx + by*by > content_height*content_height/4){
        //         circle_anim_position[i].offset_x *= -1
        //         circle_anim_position[i].offset_y *= -1
        //     }
        //     circle_anim_position[i].x += circle_anim_position[i].offset_x
        //     circle_anim_position[i].y += circle_anim_position[i].offset_y

        //     circle_anim_position[i].element.style.transform = `translate3d(
        //         ${ circle_anim_position[i].x }px,
        //         ${ circle_anim_position[i].y }px,
        //         ${ circle_anim_position[i].z }px
        //     )`
        // }
        // content.style.transform = rotate
        circle_animate_timer = requestAnimationFrame(circle_animate)
    }
}
