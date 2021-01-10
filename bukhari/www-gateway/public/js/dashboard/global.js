$(function() {

  $(document).on('click', '#logout', function() {
    Cookies.remove('auth-token');
    window.location.href = '/login';
  });

  $.ajax({
    type: 'POST',
    url: '/dashboard/get-auth',
    success: r => {
      $('#navAvatar').attr('src', '/st/media/' + r.avatar);
    },
  });
});