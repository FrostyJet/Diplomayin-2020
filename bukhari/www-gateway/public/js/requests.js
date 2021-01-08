$(function() {

  $('.apply').click(function() {
    $('#applyModal').removeClass('hidden');
    $('#requestId').val($(this).attr('data-requestId'));
  });

  $('#applyModal [data-action="dismiss"]').click(function() {
    $('#applyModal').addClass('hidden');
  });
});