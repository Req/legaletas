function initLightbox() {
  const gallery = document.querySelector(".gallery")
  const lightbox = document.querySelector("#lightbox")

  // Click or touch image to open lightbox
  gallery.addEventListener("click", (e) => {
    console.log(e.target.tagName)
    if (e.target.tagName === "IMG") {
      lightbox.innerHTML = `<img src="${e.target.src.replace("medium/", "")}" alt="">`
      lightbox.style.display = "grid"
    }
  })

  lightbox.addEventListener("click", (e) => {
    lightbox.style.display = "none"
  })
}

// const CKEDITOR_CONFIG = {
//   toolbar: [
//     "undo",
//     "redo",
//     "|",
//     "heading",
//     "|",
//     "bold",
//     "italic",
//     "alignment",
//     "|",
//     "link",
//     // "uploadImage",
//     "insertTable",
//     "blockQuote",
//     // "mediaEmbed",
//     "|",
//     "bulletedList",
//     "numberedList",
//     "outdent",
//     "indent",
//   ],
//   alignment: {
//     options: [ 'left', 'center', 'right' ]
//   },
// }

function initEdit() {
  const password = prompt("Salasana")

  const btn = document.querySelector("#editbtn")
  btn.style.display = "block"

  // All .editable elements
  const editableElements = document.querySelectorAll(".editable")

  // Initialize editor for each element
  let error = false
  editableElements.forEach((editable) => {
    // InlineEditor.create(editable,CKEDITOR_CONFIG).catch((error) => {
      InlineEditor.create(editable).catch((error) => {
      error = true
      console.error(error)
    })
  })
  if (error) {
    return alert("Voi vitsi, editorin lataus epäonnistui :(")
  }

  btn.addEventListener("click", () => {
    // Get values from all editable elements
    const values = {}
    editableElements.forEach((editable) => {
      values[editable.id] = editable.ckeditorInstance.getData()
    })

    // POST values to /save
    fetch("/save?password=" + password, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((res) => {
        if (res.ok) {
          alert("Tallennettu")
          document.location.reload()
        } else {
          alert("Virhe :(")
        }
      })
      .catch((err) => console.error(err))
  })
}

document.addEventListener("DOMContentLoaded", () => {
  initLightbox()

  if (window.location.hash === "#edit") {
    const script = document.createElement("script")
    script.src = "/public/ckeditor.js"
    script.onload = initEdit
    document.head.appendChild(script)
  }
})
