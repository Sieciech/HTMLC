function HTMLC_setColor(func)
{
  //console.log('func', func);
  var rules = [];
  /**/
  var all = document.getElementsByTagName('*');
  for(var i=0; i<all.length; i++)
  {
    var a = all[i];
    if(a.hasAttribute('style'))
    {
      rules.push({
        style: a.style,
        selectorText: '(inline style)',
      });
    }
  }
  /**/
  if(document.styleSheets.length > 0)
  {
    for(var i=0; i<document.styleSheets.length; i++)
    {
      var key = document.styleSheets[i].rules?'rules':'cssRules';
      var classes = document.styleSheets[i][key];
      //console.log(classes.length, !classes.length, classes);
      if(classes == null)
        continue;
      for(var x=0; x<classes.length; x++)
      {
        rules.push(classes[x]);
      }
    }
  }
  var atts = ['border', 'outline', 'background', 'color', 'text-shadow', 'box-shadow'];
  //console.log('rules', rules);
  for(var i=0; i<rules.length; i++)
  {
    //console.log(rules[i]);
    var rule = rules[i];
    if(!rule.ostyle)
      rule.ostyle = {};
    for(var j=0; j<atts.length; j++)
    {

      if(typeof(rule) == 'undefined' || typeof(rule.style) == 'undefined' || typeof(rule.style[atts[j]]) == 'undefined')
        continue;
      var v = rule.style[atts[j]];
      if(rule.ostyle[atts[j]])
        var v = rule.ostyle[atts[j]];
      if(v == false || v == null || v.length == 0)
        continue;
      if(!rule.ostyle[atts[j]])
        rule.ostyle[atts[j]] = rule.style[atts[j]];
      var from = v;
      var clrs = getColors(v);
      for(var k=0; k<clrs.length; k++)
      {
        var clr = clrs[k];
        var c = func(clr);
        if(c.a == 1)
          var v = HTMLC_putColor(v, clr.text, 'rgb('+c.r+', '+c.g+', '+c.b+')');
        else
          var v = HTMLC_putColor(v, clr.text, 'rgba('+c.r+', '+c.g+', '+c.b+', '+c.a+')');
      }
      //console.log(rule.selectorText, atts[j], [from, v], clrs);
      rule.style[atts[j]] = v;
    }
  }
};
function HTMLC_putColor(str, a, b)
{
  if(str.indexOf(a) > -1)
    var str = str.replace(a, b);
  return str;
};
function hexdec(h)
{
  return parseInt(h, 16);
}
function getColors(m)
{
  var clrs = [];
  var a = m.match(/\#([0-9a-fA-F]{3})([^0-9A-Fa-f]|$)/mig);
  if(a)
  {
    for(var i=0; i<a.length; i++)
      clrs.push({text:a[i].substr(0, 4), r:hexdec(a[i].substr(1,1))*16, g:hexdec(a[i].substr(2,1))*16, b:hexdec(a[i].substr(3,1))*16});
  }
  var a = m.match(/\#([0-9a-fA-F]{6})([^0-9A-Fa-f]|$)/mig);
  if(a)
  {
    for(var i=0; i<a.length; i++)
      clrs.push({text:a[i].substr(0, 7), r:hexdec(a[i].substr(1,2)), g:hexdec(a[i].substr(3,2)), b:hexdec(a[i].substr(5,2))});
  }
  var a = m.match(/rgb\(\s{0,}([0-9]{1,3})\s{0,},\s{0,}([0-9]{1,3})\s{0,},\s{0,}([0-9]{1,3})\s{0,}\)/mig);
  if(a)
  {
    for(var i=0; i<a.length; i++)
    {
      var plain = a[i];
      while(plain.match(/[^0-9,.]/))
        var plain = plain.replace(/[^0-9,.]/, '');
      var c = plain.split(',');
      clrs.push({text:a[i], r:parseInt(c[0]), g:parseInt(c[1]), b:parseInt(c[2])});
    }
  }
  var a = m.match(/rgba\(\s{0,}([0-9]{1,3})\s{0,},\s{0,}([0-9]{1,3})\s{0,},\s{0,}([0-9]{1,3})\s{0,},\s{0,}([0-9.]{1,})\s{0,}\)/mig);
  if(a)
  {
    for(var i=0; i<a.length; i++)
    {
      var plain = a[i];
      while(plain.match(/[^0-9,.]/))
        var plain = plain.replace(/[^0-9,.]/, '');
      var c = plain.split(',');
      clrs.push({text:a[i], r:parseInt(c[0]), g:parseInt(c[1]), b:parseInt(c[2]), a:parseFloat(c[3])});
    }
  }
  return clrs;
};
function onHTMLload()
{
  if(document.readyState != 'complete')
    return setTimeout(onHTMLload, 100);
  setTimeout(function()
  {
    HTMLC_setColor(HTMLC_func);
  }, 2000);
};
//HTMLC_func = HTMLC_color_invert;
//onHTMLload();

