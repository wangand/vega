var vows = require('vows'),
    assert = require('assert');

var suite = vows.describe('stack2tests');

// *** Functions to test simple cases ***
// simplify a vega1 raw data string
// removes values, keys, and indexes
// returns the simplified data as JSON string
function simplify(data){
    temp = JSON.parse(data);
    return_var = [];
    for(i=0; i < temp.values.length; i++){
        for(j=0; j<temp.values[i].values.length; j++){
            push_var = temp.values[i].values[j]
            //delete push_var.index; // remove the index property
            return_var.push(push_var);
        }
    }
    return JSON.stringify(return_var);
};

// Fuzzy compare of a floating point number
// From Michael Borgwardt's answer on stackoverflow
// http://stackoverflow.com/questions/4915462/how-should-i-do-floating-point-comparison
function nearlyEqual(num1, num2){
    epsilon = 0.00001
    abs1 = Math.abs(num1);
    abs2 = Math.abs(num2);
    diff = Math.abs(num1-num2)
    
    if(num1 === num2){
        return true;
    }
    else{
        return (diff/(abs1+abs2) < epsilon)
    }
};

// compare two simplify data objects
// returns true if they are equivalent and false otherwise
function compare(data1, data2){
    if(data1 === undefined || data2 ===undefined){
        return false;
    }
    if(data1.length != data2.length){
        return false;
    }
    // data1 is a subset of data2
    for(i=0; i<data1.length; i++){
        y2 = data1[i].y2;
        y = data1[i].y;
        cy = data1[i].cy;
        temp = false;
        for(j = 0; j<data2.length; j++){
            if(nearlyEqual(y2,data2[j].y2) && nearlyEqual(y,data2[j].y) && nearlyEqual(cy,data2[j].cy)){
                temp = true;
            }
        }
        if(temp===false){
            console.log(JSON.stringify(data1[i]));
            return false;
        }
    }
    // data2 is a subset of data1
    for(i=0; i<data2.length; i++){
        y2 = data2[i].y2;
        y = data2[i].y;
        cy = data2[i].cy;
        temp = false;
        for(j = 0; j<data1.length; j++){
            if(nearlyEqual(y2,data1[j].y2) && nearlyEqual(y,data1[j].y) && nearlyEqual(cy,data1[j].cy)){
                temp = true;
            }
        }
        if(temp===false){
            console.log(JSON.stringify(data1[i]));
            return false;
        }
    }
    
    return true;
};
// *** END functions to test basic cases ***

