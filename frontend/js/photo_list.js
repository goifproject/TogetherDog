$.get('http://togetherdogapi.dimigo.kr/image', (res) => {
  $('#list').empty()
  for(var i=0;i<res.length;i++){
    $('#list').append(`<li class="li-box"><img src="http://togetherdogapi.dimigo.kr/image/${res[i]}" class="img-in" alt=""></li>`)
  }
})