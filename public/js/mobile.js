delete Hammer.defaults.cssProps.userSelect;
// create a simple instance
// by default, it only adds horizontal recognizers

if(OSName != "Windows"){
    
    var sideBar = new Hammer(document.getElementById('gestureDetection'));
    sideBar.add( new Hammer.Tap({ event: 'singletap' }) );

    // let the pan gesture support all directions.
    // this will block the vertical scrolling on a touch-device while on the element

    // listen to events...

    sideBar.on("swiperight", function(ev) {
            if($(".navbar-expand-sm .navbar-toggler").css("display") != "none"){
                if(!$("#wrapper").hasClass( "toggled" )){
                    $("#wrapper").toggleClass("toggled");
                }
            // if($("#wrapper").hasClass( "toggled" )){
            //     $("#wrapper").toggleClass("toggled");
            // }

            }
    });
    sideBar.on("swipeleft", function(ev) {
            if($(".navbar-expand-sm .navbar-toggler").css("display") != "none"){
                if($("#wrapper").hasClass( "toggled" )){
                    $("#wrapper").toggleClass("toggled");
                }
            // if($("#wrapper").hasClass( "toggled" )){
            //     $("#wrapper").toggleClass("toggled");
            // }

        }
    });
    // console.log($("page-content-wrapper").data("hammer"));
    // $(document).ready(function(){
    //     $("page-content-wrapper").on("singletap", function(){
    //         console.log("crazy");
    //     });

    // });
    Hammer(document.getElementById('sidebar-wrapper')).on("swipeleft", function() {
        if($(".navbar-expand-sm .navbar-toggler").css("display") != "none"){
            if($("#wrapper").hasClass( "toggled" )){
                $("#wrapper").toggleClass("toggled");
            }
        }
    });
    Hammer(document.getElementById('page-content')).on("tap", function() {
        if($(".navbar-expand-sm .navbar-toggler").css("display") != "none"){
            if($("#wrapper").hasClass( "toggled" )){
                $("#wrapper").toggleClass("toggled");
            }
        }
    });
    // Hammer(document.getElementById('menu-toggle')).on("tap", function() {
    //     if($(".navbar-expand-sm .navbar-toggler").css("display") != "none")
    //         $("#wrapper").toggleClass("toggled");
    // });
    // Hammer(document.getElementById('mobileNav_home')).on("tap", function() {
    //     window.location.replace("index.html");
    // });
    // Hammer(document.getElementById('mobileNav_projects')).on("tap", function() {
    //     window.location.replace("projects.html");
    // });
    // Hammer(document.getElementById('mobileNav_gallery')).on("tap", function() {
    //     window.location.replace("gallery.html");
    // });
}
