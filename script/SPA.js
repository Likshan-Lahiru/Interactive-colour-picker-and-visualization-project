$("#dashboard").css({display:'block'});
$("#cmyk-page").css({display: 'none'});
$("#user-profile").css({display: 'none'});


$("#dash").on('click',()=>{
    $("#dashboard").css({display:'block'});
    $("#cmyk-page").css({display: 'none'});
    $("#user-profile").css({display: 'none'});
});

$("#generate").on('click',()=>{
    $("#dashboard").css({display:'none'});
    $("#cmyk-page").css({display: 'block'});
    $("#user-profile").css({display: 'none'});
});

$("#profile").on('click',()=>{
    $("#dashboard").css({display:'none'});
    $("#cmyk-page").css({display: 'none'});
    $("#user-profile").css({display: 'block'});
});


(function ($) {

    "use strict";

    $('nav .dropdown').hover(function () {
        var $this = $(this);
        $this.addClass('show');
        $this.find('> a').attr('aria-expanded', true);
        $this.find('.dropdown-menu').addClass('show');
    }, function () {
        var $this = $(this);
        $this.removeClass('show');
        $this.find('> a').attr('aria-expanded', false);
        $this.find('.dropdown-menu').removeClass('show');
    });

})(jQuery);

(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})()
