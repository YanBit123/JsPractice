window.onload = function (){    
    //获取表格
    var gameTable = document.getElementById("gameTable");
    
    //获取下拉列表
    var rowSel = document.getElementById("rowSel");
    var colSel = document.getElementById("colSel");
    
    //获取开始按钮
    var startBtn = document.getElementById("startBtn");
    
    //计时器
    var interval = null;
    //点击按钮，游戏开始

    startBtn.onclick = function (){
        //清空游戏表格
        gameTable.innerHTML = "";

        //获取下拉列表的输入
        var rows = rowSel.value;
        var cols = colSel.value;

        //创建单元格矩阵
        var matrix = [];
        
        //定义地雷映射矩阵
        var isMine = [];
        
        //定义开启映射矩阵
        var isOpen = [];
        
        //阻止右键菜单事件
        window.oncontextmenu = function (e) {
            return false;
        }

        //关闭已有计时器
        if(interval){
            clearInterval(interval);
        }
        //开启计时器
        interval = timeStart();
        
        //初始化矩阵
        for (var i = 0; i < rows; i++) {
            (function (i) {
                //创建tr对象
                var tr = document.createElement("tr");
                gameTable.appendChild(tr);
                matrix.push([]);
                isMine.push([]);
                isOpen.push([]);
                for (var j = 0; j < cols; j++) {
                    //创建td对象
                    var td = document.createElement("td");
                    //添加td对象到文档和单元格矩阵
                    tr.appendChild(td);
                    matrix[i][j] = td;
                    (function (i,j) {
                        var td = matrix[i][j];
                        //单元格点击事件
                        td.onclick = function () {
                            isOpen[i][j] = true;
                            if (isMine[i][j]) {
                                //游戏结束
                                gameOver("游戏结束");
                            } else {
                                //打开方格
                                td.className = "open";
                                //获取周围地雷数
                                var mineNums = getMineNums(i, j);
                                //如果地雷数为0，则自动打开周围的方格
                                if (mineNums == 0) {
                                    openNearby(i, j);
                                }else{
                                    td.innerText = mineNums;
                                }
                                //判断游戏是否成功
                                if (win()){
                                    gameOver("扫雷成功");
                                }
                            }
                        }
                        //单元格右键事件
                        td.oncontextmenu = function () {
                            //将未打开的单元格标记
                            if(!isOpen[i][j]){
                                markTd(this);
                            }
                        }
                        //初始化映射矩阵
                        isMine[i][j] = false;
                        isOpen[i][j] = false;
                    }(i,j));
                }
            }(i));
        }

        //地雷数量
        var count = parseInt(rows * cols * 0.2);
        //显示地雷数量
        //获取显示地雷数的元素
        var mineNums = document.getElementById("mineNums");
        mineNums.innerText = count;
        //添加地雷
        while (true) {
            //获取随机数
            var x = Math.floor(Math.random() * isMine.length);
            var y = Math.floor(Math.random() * isMine[0].length);
            if (!isMine[x][y]) {
                isMine[x][y] = true;
                if (--count == 0) {
                    break;
                }
            }
        }
        
        //判断游戏是否成功
        //游戏成功:所有非雷单元格被开启
        function win(){
            for(var i = 0;i < isMine.length;i++){
                for(var j=0;j<isMine[i].length;j++){
                    //存在尚未打开的非雷方格，游戏尚未成功
                    if(!isMine[i][j] && !isOpen[i][j]){
                        return false;
                    }
                }
            }
            return true;
        }

        //游戏结束方法
        function gameOver(msg){
            //清除计时器
            clearInterval(interval);
            //标记地雷
            markMines();
            //提示
            setTimeout(function (){
                alert(msg);
                location.reload();
            },200);
        }

        //标记单元格
        function markTd(td){
            //获取显示旗帜数的元素
            var flagNums = document.getElementById("flagNums");
            //获取旗帜数
            var num = parseInt(flagNums.innerText);
            if(td.innerText == ""){
                flagNums.innerText = num+1+"";
                td.innerText = "🚩";
            }else{
                flagNums.innerText = num-1+"";
                td.innerText = "";
            }
        }

        //打开周围所有未打开的方格
        function openNearby(x, y) {
            if (x > 0) {
                if (y > 0 && !isOpen[x - 1][y - 1]) {
                    matrix[x - 1][y - 1].onclick();
                }
                if (!isOpen[x - 1][y]) {
                    matrix[x - 1][y].onclick();
                }
                if (y < matrix[0].length - 1 && !isOpen[x - 1][y + 1]) {
                    matrix[x - 1][y + 1].onclick();
                }
            }
            if (x < matrix[0].length - 1) {
                if (y > 0 && !isOpen[x + 1][y - 1]) {
                    matrix[x + 1][y - 1].onclick();
                }
                if (!isOpen[x + 1][y]) {
                    matrix[x + 1][y].onclick();
                }
                if (y < matrix[0].length - 1 && !isOpen[x + 1][y + 1]) {
                    matrix[x + 1][y + 1].onclick();
                }
            }
            if (y > 0 && !isOpen[x][y - 1]) {
                matrix[x][y - 1].onclick();
            }
            if (y < matrix[0].length - 1 && !isOpen[x][y + 1]) {
                matrix[x][y + 1].onclick();
            }
        }
        
        //获取周围的地雷数
        function getMineNums(x, y) {
            console.log(x + ":" + y);
            var nums = 0;
            if (x > 0) {
                if (y > 0 && isMine[x - 1][y - 1]) {
                    nums++;
                }
                if (isMine[x - 1][y]) {
                    nums++;
                }
                if (y < isMine[0].length - 1 && isMine[x - 1][y + 1]) {
                    nums++
                }
            }
            if (x < isMine.length - 1) {
                if (y > 0 && isMine[x + 1][y - 1]) {
                    nums++;
                }
                if (isMine[x + 1][y]) {
                    nums++;
                }
                if (y < isMine[0].length - 1 && isMine[x + 1][y + 1]) {
                    nums++;
                }
            }
            if (y > 0 && isMine[x][y - 1]) {
                nums++;
            }
            if (y < isMine[0].length - 1 && isMine[x][y + 1]) {
                nums++;
            }
            return nums;
        }
        
        //标记地雷单元格
        function markMines(){
            for(var i = 0; i < isMine.length;i++){
                for(var j = 0;j < isMine[x].length;j++){
                    if(isMine[i][j]){
                        matrix[i][j].innerText = "💣";
                    }
                }
            }
        }

        //时间操作
        //获取显示时间的元素
        var hour = document.getElementById("hour");
        var minute = document.getElementById("minute");
        var second = document.getElementById("second");

        //初始化时间参数
        hour.innerText = "00";
        minute.innerText = "00";
        second.innerText = "00";
        //计时开始
        function timeStart(){
            return setInterval(() => {
                //获取时间参数
                var ss = parseInt(second.innerText);

                ss ++;
                
                if(ss == 60){
                    var mm = parseInt(minute.innerText);
                    second.innerText = "00";
                    mm ++;
                    if(mm == 60){
                        var hh = parseInt(hour.innerText);
                        second.innerText == "00";
                        hour.innerText = ++hh + "";
                    }else{
                        minute.innerText = mm<10 ? "0"+mm : ""+mm;
                    }
                }else{
                    second.innerText = ss<10 ?  "0"+ss : ""+ss;
                }

            }, 1000);
        }
    }
}