$.get('http://togetherdogapi.dimigo.kr/sido', (res) => {
  $('#sido').empty()
  $('#sido').append('<option class="option" disabled selected>시/도를 선택하세요</option>')
  for(var i=0;i<res.length;i++){
    $('#sido').append(`<option class="option" value="${res[i].code}">${res[i].name}</option>`)
  }
})
$('#sido').change(function(){
  $.get(`http://togetherdogapi.dimigo.kr/sigungu?sido=${$(this).val()}`, (res) => {
    $('#sigungu').empty()
    $('#sigungu').append('<option class="option" disabled selected>시/군/구를 선택하세요</option>')
    for(var i=0;i<res.length;i++){
      $('#sigungu').append(`<option class="option" value="${res[i].code}">${res[i].name}</option>`)
    }
  })
})
$('#sigungu').change(function(){
  $.get(`http://togetherdogapi.dimigo.kr/list?sido=${$('#sido').val()}&sigungu=${$(this).val()}`, (res) => {
    $('#row').empty()
    for(var i=0;i<res.length;i++){
      $('#row').append(`<div class="items pet" style="background-image:url(${res[i].thumbnail})" data-id="${i}"><span class="pet-kind">${res[i].kind}</span></div>`)
      $('.pet').click(function() {
        console.log($(this).data('id'))
        const d = res[$(this).data('id')]
        $('.big-img').css('background-image', `url(${d.image})`)
        $('#pet-kind').text(d.kind)
        $('#pet-age').text(d.age)
        $('#pet-care').text(`(${d.careNm}) ${d.careAddr}`)
      })
    }
  })
})