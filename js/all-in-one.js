const mergeAll = () => {
  const language = document.currentScript.getAttribute('LANG')
  const allKeys = [''].concat(
    Array.from(document.querySelectorAll('a.toc'))
      .map(link => link.getAttribute('href'))
      .map(target => target.split('/'))
      .map(fields => fields.filter(x => x))
      .map(fields => fields.slice(-1)[0])
  )
  const allChapters = concatenate(
    language,
    allKeys,
    key => makeUrl(language, key),
    getDocFromUrl
  )
  fillInPage(allChapters)
}

const makeUrl = (language, key) => {
  const i = window.location.href.indexOf('all')
  let url = window.location.href.substring(0, i)
  if (key) {
    url += key + '/'
  }
  return url
}

const getDocFromUrl = async (url) => {
  const el = await new Promise((resolve,reject) => {
    let request = new XMLHttpRequest()
    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        if (request.status === 200) {
          const element = document.createElement('html')
          element.innerHTML = request.responseText
          resolve(element)
        } else {
          reject(Error(`got HTTP status code ${request.status} for URL ${url}`))
        }
      }
    }
    request.open('GET', url, true)
    request.send('null')
  }).catch(e => console.error(e))
  return el
}

const MAIN_FRAME = `<div class="row">
  <div class="col-md-10 offset-md-1 main">
  </div>
</div>`

const fillInPage = (chapters) => {
  const container = document.querySelector('div.container-fluid')
  while (container.firstChild) {
    container.removeChild(container.firstChild)
  }
  container.innerHTML = MAIN_FRAME
  const main = container.querySelector('div.main')
  chapters.forEach(ch => main.appendChild(ch))
}

mergeAll()