suite.addBatch({
    'stacked bar 1': {
      topic: require('../index.js'),
      'should process 2 variable stacked bar': function (vg) {
        data = simplify('{"key":"","keys":[],"values":[{"key":"0","keys":[0],"index":0,"values":[{"data":{"x":0,"y":28,"c":0},"index":0},{"data":{"x":1,"y":43,"c":0},"index":2},{"data":{"x":2,"y":81,"c":0},"index":4},{"data":{"x":3,"y":19,"c":0},"index":6},{"data":{"x":4,"y":52,"c":0},"index":8},{"data":{"x":5,"y":24,"c":0},"index":10},{"data":{"x":6,"y":87,"c":0},"index":12},{"data":{"x":7,"y":17,"c":0},"index":14},{"data":{"x":8,"y":68,"c":0},"index":16},{"data":{"x":9,"y":49,"c":0},"index":18}]},{"key":"1","keys":[1],"index":1,"values":[{"data":{"x":0,"y":55,"c":1},"index":1},{"data":{"x":1,"y":91,"c":1},"index":3},{"data":{"x":2,"y":53,"c":1},"index":5},{"data":{"x":3,"y":87,"c":1},"index":7},{"data":{"x":4,"y":48,"c":1},"index":9},{"data":{"x":5,"y":49,"c":1},"index":11},{"data":{"x":6,"y":66,"c":1},"index":13},{"data":{"x":7,"y":27,"c":1},"index":15},{"data":{"x":8,"y":16,"c":1},"index":17},{"data":{"x":9,"y":15,"c":1},"index":19}]}]}');
        data = JSON.parse(data);
        ans = simplify('{"key":"","keys":[],"values":[{"key":"0","keys":[0],"index":0,"values":[{"data":{"x":0,"y":28,"c":0},"index":0,"y2":0,"y":28,"cy":14},{"data":{"x":1,"y":43,"c":0},"index":2,"y2":0,"y":43,"cy":21.5},{"data":{"x":2,"y":81,"c":0},"index":4,"y2":0,"y":81,"cy":40.5},{"data":{"x":3,"y":19,"c":0},"index":6,"y2":0,"y":19,"cy":9.5},{"data":{"x":4,"y":52,"c":0},"index":8,"y2":0,"y":52,"cy":26},{"data":{"x":5,"y":24,"c":0},"index":10,"y2":0,"y":24,"cy":12},{"data":{"x":6,"y":87,"c":0},"index":12,"y2":0,"y":87,"cy":43.5},{"data":{"x":7,"y":17,"c":0},"index":14,"y2":0,"y":17,"cy":8.5},{"data":{"x":8,"y":68,"c":0},"index":16,"y2":0,"y":68,"cy":34},{"data":{"x":9,"y":49,"c":0},"index":18,"y2":0,"y":49,"cy":24.5}]},{"key":"1","keys":[1],"index":1,"values":[{"data":{"x":0,"y":55,"c":1},"index":1,"y2":28,"y":83,"cy":55.5},{"data":{"x":1,"y":91,"c":1},"index":3,"y2":43,"y":134,"cy":88.5},{"data":{"x":2,"y":53,"c":1},"index":5,"y2":81,"y":134,"cy":107.5},{"data":{"x":3,"y":87,"c":1},"index":7,"y2":19,"y":106,"cy":62.5},{"data":{"x":4,"y":48,"c":1},"index":9,"y2":52,"y":100,"cy":76},{"data":{"x":5,"y":49,"c":1},"index":11,"y2":24,"y":73,"cy":48.5},{"data":{"x":6,"y":66,"c":1},"index":13,"y2":87,"y":153,"cy":120},{"data":{"x":7,"y":27,"c":1},"index":15,"y2":17,"y":44,"cy":30.5},{"data":{"x":8,"y":16,"c":1},"index":17,"y2":68,"y":84,"cy":76},{"data":{"x":9,"y":15,"c":1},"index":19,"y2":49,"y":64,"cy":56.5}]}]}');
        ans = JSON.parse(ans);
        test = vg.data.stack2(data);
        test.groupby(["data.x"]);
        test.sortby(["data.c"]);
        test.value("data.y");
        test(data);
        assert(compare(data,ans)===true);
      }
    },
    'stacked area': {
      topic: require('../index.js'),
      'should process same 2 variable stacked bar': function (vg) {
        data = simplify('{"key":"","keys":[],"values":[{"key":"0","keys":[0],"index":0,"values":[{"data":{"x":0,"y":28,"c":0},"index":0},{"data":{"x":1,"y":43,"c":0},"index":2},{"data":{"x":2,"y":81,"c":0},"index":4},{"data":{"x":3,"y":19,"c":0},"index":6},{"data":{"x":4,"y":52,"c":0},"index":8},{"data":{"x":5,"y":24,"c":0},"index":10},{"data":{"x":6,"y":87,"c":0},"index":12},{"data":{"x":7,"y":17,"c":0},"index":14},{"data":{"x":8,"y":68,"c":0},"index":16},{"data":{"x":9,"y":49,"c":0},"index":18}]},{"key":"1","keys":[1],"index":1,"values":[{"data":{"x":0,"y":55,"c":1},"index":1},{"data":{"x":1,"y":91,"c":1},"index":3},{"data":{"x":2,"y":53,"c":1},"index":5},{"data":{"x":3,"y":87,"c":1},"index":7},{"data":{"x":4,"y":48,"c":1},"index":9},{"data":{"x":5,"y":49,"c":1},"index":11},{"data":{"x":6,"y":66,"c":1},"index":13},{"data":{"x":7,"y":27,"c":1},"index":15},{"data":{"x":8,"y":16,"c":1},"index":17},{"data":{"x":9,"y":15,"c":1},"index":19}]}]}');
        data = JSON.parse(data);
        ans = simplify('{"key":"","keys":[],"values":[{"key":"0","keys":[0],"index":0,"values":[{"data":{"x":0,"y":28,"c":0},"index":0,"y2":0,"y":28,"cy":14},{"data":{"x":1,"y":43,"c":0},"index":2,"y2":0,"y":43,"cy":21.5},{"data":{"x":2,"y":81,"c":0},"index":4,"y2":0,"y":81,"cy":40.5},{"data":{"x":3,"y":19,"c":0},"index":6,"y2":0,"y":19,"cy":9.5},{"data":{"x":4,"y":52,"c":0},"index":8,"y2":0,"y":52,"cy":26},{"data":{"x":5,"y":24,"c":0},"index":10,"y2":0,"y":24,"cy":12},{"data":{"x":6,"y":87,"c":0},"index":12,"y2":0,"y":87,"cy":43.5},{"data":{"x":7,"y":17,"c":0},"index":14,"y2":0,"y":17,"cy":8.5},{"data":{"x":8,"y":68,"c":0},"index":16,"y2":0,"y":68,"cy":34},{"data":{"x":9,"y":49,"c":0},"index":18,"y2":0,"y":49,"cy":24.5}]},{"key":"1","keys":[1],"index":1,"values":[{"data":{"x":0,"y":55,"c":1},"index":1,"y2":28,"y":83,"cy":55.5},{"data":{"x":1,"y":91,"c":1},"index":3,"y2":43,"y":134,"cy":88.5},{"data":{"x":2,"y":53,"c":1},"index":5,"y2":81,"y":134,"cy":107.5},{"data":{"x":3,"y":87,"c":1},"index":7,"y2":19,"y":106,"cy":62.5},{"data":{"x":4,"y":48,"c":1},"index":9,"y2":52,"y":100,"cy":76},{"data":{"x":5,"y":49,"c":1},"index":11,"y2":24,"y":73,"cy":48.5},{"data":{"x":6,"y":66,"c":1},"index":13,"y2":87,"y":153,"cy":120},{"data":{"x":7,"y":27,"c":1},"index":15,"y2":17,"y":44,"cy":30.5},{"data":{"x":8,"y":16,"c":1},"index":17,"y2":68,"y":84,"cy":76},{"data":{"x":9,"y":15,"c":1},"index":19,"y2":49,"y":64,"cy":56.5}]}]}');
        ans = JSON.parse(ans);
        test = vg.data.stack2(data);
        test.groupby(["data.x"]);
        test.sortby(["data.c"]);
        test.value("data.y");
        test(data);
        assert(compare(data,ans)===true);
      }
    },
    'stacked bar 2': {
      topic: require('../index.js'),
      'should process same 2 variable stacked bar with different values': function (vg) {
        data = simplify('{"key":"","keys":[],"values":[{"key":"0","keys":[0],"index":0,"values":[{"data":{"x":0,"y":50,"c":0},"index":0},{"data":{"x":1,"y":37,"c":0},"index":2},{"data":{"x":2,"y":28,"c":0},"index":4},{"data":{"x":3,"y":11,"c":0},"index":6},{"data":{"x":4,"y":75,"c":0},"index":8},{"data":{"x":5,"y":4,"c":0},"index":10},{"data":{"x":6,"y":62,"c":0},"index":12},{"data":{"x":7,"y":11,"c":0},"index":14},{"data":{"x":8,"y":45,"c":0},"index":16},{"data":{"x":9,"y":41,"c":0},"index":18}]},{"key":"1","keys":[1],"index":1,"values":[{"data":{"x":0,"y":52,"c":1},"index":1},{"data":{"x":1,"y":61,"c":1},"index":3},{"data":{"x":2,"y":73,"c":1},"index":5},{"data":{"x":3,"y":97,"c":1},"index":7},{"data":{"x":4,"y":58,"c":1},"index":9},{"data":{"x":5,"y":41,"c":1},"index":11},{"data":{"x":6,"y":76,"c":1},"index":13},{"data":{"x":7,"y":37,"c":1},"index":15},{"data":{"x":8,"y":26,"c":1},"index":17},{"data":{"x":9,"y":22,"c":1},"index":19}]}]}');
        data = JSON.parse(data);
        ans = simplify('{"key":"","keys":[],"values":[{"key":"0","keys":[0],"index":0,"values":[{"data":{"x":0,"y":50,"c":0},"index":0,"y2":0,"y":50,"cy":25},{"data":{"x":1,"y":37,"c":0},"index":2,"y2":0,"y":37,"cy":18.5},{"data":{"x":2,"y":28,"c":0},"index":4,"y2":0,"y":28,"cy":14},{"data":{"x":3,"y":11,"c":0},"index":6,"y2":0,"y":11,"cy":5.5},{"data":{"x":4,"y":75,"c":0},"index":8,"y2":0,"y":75,"cy":37.5},{"data":{"x":5,"y":4,"c":0},"index":10,"y2":0,"y":4,"cy":2},{"data":{"x":6,"y":62,"c":0},"index":12,"y2":0,"y":62,"cy":31},{"data":{"x":7,"y":11,"c":0},"index":14,"y2":0,"y":11,"cy":5.5},{"data":{"x":8,"y":45,"c":0},"index":16,"y2":0,"y":45,"cy":22.5},{"data":{"x":9,"y":41,"c":0},"index":18,"y2":0,"y":41,"cy":20.5}]},{"key":"1","keys":[1],"index":1,"values":[{"data":{"x":0,"y":52,"c":1},"index":1,"y2":50,"y":102,"cy":76},{"data":{"x":1,"y":61,"c":1},"index":3,"y2":37,"y":98,"cy":67.5},{"data":{"x":2,"y":73,"c":1},"index":5,"y2":28,"y":101,"cy":64.5},{"data":{"x":3,"y":97,"c":1},"index":7,"y2":11,"y":108,"cy":59.5},{"data":{"x":4,"y":58,"c":1},"index":9,"y2":75,"y":133,"cy":104},{"data":{"x":5,"y":41,"c":1},"index":11,"y2":4,"y":45,"cy":24.5},{"data":{"x":6,"y":76,"c":1},"index":13,"y2":62,"y":138,"cy":100},{"data":{"x":7,"y":37,"c":1},"index":15,"y2":11,"y":48,"cy":29.5},{"data":{"x":8,"y":26,"c":1},"index":17,"y2":45,"y":71,"cy":58},{"data":{"x":9,"y":22,"c":1},"index":19,"y2":41,"y":63,"cy":52}]}]}');
        ans = JSON.parse(ans);
        test = vg.data.stack2(data);
        test.groupby(["data.x"]);
        test.sortby(["data.c"]);
        test.value("data.y");
        test(data);
        assert(compare(data,ans)===true);
      }
    },
    'reversed': {
      topic: require('../index.js'),
      'should process reversed 2 variable stacked bar': function (vg) {
        test4 = '{"key":"","keys":[],"values":[{"key":"0","keys":[0],"index":0,"values":[{"data":{"x":0,"y":28,"c":0},"index":0},{"data":{"x":1,"y":43,"c":0},"index":2},{"data":{"x":2,"y":81,"c":0},"index":4},{"data":{"x":3,"y":19,"c":0},"index":6},{"data":{"x":4,"y":52,"c":0},"index":8},{"data":{"x":5,"y":24,"c":0},"index":10},{"data":{"x":6,"y":87,"c":0},"index":12},{"data":{"x":7,"y":17,"c":0},"index":14},{"data":{"x":8,"y":68,"c":0},"index":16},{"data":{"x":9,"y":49,"c":0},"index":18}]},{"key":"1","keys":[1],"index":1,"values":[{"data":{"x":0,"y":55,"c":1},"index":1},{"data":{"x":1,"y":91,"c":1},"index":3},{"data":{"x":2,"y":53,"c":1},"index":5},{"data":{"x":3,"y":87,"c":1},"index":7},{"data":{"x":4,"y":48,"c":1},"index":9},{"data":{"x":5,"y":49,"c":1},"index":11},{"data":{"x":6,"y":66,"c":1},"index":13},{"data":{"x":7,"y":27,"c":1},"index":15},{"data":{"x":8,"y":16,"c":1},"index":17},{"data":{"x":9,"y":15,"c":1},"index":19}]}]}';
        test4A = '{"key":"","keys":[],"values":[{"key":"0","keys":[0],"index":0,"values":[{"data":{"x":0,"y":28,"c":0},"index":0,"y2":55,"y":83,"cy":69},{"data":{"x":1,"y":43,"c":0},"index":2,"y2":91,"y":134,"cy":112.5},{"data":{"x":2,"y":81,"c":0},"index":4,"y2":53,"y":134,"cy":93.5},{"data":{"x":3,"y":19,"c":0},"index":6,"y2":87,"y":106,"cy":96.5},{"data":{"x":4,"y":52,"c":0},"index":8,"y2":48,"y":100,"cy":74},{"data":{"x":5,"y":24,"c":0},"index":10,"y2":49,"y":73,"cy":61},{"data":{"x":6,"y":87,"c":0},"index":12,"y2":66,"y":153,"cy":109.5},{"data":{"x":7,"y":17,"c":0},"index":14,"y2":27,"y":44,"cy":35.5},{"data":{"x":8,"y":68,"c":0},"index":16,"y2":16,"y":84,"cy":50},{"data":{"x":9,"y":49,"c":0},"index":18,"y2":15,"y":64,"cy":39.5}]},{"key":"1","keys":[1],"index":1,"values":[{"data":{"x":0,"y":55,"c":1},"index":1,"y2":0,"y":55,"cy":27.5},{"data":{"x":1,"y":91,"c":1},"index":3,"y2":0,"y":91,"cy":45.5},{"data":{"x":2,"y":53,"c":1},"index":5,"y2":0,"y":53,"cy":26.5},{"data":{"x":3,"y":87,"c":1},"index":7,"y2":0,"y":87,"cy":43.5},{"data":{"x":4,"y":48,"c":1},"index":9,"y2":0,"y":48,"cy":24},{"data":{"x":5,"y":49,"c":1},"index":11,"y2":0,"y":49,"cy":24.5},{"data":{"x":6,"y":66,"c":1},"index":13,"y2":0,"y":66,"cy":33},{"data":{"x":7,"y":27,"c":1},"index":15,"y2":0,"y":27,"cy":13.5},{"data":{"x":8,"y":16,"c":1},"index":17,"y2":0,"y":16,"cy":8},{"data":{"x":9,"y":15,"c":1},"index":19,"y2":0,"y":15,"cy":7.5}]}]}';
        data = simplify(test4);
        data = JSON.parse(data);
        ans = simplify(test4A);
        ans = JSON.parse(ans);
        test = vg.data.stack2(data);
        test.groupby(["data.x"]);
        test.sortby(["-data.c"]);
        test.value("data.y");
        test(data);
        assert(compare(data,ans)===true);
      }
    },
    'centered': {
      topic: require('../index.js'),
      'should process silhouette (centered) 2 variable stacked bar': function (vg) {
        test5 = '{"key":"","keys":[],"values":[{"key":"0","keys":[0],"index":0,"values":[{"data":{"x":0,"y":28,"c":0},"index":0},{"data":{"x":1,"y":43,"c":0},"index":2},{"data":{"x":2,"y":81,"c":0},"index":4},{"data":{"x":3,"y":19,"c":0},"index":6},{"data":{"x":4,"y":52,"c":0},"index":8},{"data":{"x":5,"y":24,"c":0},"index":10},{"data":{"x":6,"y":87,"c":0},"index":12},{"data":{"x":7,"y":17,"c":0},"index":14},{"data":{"x":8,"y":68,"c":0},"index":16},{"data":{"x":9,"y":49,"c":0},"index":18}]},{"key":"1","keys":[1],"index":1,"values":[{"data":{"x":0,"y":55,"c":1},"index":1},{"data":{"x":1,"y":91,"c":1},"index":3},{"data":{"x":2,"y":53,"c":1},"index":5},{"data":{"x":3,"y":87,"c":1},"index":7},{"data":{"x":4,"y":48,"c":1},"index":9},{"data":{"x":5,"y":49,"c":1},"index":11},{"data":{"x":6,"y":66,"c":1},"index":13},{"data":{"x":7,"y":27,"c":1},"index":15},{"data":{"x":8,"y":16,"c":1},"index":17},{"data":{"x":9,"y":15,"c":1},"index":19}]}]}';
        test5A = '{"key":"","keys":[],"values":[{"key":"0","keys":[0],"index":0,"values":[{"data":{"x":0,"y":28,"c":0},"index":0,"y2":35,"y":63,"cy":49},{"data":{"x":1,"y":43,"c":0},"index":2,"y2":9.5,"y":52.5,"cy":31},{"data":{"x":2,"y":81,"c":0},"index":4,"y2":9.5,"y":90.5,"cy":50},{"data":{"x":3,"y":19,"c":0},"index":6,"y2":23.5,"y":42.5,"cy":33},{"data":{"x":4,"y":52,"c":0},"index":8,"y2":26.5,"y":78.5,"cy":52.5},{"data":{"x":5,"y":24,"c":0},"index":10,"y2":40,"y":64,"cy":52},{"data":{"x":6,"y":87,"c":0},"index":12,"y2":0,"y":87,"cy":43.5},{"data":{"x":7,"y":17,"c":0},"index":14,"y2":54.5,"y":71.5,"cy":63},{"data":{"x":8,"y":68,"c":0},"index":16,"y2":34.5,"y":102.5,"cy":68.5},{"data":{"x":9,"y":49,"c":0},"index":18,"y2":44.5,"y":93.5,"cy":69}]},{"key":"1","keys":[1],"index":1,"values":[{"data":{"x":0,"y":55,"c":1},"index":1,"y2":63,"y":118,"cy":90.5},{"data":{"x":1,"y":91,"c":1},"index":3,"y2":52.5,"y":143.5,"cy":98},{"data":{"x":2,"y":53,"c":1},"index":5,"y2":90.5,"y":143.5,"cy":117},{"data":{"x":3,"y":87,"c":1},"index":7,"y2":42.5,"y":129.5,"cy":86},{"data":{"x":4,"y":48,"c":1},"index":9,"y2":78.5,"y":126.5,"cy":102.5},{"data":{"x":5,"y":49,"c":1},"index":11,"y2":64,"y":113,"cy":88.5},{"data":{"x":6,"y":66,"c":1},"index":13,"y2":87,"y":153,"cy":120},{"data":{"x":7,"y":27,"c":1},"index":15,"y2":71.5,"y":98.5,"cy":85},{"data":{"x":8,"y":16,"c":1},"index":17,"y2":102.5,"y":118.5,"cy":110.5},{"data":{"x":9,"y":15,"c":1},"index":19,"y2":93.5,"y":108.5,"cy":101}]}]}';
        data = simplify(test5);
        data = JSON.parse(data);
        ans = simplify(test5A);
        ans = JSON.parse(ans);
        test = vg.data.stack2(data);
        test.groupby(["data.x"]);
        test.sortby(["data.c"]);
        test.value("data.y");
        test.offset('center');
        test(data);
        assert(compare(data,ans)===true);
      }
    },
    'normalized': {
      topic: require('../index.js'),
      'should process expanded (normalized) 2 variable stacked bar': function (vg) {
        test6 = '{"key":"","keys":[],"values":[{"key":"0","keys":[0],"index":0,"values":[{"data":{"x":0,"y":28,"c":0},"index":0},{"data":{"x":1,"y":43,"c":0},"index":2},{"data":{"x":2,"y":81,"c":0},"index":4},{"data":{"x":3,"y":19,"c":0},"index":6},{"data":{"x":4,"y":52,"c":0},"index":8},{"data":{"x":5,"y":24,"c":0},"index":10},{"data":{"x":6,"y":87,"c":0},"index":12},{"data":{"x":7,"y":17,"c":0},"index":14},{"data":{"x":8,"y":68,"c":0},"index":16},{"data":{"x":9,"y":49,"c":0},"index":18}]},{"key":"1","keys":[1],"index":1,"values":[{"data":{"x":0,"y":55,"c":1},"index":1},{"data":{"x":1,"y":91,"c":1},"index":3},{"data":{"x":2,"y":53,"c":1},"index":5},{"data":{"x":3,"y":87,"c":1},"index":7},{"data":{"x":4,"y":48,"c":1},"index":9},{"data":{"x":5,"y":49,"c":1},"index":11},{"data":{"x":6,"y":66,"c":1},"index":13},{"data":{"x":7,"y":27,"c":1},"index":15},{"data":{"x":8,"y":16,"c":1},"index":17},{"data":{"x":9,"y":15,"c":1},"index":19}]}]}';
        test6A = '{"key":"","keys":[],"values":[{"key":"0","keys":[0],"index":0,"values":[{"data":{"x":0,"y":28,"c":0},"index":0,"y2":0,"y":0.3373493975903614,"cy":0.1686746987951807},{"data":{"x":1,"y":43,"c":0},"index":2,"y2":0,"y":0.3208955223880597,"cy":0.16044776119402984},{"data":{"x":2,"y":81,"c":0},"index":4,"y2":0,"y":0.6044776119402985,"cy":0.30223880597014924},{"data":{"x":3,"y":19,"c":0},"index":6,"y2":0,"y":0.1792452830188679,"cy":0.08962264150943396},{"data":{"x":4,"y":52,"c":0},"index":8,"y2":0,"y":0.52,"cy":0.26},{"data":{"x":5,"y":24,"c":0},"index":10,"y2":0,"y":0.3287671232876712,"cy":0.1643835616438356},{"data":{"x":6,"y":87,"c":0},"index":12,"y2":0,"y":0.5686274509803921,"cy":0.28431372549019607},{"data":{"x":7,"y":17,"c":0},"index":14,"y2":0,"y":0.38636363636363635,"cy":0.19318181818181818},{"data":{"x":8,"y":68,"c":0},"index":16,"y2":0,"y":0.8095238095238095,"cy":0.40476190476190477},{"data":{"x":9,"y":49,"c":0},"index":18,"y2":0,"y":0.765625,"cy":0.3828125}]},{"key":"1","keys":[1],"index":1,"values":[{"data":{"x":0,"y":55,"c":1},"index":1,"y2":0.3373493975903614,"y":1,"cy":0.6686746987951807},{"data":{"x":1,"y":91,"c":1},"index":3,"y2":0.3208955223880597,"y":1,"cy":0.6604477611940298},{"data":{"x":2,"y":53,"c":1},"index":5,"y2":0.6044776119402985,"y":1,"cy":0.8022388059701492},{"data":{"x":3,"y":87,"c":1},"index":7,"y2":0.1792452830188679,"y":1,"cy":0.589622641509434},{"data":{"x":4,"y":48,"c":1},"index":9,"y2":0.52,"y":1,"cy":0.76},{"data":{"x":5,"y":49,"c":1},"index":11,"y2":0.3287671232876712,"y":1,"cy":0.6643835616438356},{"data":{"x":6,"y":66,"c":1},"index":13,"y2":0.5686274509803921,"y":1,"cy":0.7843137254901961},{"data":{"x":7,"y":27,"c":1},"index":15,"y2":0.38636363636363635,"y":1,"cy":0.6931818181818181},{"data":{"x":8,"y":16,"c":1},"index":17,"y2":0.8095238095238095,"y":1,"cy":0.9047619047619048},{"data":{"x":9,"y":15,"c":1},"index":19,"y2":0.765625,"y":1,"cy":0.8828125}]}]}';
        data = simplify(test6);
        data = JSON.parse(data);
        ans = simplify(test6A);
        ans = JSON.parse(ans);
        test = vg.data.stack2(data);
        test.groupby(["data.x"]);
        test.sortby(["data.c"]);
        test.value("data.y");
        test.offset("normalize");
        test(data);
        assert(compare(data,ans)===true);
      }
    },
    'centered, reversed': {
      topic: require('../index.js'),
      'should process centered and reversed 2 variable stacked bar': function (vg) {
        test7 = '{"key":"","keys":[],"values":[{"key":"0","keys":[0],"index":0,"values":[{"data":{"x":0,"y":28,"c":0},"index":0},{"data":{"x":1,"y":43,"c":0},"index":2},{"data":{"x":2,"y":81,"c":0},"index":4},{"data":{"x":3,"y":19,"c":0},"index":6},{"data":{"x":4,"y":52,"c":0},"index":8},{"data":{"x":5,"y":24,"c":0},"index":10},{"data":{"x":6,"y":87,"c":0},"index":12},{"data":{"x":7,"y":17,"c":0},"index":14},{"data":{"x":8,"y":68,"c":0},"index":16},{"data":{"x":9,"y":49,"c":0},"index":18}]},{"key":"1","keys":[1],"index":1,"values":[{"data":{"x":0,"y":55,"c":1},"index":1},{"data":{"x":1,"y":91,"c":1},"index":3},{"data":{"x":2,"y":53,"c":1},"index":5},{"data":{"x":3,"y":87,"c":1},"index":7},{"data":{"x":4,"y":48,"c":1},"index":9},{"data":{"x":5,"y":49,"c":1},"index":11},{"data":{"x":6,"y":66,"c":1},"index":13},{"data":{"x":7,"y":27,"c":1},"index":15},{"data":{"x":8,"y":16,"c":1},"index":17},{"data":{"x":9,"y":15,"c":1},"index":19}]}]}';
        test7A = '{"key":"","keys":[],"values":[{"key":"0","keys":[0],"index":0,"values":[{"data":{"x":0,"y":28,"c":0},"index":0,"y2":90,"y":118,"cy":104},{"data":{"x":1,"y":43,"c":0},"index":2,"y2":100.5,"y":143.5,"cy":122},{"data":{"x":2,"y":81,"c":0},"index":4,"y2":62.5,"y":143.5,"cy":103},{"data":{"x":3,"y":19,"c":0},"index":6,"y2":110.5,"y":129.5,"cy":120},{"data":{"x":4,"y":52,"c":0},"index":8,"y2":74.5,"y":126.5,"cy":100.5},{"data":{"x":5,"y":24,"c":0},"index":10,"y2":89,"y":113,"cy":101},{"data":{"x":6,"y":87,"c":0},"index":12,"y2":66,"y":153,"cy":109.5},{"data":{"x":7,"y":17,"c":0},"index":14,"y2":81.5,"y":98.5,"cy":90},{"data":{"x":8,"y":68,"c":0},"index":16,"y2":50.5,"y":118.5,"cy":84.5},{"data":{"x":9,"y":49,"c":0},"index":18,"y2":59.5,"y":108.5,"cy":84}]},{"key":"1","keys":[1],"index":1,"values":[{"data":{"x":0,"y":55,"c":1},"index":1,"y2":35,"y":90,"cy":62.5},{"data":{"x":1,"y":91,"c":1},"index":3,"y2":9.5,"y":100.5,"cy":55},{"data":{"x":2,"y":53,"c":1},"index":5,"y2":9.5,"y":62.5,"cy":36},{"data":{"x":3,"y":87,"c":1},"index":7,"y2":23.5,"y":110.5,"cy":67},{"data":{"x":4,"y":48,"c":1},"index":9,"y2":26.5,"y":74.5,"cy":50.5},{"data":{"x":5,"y":49,"c":1},"index":11,"y2":40,"y":89,"cy":64.5},{"data":{"x":6,"y":66,"c":1},"index":13,"y2":0,"y":66,"cy":33},{"data":{"x":7,"y":27,"c":1},"index":15,"y2":54.5,"y":81.5,"cy":68},{"data":{"x":8,"y":16,"c":1},"index":17,"y2":34.5,"y":50.5,"cy":42.5},{"data":{"x":9,"y":15,"c":1},"index":19,"y2":44.5,"y":59.5,"cy":52}]}]}';
        data = simplify(test7);
        data = JSON.parse(data);
        ans = simplify(test7A);
        ans = JSON.parse(ans);
        test = vg.data.stack2(data);
        test.groupby(["data.x"]);
        test.sortby(["-data.c"]);
        test.value("data.y");
        test.offset("center");
        test(data);
        assert(compare(data,ans)===true);
      }
    },
    'normalized reversed': {
      topic: require('../index.js'),
      'should process normalized and reversed 2 variable stacked bar': function (vg) {
        test8 = '{"key":"","keys":[],"values":[{"key":"0","keys":[0],"index":0,"values":[{"data":{"x":0,"y":28,"c":0},"index":0},{"data":{"x":1,"y":43,"c":0},"index":2},{"data":{"x":2,"y":81,"c":0},"index":4},{"data":{"x":3,"y":19,"c":0},"index":6},{"data":{"x":4,"y":52,"c":0},"index":8},{"data":{"x":5,"y":24,"c":0},"index":10},{"data":{"x":6,"y":87,"c":0},"index":12},{"data":{"x":7,"y":17,"c":0},"index":14},{"data":{"x":8,"y":68,"c":0},"index":16},{"data":{"x":9,"y":49,"c":0},"index":18}]},{"key":"1","keys":[1],"index":1,"values":[{"data":{"x":0,"y":55,"c":1},"index":1},{"data":{"x":1,"y":91,"c":1},"index":3},{"data":{"x":2,"y":53,"c":1},"index":5},{"data":{"x":3,"y":87,"c":1},"index":7},{"data":{"x":4,"y":48,"c":1},"index":9},{"data":{"x":5,"y":49,"c":1},"index":11},{"data":{"x":6,"y":66,"c":1},"index":13},{"data":{"x":7,"y":27,"c":1},"index":15},{"data":{"x":8,"y":16,"c":1},"index":17},{"data":{"x":9,"y":15,"c":1},"index":19}]}]}';
        test8A = '{"key":"","keys":[],"values":[{"key":"0","keys":[0],"index":0,"values":[{"data":{"x":0,"y":28,"c":0},"index":0,"y2":0.6626506024096386,"y":1,"cy":0.8313253012048193},{"data":{"x":1,"y":43,"c":0},"index":2,"y2":0.6791044776119403,"y":1,"cy":0.8395522388059701},{"data":{"x":2,"y":81,"c":0},"index":4,"y2":0.39552238805970147,"y":1,"cy":0.6977611940298507},{"data":{"x":3,"y":19,"c":0},"index":6,"y2":0.8207547169811321,"y":1,"cy":0.9103773584905661},{"data":{"x":4,"y":52,"c":0},"index":8,"y2":0.48,"y":1,"cy":0.74},{"data":{"x":5,"y":24,"c":0},"index":10,"y2":0.6712328767123288,"y":1,"cy":0.8356164383561644},{"data":{"x":6,"y":87,"c":0},"index":12,"y2":0.43137254901960786,"y":1,"cy":0.7156862745098039},{"data":{"x":7,"y":17,"c":0},"index":14,"y2":0.6136363636363636,"y":1,"cy":0.8068181818181819},{"data":{"x":8,"y":68,"c":0},"index":16,"y2":0.19047619047619047,"y":1,"cy":0.5952380952380952},{"data":{"x":9,"y":49,"c":0},"index":18,"y2":0.234375,"y":1,"cy":0.6171875}]},{"key":"1","keys":[1],"index":1,"values":[{"data":{"x":0,"y":55,"c":1},"index":1,"y2":0,"y":0.6626506024096386,"cy":0.3313253012048193},{"data":{"x":1,"y":91,"c":1},"index":3,"y2":0,"y":0.6791044776119403,"cy":0.33955223880597013},{"data":{"x":2,"y":53,"c":1},"index":5,"y2":0,"y":0.39552238805970147,"cy":0.19776119402985073},{"data":{"x":3,"y":87,"c":1},"index":7,"y2":0,"y":0.8207547169811321,"cy":0.41037735849056606},{"data":{"x":4,"y":48,"c":1},"index":9,"y2":0,"y":0.48,"cy":0.24},{"data":{"x":5,"y":49,"c":1},"index":11,"y2":0,"y":0.6712328767123288,"cy":0.3356164383561644},{"data":{"x":6,"y":66,"c":1},"index":13,"y2":0,"y":0.43137254901960786,"cy":0.21568627450980393},{"data":{"x":7,"y":27,"c":1},"index":15,"y2":0,"y":0.6136363636363636,"cy":0.3068181818181818},{"data":{"x":8,"y":16,"c":1},"index":17,"y2":0,"y":0.19047619047619047,"cy":0.09523809523809523},{"data":{"x":9,"y":15,"c":1},"index":19,"y2":0,"y":0.234375,"cy":0.1171875}]}]}';
        data = simplify(test8);
        data = JSON.parse(data);
        ans = simplify(test8A);
        ans = JSON.parse(ans);
        test = vg.data.stack2(data);
        test.groupby(["data.x"]);
        test.sortby(["-data.c"]);
        test.value("data.y");
        test.offset("normalize");
        test(data);
        assert(compare(data,ans)===true);
      }
    },    
})
;
suite.export(module);