({
  // Your renderer method overrides go here
  afterRender: function (component, event, helper) {
    var canvas = component.find("canvas").getElement();
    var ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.arc(17, 10, 5, 0, Math.PI * 2, true);
    ctx.rect(25, 8, 5, 1);
    ctx.rect(32, 8, 5, 1);
    ctx.rect(39, 8, 5, 1);
    ctx.rect(46, 8, 5, 1);
    ctx.rect(53, 8, 5, 1);
    ctx.rect(60, 8, 5, 1);
    ctx.rect(67, 8, 5, 1);
    ctx.rect(74, 8, 5, 1);
    ctx.rect(81, 8, 5, 1);
    ctx.rect(88, 8, 5, 1);
    ctx.rect(95, 8, 5, 1);
    ctx.rect(102, 8, 3, 1);
    ctx.arc(112, 10, 5, 0, Math.PI * 2, true);
    ctx.rect(117, 8, 2, 1);
    ctx.rect(122, 8, 5, 1);
    ctx.rect(129, 8, 5, 1);
    ctx.rect(136, 8, 5, 1);
    ctx.rect(143, 8, 5, 1);
    ctx.rect(150, 8, 5, 1);
    ctx.rect(157, 8, 5, 1);
    ctx.rect(164, 8, 5, 1);
    ctx.rect(171, 8, 5, 1);
    ctx.rect(178, 8, 5, 1);
    ctx.arc(190, 10, 5, 0, Math.PI * 2, true);
    ctx.rect(195, 8, 10, 0);
    ctx.rect(200, 8, 5, 1);
    ctx.rect(207, 8, 5, 1);
    ctx.rect(214, 8, 5, 1);
    ctx.rect(221, 8, 5, 1);
    ctx.rect(228, 8, 5, 1);
    ctx.rect(235, 8, 5, 1);
    ctx.rect(242, 8, 5, 1);
    ctx.rect(249, 8, 5, 1);
    ctx.rect(256, 8, 5, 1);
    ctx.rect(263, 8, 5, 1);
    ctx.rect(270, 8, 5, 1);
    ctx.rect(277, 8, 2, 1);
    ctx.arc(284, 10, 5, 0, Math.PI * 2, true);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
  }
});