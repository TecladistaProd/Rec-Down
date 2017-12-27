(function(){
  let midia = {
    audio: true,
    video: false
  }
  let audioBlob
  let mediaRecorder
  navigator.mediaDevices.getUserMedia(midia).then(stream=>{
    mediaRecorder = new MediaRecorder(stream)
    let chunks = []
    mediaRecorder.ondataavailable = data => {
      chunks.push(data.data)
    }
    mediaRecorder.onstop = () =>{
      let type = { type:'audio/ogg; code=opus' }
      audioBlob = new Blob(chunks, type)
      const reader = new window.FileReader()
      reader.readAsDataURL(audioBlob)
      reader.onloadend = () => {
        const audio = document.createElement('audio')
        audio.src = reader.result
        audio.autoplay = false
        audio.controls = true
        audio.controlsList="nodownload"
        const aud = document.createElement('div')
        aud.appendChild(audio)
        let a = document.createElement('a')
        a.classList = 'down'
        a.innerHTML = '&#x2193;'
        aud.appendChild(a)
        document.querySelector('.audios').appendChild(aud)
        document.querySelectorAll('.down').forEach(item =>{
          item.addEventListener('click', e=>{
            let object = e.target
            let binary = atob(object.parentNode.querySelector('audio').src.split(',')[1])
            let buffer = new ArrayBuffer(binary.length)
            let bytes = new Uint8Array(buffer)
            for (let i = 0; i < buffer.byteLength; i++) {
                bytes[i] = binary.charCodeAt(i) & 0xFF
            }
            let blob = new Blob([bytes], {type:'audio/mp3'})
            object.href = window.URL.createObjectURL(blob)
            object.download = Math.random()*1000+'.ogg'
            // window.URL.revokeObjectURL(object.href)
          })
        })
        chunks = []
      }
    }
  }).catch(err=>{
    let p = document.createElement('p')
    p.innerText = `An Error Occourred ${JSON.stringify(err)}`
    document.querySelector('body').appendChild(p)
  })
  let pl = document.querySelector('#play'), sp = document.querySelector('#stop')

  pl.addEventListener('click', ()=>{
    sp.disabled = !sp.disabled
    pl.disabled = !pl.disabled
    mediaRecorder.start()
  })

  sp.addEventListener('click', ()=>{
    sp.disabled = !sp.disabled
    pl.disabled = !pl.disabled
    mediaRecorder.stop()
  })
})()
