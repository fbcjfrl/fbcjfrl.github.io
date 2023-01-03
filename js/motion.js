const motionEvent = {
    default_variable : () => {
       let x = {};
       x['start'] = false;
       x['move'] = false;
       x['val'] = [];
       return x;
    },
    move : (callback,dom = undefined) => {
       let x = motionEvent.default_variable();
       [['touchstart', 'touchmove', 'touchend'],['mousedown', 'mousemove', 'mouseup']].forEach((eventMotion) => {
          document.addEventListener(eventMotion[0], (e) => {
             if(!x.start) x.val[0] = [(e.pageX)?e.pageX:e.targetTouches[0].pageX,(e.pageY)?e.pageY:e.targetTouches[0].pageY];
             x.start = true;
          });
          document.addEventListener(eventMotion[1], (e) => {
             if(x.start) {
                x.val[1] = [(e.pageX)?e.pageX:e.changedTouches[0].pageX,(e.pageY)?e.pageY:e.changedTouches[0].pageY];
                motionEvent.action(moveMosion.value(x.val,dom),callback);
                if(Math.abs(x.val[0].reduce((a,b)=>a+b) - x.val[1].reduce((a,b)=>a+b)) > 10) x.val[0] = x.val[1];
                x.move = true;
             }
          });
          document.addEventListener(eventMotion[2], (e) => {
             if(x.start && x.move) x.val[1] = [(e.pageX)?e.pageX:e.changedTouches[0].pageX,(e.pageY)?e.pageY:e.changedTouches[0].pageY];
             if(x.val.length == 2) motionEvent.action(moveMosion.value(x.val,dom),callback);
             x = motionEvent.default_variable();
          });
       });
    },
    click  : (callback,dom = undefined) => {
        document.addEventListener('click', (e) => {
            motionEvent.action(clickMosion.value([e.pageX,e.pageY],dom),callback);
        });
    },
    scroll : (callback) => {},
    resize : (callback) => {},
    action : (val,callback) => callback(val)
 }
 const clickMosion = {
    inout : (x,dom) => {
        let r = true;
        if(dom){
            const top = dom.getBoundingClientRect().top;
            const bottom = dom.getBoundingClientRect().top+dom.scrollWidth;
            const left = dom.getBoundingClientRect().left;
            const right = dom.getBoundingClientRect().left+dom.scrollHeight;
            if(x[0] >= left && x[0] <= right && x[1] >= top && x[1] <= bottom) r = true;
            else r = false;
        }
        return r;
    },
    value : (x,dom = undefined) => {
        let r = {};
        r['dom'] = dom;
        r['coordinate'] = x;
        r['inout'] = clickMosion.inout(x,dom);
        return r;
     }
 }

 const moveMosion = {
    position : (x,dom) => {
       const w = (dom)?(dom.scrollWidth/2)+dom.getBoundingClientRect().left:window.innerWidth/2;
       const h = (dom)?(dom.scrollHeight/2)+dom.getBoundingClientRect().top:window.innerHeight/2;
       if(x[0][0] > w && x[0][1] > h) return 3;
       else if(x[0][0] > w && x[0][1] < h) return 2;
       else if(x[0][0] < w && x[0][1] > h) return 4;
       else if(x[0][0] < w && x[0][1] < h) return 1;
       else return 0;
    },
    direction : (x) => {
       let a = x[0][0] - x[1][0];
       let b = x[0][1] - x[1][1];
       if(!a && !b) return 0;
       if(Math.abs(a) > Math.abs(b) || Math.abs(b) == 0){
          if(a > 0) return 7;
          else return 3;
       }else if(Math.abs(a) < Math.abs(b) || Math.abs(a) == 0){
          if(b > 0) return 1;
          else return 5;
       }else{
          if(a > 0 && b > 0) return 8;
          else if(a > 0 && b < 0) return 6;
          else if(a < 0 && b > 0) return 2;
          else if(a < 0 && b < 0) return 4;
       }
    },
    inout : (x,dom) => {
       let r = true;
       if(dom){
          const top = dom.getBoundingClientRect().top;
          const bottom = dom.getBoundingClientRect().top+dom.scrollWidth;
          const left = dom.getBoundingClientRect().left;
          const right = dom.getBoundingClientRect().left+dom.scrollHeight;
          if(x[0][0] >= left && x[0][0] <= right && x[0][1] >= top && x[0][1] <= bottom) r = true;
          else r = false;
       }
       return r;
    },
    value : (x,dom = undefined) => {
       let r = {};
       r['dom'] = dom;
       r['coordinate'] = x;
       r['inout'] = moveMosion.inout(x,dom);
       r['position'] = moveMosion.position(x,dom);
       r['direction'] = moveMosion.direction(x);
       return r;
    }
 }