$(function() {

    $( "#login_auth" ).submit(function( event ) {

        
        
        if($( "#register_password" ).val() != $( "#register_pass_confirm" ).val()){

            alert( "Password doesn't match!" );
            event.preventDefault();
        }
      });
});