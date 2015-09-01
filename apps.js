$(document).ready(loadHeaderAndFooter);

function loadHeaderAndFooter()
{
    // adds header and footer to all pages
    $("body").prepend("<div id=\"header\"></div>");
    $("#header").load("/header.htm"); 
    $("body").append("<div id=\"footer\"></div>");
    $("#footer").load("/footer.htm"); 
    
    // adds support for more-less links
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
