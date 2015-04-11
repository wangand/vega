vg.data.stack2 = function() {
  var groupby = null,
      sortby = null,
      value = vg.accessor("data"),
      offset = "zero",
      output = {
        "start": vg.mutator("y2"),
        "stop": vg.mutator("y"),
        "mid": vg.mutator("cy")
      };

  function stack(data) {    
    // partition, sum, and sort the stack groups
    var groups = group(data);

    // compute stack layouts per group
    for (var i=0; i<groups.length; ++i) {
      layout(groups[i], groups.max);
    }

    return data;
  }

  function group(data) {
    var groups = [],
        map, i, x, k, g, s, max;

    // partition data points into stack groups
    if (groupby == null) {
      groups.push(data.slice());
    } else {
      for (map={}, i=0; i<data.length; ++i) {
        x = data[i];
        k = (groupby.map(function(f) { return f(x); }));
        g = map[k] || (groups.push(map[k] = []), map[k]);
        g.push(x);
      }
    }

    // compute sums of groups, sort groups as needed
    for (k=0, max=0; k<groups.length; ++k) {
      g = groups[k];
      for (i=0, s=0; i<g.length; ++i) {
        s += value(g[i]);
      }
      g.sum = s;
      if (s > max) max = s;
      if (sortby != null) g.sort(sortby);
    }
    groups.max = max;

    return groups;
  }

  function layout(group, max) {
    var val = Array(group.length),
        sum = group.sum,
        off = offset==="center" ? (max - sum)/2 : 0,
        scale = offset==="normalize" ? (1/sum) : 1,
        i, x, a, b = off, v = 0;

    // set stack coordinates for each datum in group
    for (i=0; i<group.length; ++i) {
      x = group[i];
      a = b; // use previous value for start point
      v += value(x);
      b = scale * v + off; // compute end point
      output.start(x, a);
      output.stop(x, b);
      output.mid(x, 0.5 * (a + b));
    }
  }

  // Transform Parameters

  stack.groupby = function(fields) {
    groupby = fields == null ? null : vg.array(fields).map(vg.accessor);
    return stack;
  };

  stack.sortby = function(fields) {
    sortby = fields == null ? null : vg.comparator(fields);
    return stack;
  };

  stack.value = function(field) {
    value = vg.accessor(field);
    return stack;
  };

  stack.offset = function(off) {
    switch (off) {
      case 'center':
      case 'normalize':
        offset = off;
        break;
      default:
        offset = 'zero';
    }
    return stack;
  };

  stack.output = function(map) {
    vg.keys(output).forEach(function(k) {
      if (map[k] != null) {
        output[k] = vg.mutator(map[k]);
      }
    });
    return stack;
  };

  return stack;
};