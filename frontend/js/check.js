$(function(){
  var ex_show = $('.ex_show');
  var ex_hide = $('.ex_hide');
  var ex_box = $('.ex_box');
  var ex_show2 = $('.ex_show2');
  var ex_hide2 = $('.ex_hide2');
  var ex_box2 = $('.ex_box2');
  var ex_show3 = $('.ex_show3');
  var ex_hide3 = $('.ex_hide3');
  var ex_box3 = $('.ex_box3');
  ex_show.click(function(){
    ex_box.fadeIn();
  });
  ex_hide.click(function(){
    ex_box.fadeOut();
  });
  ex_show2.click(function(){
    ex_box2.fadeIn();
  });
  ex_hide2.click(function(){
    ex_box2.fadeOut();
  ex_show3.click(function(){
    ex_box3.fadeIn();
  });
  ex_hide3.click(function(){
    ex_box3.fadeOut();
  });
  });
});