jQuery(function ($) {
    
    //for AES olgo input field with OR
    $('textarea[name=AES_plaintext]').on('input', function () {
        $("#AES_file").prop('required', !$(this).val().length);
    });
    $("#AES_file").change(function (){
        $("#AES_plaintext").prop('required', !$(this).val().length);
    });
    $('textarea[name=AES_keyPlain]').on('input', function () {
        $("#AES_key").prop('required', !$(this).val().length);
    });
    $("#AES_key").change(function (){
        $("#AES_keyPlain").prop('required', !$(this).val().length);
    });
});
function isHex(h) {
    h = h.split(' ');
    h = h.join('');
    var a = parseInt(h,16);
    return (a.toString(16) ===h.toLowerCase())
}
function generateDownloadLink(parent, path) {
//  <a href="temp/test.txt" target="_blank" download>Download</a>
    let html_text = "<a href=\""+path+"\" target=\"_blank\" download><h5 class=\"border rounded\" style = \"background-color: #e0e0eb;\">";              // Create text with HTML    
    let fileName = path.slice(path.lastIndexOf("/")+1);
    html_text+=fileName + "</h5></a>";
    //var fileName  = $("<p></p>").text("Text.");  // Create text with jQuery
    $(parent).append(html_text);     // Append new element
}
function formatText(text, keySize, type) {

    if(type == "hex"){
        let textArray = text.split(' ');
        text = textArray.join('');
        let splitedText = text.match(/[\s\S]{1,2}/g) || [];
        splitedText = splitedText.slice(0, keySize);
        let formatedText = splitedText.join(' ');
        return formatedText;
    }else  if(type == "UTF-8"){
        let textArray = text.split(' ');
        text = textArray.join('');
        let splitedText = text.match(/[\s\S]{1,1}/g) || [];
        splitedText = splitedText.slice(0, keySize);
        let formatedText = splitedText.join(' ');
        return formatedText;
    }
    return text;
}
var swipeRightExec = false;
function loadBackgroundCode(path){
    $("#div1").load("demo_test.txt");
}
$(document).ready(function(){

    
    // Prism.highlightAll();
    //$( "#loadBackgroundCode" ).addClass( "language-javascript" );
    // $( "" ).on( "swiperight",  function() {
    //     swipeRightExec = true;
    //     if(!$("#wrapper").hasClass( "toggled" ) && $(".navbar-expand-lg .navbar-toggler").css("display") != "none"){
    //         $("#wrapper").toggleClass("toggled");
            
    //         return false;
    //     }
    // } );
    // $( "#sidebar-wrapper" ).on( "swipeleft",  function() {
    //     swipeRightExec = true;
    //     if($("#wrapper").hasClass( "toggled" ) && $(".navbar-expand-lg .navbar-toggler").css("display") != "none"){
    //         $("#wrapper").toggleClass("toggled");
            
    //         return false;
    //     }
    // } );
    $(window).resize( function(){
        if($(".navbar-expand-sm .navbar-toggler").css("display") == "none"){
            if($("#wrapper").hasClass( "toggled" )){
                $("#wrapper").toggleClass("toggled");
            }
        }
    });
    $("#page-content-wrapper").click(function() {
        if(!swipeRightExec)
        if($("#wrapper").hasClass( "toggled" ) && $(".navbar-expand-sm .navbar-toggler").css("display") != "none"){
            $("#wrapper").toggleClass("toggled");
        }
        swipeRightExec = false;
      });
    
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
        return false;
    });
    $('textarea[name=AES_keyPlain]').on('paste', function(event) {
        let parse = $('input[name=checkPARSE]').is(":checked");
        let codingType = $('input[name=checkTYPE]:checked').val();
        let keySize = $('select[name=keySize]').val();
        keySize /= 8;
        if(parse){
            if(codingType == "hex"){
                let toCheck = event.originalEvent.clipboardData.getData('text');
                if(!isHex(toCheck)){
                    alert("Text in clipboard is not hex! " + toCheck.slice(0, 6) + "..."  );
                    return false;
                }
                $(this).replaceSelectedText(toCheck);
                let formatedText = formatText($(this).val(), keySize, codingType);
                $(this).val(formatedText);

                return false;
            }else if(codingType == "UTF-8"){
                $(this).replaceSelectedText(event.originalEvent.clipboardData.getData('text'));
                let formatedText = formatText($(this).val(), keySize, codingType);
                $(this).val(formatedText).slice(0, keySize * 2);
            } 
        }else{
            if(codingType == "hex"){
                let toCheck = event.originalEvent.clipboardData.getData('text');
                if(!isHex(toCheck)){
                    alert("Text in clipboard is not hex! " + toCheck.slice(0, 6) + "..."  );
                    return false;
                }
                $(this).replaceSelectedText(toCheck);
                let formatedText = $(this).val().slice(0, keySize * 2);

                } else if(codingType == "UTF-8"){
                    $(this).replaceSelectedText(event.originalEvent.clipboardData.getData('text'));
                    let formatedText = $(this).val().slice(0, keySize);
                    $(this).val(formatedText);
                    return false;
            }
        }
    });

    $('textarea[name=AES_keyPlain]')
    .on('keypress', function (event) {
        if(event.which === 13)return false;
        console.log(event);
        let textarea = $(this),
        text = textarea.val();
        
        let parse = $('input[name=checkPARSE]').is(":checked");
        let codingType = $('input[name=checkTYPE]:checked').val();

        let keySize = $('select[name=keySize]').val();
        keySize /= 8;
        if(parse){
            if(codingType == "hex"){
                var re = /[0-9A-Fa-f]{6}/g;
                let typedChar = String.fromCharCode(event.which);
                if(!isHex(typedChar))return false;
                let tempSelection = $(this).getSelection();
                text = text.slice(0, tempSelection.start) + typedChar + text.slice(tempSelection.end);
                text = formatText(text, keySize, codingType);
                textarea.val(text);
                $(this).setSelection(tempSelection.start + ((text.length % 3 == 1)? 2 : 1),tempSelection.start + ((text.length % 3 == 1)? 2 : 1));
                return false;
            }else  if(codingType == "UTF-8"){
                let typedChar = String.fromCharCode(event.which);
                let tempSelection = $(this).getSelection();
                text = text.slice(0, tempSelection.start) + typedChar + text.slice(tempSelection.end);
                text = formatText(text, keySize, codingType);
                textarea.val(text);
                $(this).setSelection(tempSelection.start + ((text.length % 2 == 1)? 2 : 1),tempSelection.start + ((text.length % 2 == 1)? 2 : 1));
                return false;
            }
        }else{
            if(codingType == "hex"){
                var re = /[0-9A-Fa-f]{6}/g;
                let typedChar = String.fromCharCode(event.which);
                if(!isHex(typedChar))return false;
                // let tempSelection = $(this).getSelection();
                // text = text.slice(0, tempSelection.start) + typedChar + text.slice(tempSelection.end);
                // text = text.slice(0, keySize * 2);
                // textarea.val(text);
                // $(this).setSelection(tempSelection.start + 1, tempSelection.start + 1);
                // return false;
            }else  if(codingType == "UTF-8"){
                // let typedChar = String.fromCharCode(event.which);
                // let tempSelection = $(this).getSelection();
                // text = text.slice(0, tempSelection.start) + typedChar + text.slice(tempSelection.end);
                // text = text.slice(0, keySize);
                // textarea.val(text);
                // $(this).setSelection(tempSelection.start + 1, tempSelection.start + 1);
                // return false;
            } 
        }




    });
    $('textarea[name=AES_plaintext]').on('paste', function(event) {
        if($('input[name=AES_sypher_type]:checked').val() == 'desypher'){
            let toCheck = event.originalEvent.clipboardData.getData('text');
            if(!isHex(toCheck)){
                alert("Text in clipboard is not hex! " + toCheck.slice(0, 6) + "..."  );
                return false;
            }
        }
    });
    $('textarea[name=AES_plaintext]')
    .on('keypress', function (event){
       
        if($('input[name=AES_sypher_type]:checked').val() == 'desypher'){
            let re = /[0-9A-Fa-f]{6}/g;
            let typedChar = String.fromCharCode(event.which);
            if(!isHex(typedChar))return false;

            
            // let tempSelection = $(this).getSelection();
            // text = text.slice(0, tempSelection.start) + typedChar + text.slice(tempSelection.end);
            // text = text.slice(0, keySize * 2);
            // textarea.val(text);
            // $(this).setSelection(tempSelection.start + 1, tempSelection.start + 1);
            // return false;
        }

    });


    $('input[type=radio][name=AES_sypher_type]').change(function() {
        if (this.value == 'sypher') {
            $("#AES_type_text").text("encrypt:");
            $("#infoAESinput").text("Input must be UTF-8 encoding or any file");

            $('#AES_file').attr("accept", "");


        }
        else if (this.value == 'desypher') {
            $("#AES_type_text").text("decrypt:");
            $("#infoAESinput").text("Input must be HEX encoding or .txt file with HEX string");
            
            let text =  $('textarea[name=AES_plaintext]').val();
            if(!isHex(text)) $('textarea[name=AES_plaintext]').val("");

            $('#AES_file').attr("accept", ".txt");


        }

    });
    $('[data-toggle="popover"]').popover();  
    // $("#uploadForm").submit(function(form){
    //     form.preventDefault();
    // });
    $("#AES_form_submit").submit(function(form){
        //form.preventDefault();
       
        //visa logika tikrinimui ir algoritmu kvietimui eina cia
        
        // var data = {};
        // data.AES_sypher_type = $("#AES_sypher_type").val();
        // data.AES_files = [];
        // for (var i = 0; i < $("#AES_file").get(0).files.length; ++i) {
        //     data.AES_files.push($("#AES_file").get(0).files[i]);
        // }
        // data.AES_plaintext = $("#AES_plaintext").val();
        // data.AES_key = $("#AES_key");
        // data.AES_keyPlain = $("#AES_keyPlain").val();
        // data.keySize = $("#keySize").val();
        
        // $.ajax({
        //     type: 'POST',
        //     data: JSON.stringify(data),
        //     contentType: 'application/json',
        //     url: 'http://localhost:3000/endpoint',						
        //     success: function(data) {
        //         console.log('success');
        //         console.log(JSON.stringify(data));
        //     }
        // });

        // var test = {};
        // test.sampleFile = [];
        // test.sampleFile = data.AES_files;
        // $.ajax({
        //     type: 'POST',
        //     data: JSON.stringify(test),
        //     contentType: 'application/json',
        //     url: 'http://localhost:3000/upload',						
        //     success: function(data) {
        //         console.log('success');
        //         console.log(JSON.stringify(data));
        //     }
        // });


        //generateDownloadLink("#testID", "temp/testFile.txt");

    });
});
// // An example 128-bit key (16 bytes * 8 bits/byte = 128 bits)
// var key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];

// // Convert text to bytes
// var text = 'Text may be any length you wish, no padding is required.';
// var textBytes = aesjs.utils.utf8.toBytes(text);

// // The counter is optional, and if omitted will begin at 1
// var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
// var encryptedBytes = aesCtr.encrypt(textBytes);

// // To print or store the binary data, you may convert it to hex
// var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
// console.log(encryptedHex);
// // "a338eda3874ed884b6199150d36f49988c90f5c47fe7792b0cf8c7f77eeffd87
// //  ea145b73e82aefcf2076f881c88879e4e25b1d7b24ba2788"

// // When ready to decrypt the hex string, convert it back to bytes
// var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);

// // The counter mode of operation maintains internal state, so to
// // decrypt a new instance must be instantiated.
// var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
// var decryptedBytes = aesCtr.decrypt(encryptedBytes);

// // Convert our bytes back into text
// var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
// console.log(decryptedText);
// // "Text may be any length you wish, no padding is required."


