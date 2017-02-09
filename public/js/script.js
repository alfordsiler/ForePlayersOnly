$(function() {
  $('.edit-form').submit(function(e) {
    e.preventDefault();
    var url = $(this).attr('action');
    var data = $(this).serialize();

    $.ajax({
      url: url,
      method: 'PUT',
      data: data
    }).done(function() {
      
      window.location.href = '/manage/teams';
    });
  });

  $('.delete-btn-teams').click(function(e) {
    e.preventDefault();
    var url = $(this).attr('href');
    var answer = confirm ("Are you sure you want to delete this team?");
    if (answer) {
      $.ajax({
        url: url,
        method: 'DELETE'
      }).done(function() {
        window.location.href = '/manage/teams';
      });
    };
  });
});

$(function() {
  $('.edit-form-tournaments').submit(function(e) {
    e.preventDefault();
    var url = $(this).attr('action');
    var data = $(this).serialize();

    $.ajax({
      url: url,
      method: 'PUT',
      data: data
    }).done(function() {
      window.location.href = '/manage/tournaments';
    });
  });

  $('.delete-btn-tournaments').click(function(e) {
    e.preventDefault();
    var url = $(this).attr('href');
    var answer = confirm ("Are you sure you want to delete this tournament?");
    if (answer) {
      $.ajax({
        url: url,
        method: 'DELETE'
      }).done(function() {
        window.location.href = '/manage/tournaments';
      });
    };
  });
});

$(function() {
  $('.delete-btn-users').click(function(e) {
    e.preventDefault();
    var url = $(this).attr('href');
    var answer = confirm("Are you sure you want to remove this player from the team?")
    if (answer) {
      $.ajax({
        url: url,
        method: 'DELETE'
    }).done(function() {
      window.location.href = '/manage/teams';
    });
    };
  });
});

$(function() {
  $('.delete-btn-tourneyTeams').click(function(e) {
    e.preventDefault();
    var url = $(this).attr('href');
    var answer = confirm ("Are you sure you want to delete this team?");
    if (answer) {
      $.ajax({
        url: url,
        method: 'DELETE'
      }).done(function() {
        window.location.href = '/manage/tournaments';
      });
    };
  });
});

setTimeout(function(){
  $('.alert').remove();
}, 3000);

$(".remove" ).parents().css( "background-image", "none" );