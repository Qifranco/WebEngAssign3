
//JQuery ChangeLanguage
$('[lang]').hide(); 
$('[lang="de"]').show(); 
$('#lang-switch').change(function () { 
    var lang = $(this).val(); 
    switch (lang) {
        case 'en':
            $('[lang]').hide();
            $('[lang="en"]').show();
        break;
        case 'de':
            $('[lang]').hide();
            $('[lang="de"]').show();
        break;
        default:
            $('[lang]').hide();
            $('[lang="de"]').show();
        }
});