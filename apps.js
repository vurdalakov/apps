$(document).ready(loadHeaderAndFooter);

function loadHeaderAndFooter()
{
    // adds header and footer to all pages
    $("body").prepend("<div class=\"header\"></div>");
    $("body").append("<div class=\"footer\"></div>");
    $(".header").load("/header.htm"); 
    $(".footer").load("/footer.htm"); 
    
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
    
    // adds "Fork me on GitHub" images to all pages
    $("body").append("<a href=\"https://github.com/vurdalakov/apps\"><img style=\"position: absolute; top: 0; right: 0; border: 0;\" src=\"https://camo.githubusercontent.com/a6677b08c955af8400f44c6298f40e7d19cc5b2d/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f677261795f3664366436642e706e67\" alt=\"Fork me on GitHub\" data-canonical-src=\"https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png\"></a>");
}
