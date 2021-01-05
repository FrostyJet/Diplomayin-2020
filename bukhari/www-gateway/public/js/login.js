$(function() {

  $('#loginForm').submit(function(e) {
    e.preventDefault();
    const btn = $(this).find('button[type=submit]');
    const oldHtml = btn.html();

    btn.html('Իրականացվում է ․․․').prop('disabled', true);
    $('.errors').hide();

    $.ajax({
      url: '/teachers/login',
      type: 'POST',
      data: $(this).serializeArray(),
      success: r => {
        btn.html(oldHtml).prop('disabled', false);

        if (r.success) {
          Cookies.set('auth-token', r.token, { expires: 1 }); // One day
          window.location.href = '/dashboard';
        } else {
          $('.errors').show();
        }
      },
    });
  });
});