$(document).ready(loadHeaderAndFooter);

function loadHeaderAndFooter()
{
    $("body").prepend("<div class=\"header\"></div>");
    $("body").append("<div class=\"footer\"></div>");
    $(".header").load("/header.htm"); 
    $(".footer").load("/footer.htm"); 
    
    $('.moreless').each(function(i, obj)
    {
        $("<p></p>").insertBefore($(obj));
        $("<div class=\"morelesslink\"><img class=\"morelessimage\" src=\"/more.png\" align=\"absmiddle\" />&nbsp;<span class=\"morelesstext\">Show more</span></div>").appendTo($(obj).prev());
        $(obj).hide();
    });
    $('.morelesslink').each(function(i, obj)
    {
        $(obj).click(function()
        {
            moreless = $(obj).parent("p").next();
            if ($(moreless).is(':visible'))
            {
                $(moreless).hide();
                $(obj).find("img").attr("src", "/more.png");
                $(obj).find("span").text("Show more");
            }
            else
            {
                $(moreless).show();
                $(obj).find("img").attr("src", "/less.png");
                $(obj).find("span").text("Show less");
            }
        }); 
    });
}
