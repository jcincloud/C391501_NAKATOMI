;
$(document).ready(function () {
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('a.goTop').fadeIn();
        }
        else {
            $('a.goTop').fadeOut();
        }
    });
    $('a.goTop').click(function () {
        $('html, body').animate({
            scrollTop: $($.attr(this, 'href')).offset().top
        }, 1000);
        return false;
    });
    $('#menu-toggle').click(function () {
        $('.md-overlay').addClass("show");
        return false;
    });
    $('.main-nav .md-close, .md-overlay').click(function () {
        $('.md-overlay').removeClass("show");
        return false;
    });
    $("#loginMember").submit(function (event) {
        var act = $('#act').val();
        var pwd = $('#pwd').val();
        var data = {
            "act": act,
            "pwd": pwd
        };
        console.log(data);
        jqPost(gb_approot + 'Sys_Base/MNGLogin/ajax_MemberLogin', data).done(function (data, textStatus, jqXHRdata) {
            if (!data.result) {
                alert(data.message);
                $('#pwd').val('');
            }
            else {
                document.location.href = gb_approot + 'Sys_Active/MemberData';
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            showAjaxError(errorThrown);
        });
        event.preventDefault();
    });
});
