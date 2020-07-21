const firebaseConfig = {
  //Use your firebase config file
};

const myApp = firebase.initializeApp(firebaseConfig)
const myDb = myApp.database()
const googleProvider = new firebase.auth.GoogleAuthProvider()
const welcomeMessage = document.getElementById('welcome-message')
const userDisplay = document.getElementById('user-data')

document.getElementById('google-button').addEventListener('click', (evt) => {
  myApp.auth().signInWithPopup(googleProvider).then(res => {
    welcomeMessage.textContent = "Welcome, " + (res.user.displayName || res.user.email) + '!'
    myDb.ref('/users/' + res.user.uid).on('value', (evt) => {
      let userObj = evt.val()
      console.log(userObj)

      if(userObj.role === 'admin') {
        console.log('is admin')
        myDb.ref('/users').once('value', (evt) => {
          let allUsersObj = evt.val()

          for (let id in allUsersObj) {
            let userItem = `<li><h5>${(allUsersObj[id].nickName || 'anonymous') + ':'}</h5><form id=${id}><input type='text' value=${allUsersObj[id].role} id="${'input-' + id}" /><input type='submit' /></form></li>`
            userDisplay.innerHTML += userItem
          }
          for (let id in allUsersObj) {
            console.log(document.getElementById('input-' + id))
            document.getElementById(id).addEventListener('submit', (evt) => {
              evt.preventDefault()
              
              let newRole = document.getElementById('input-' + id).value
              myDb.ref('/users/' + id).update({role: newRole})
            })
          }
        })
      }

      if(!userObj.nickName) {
        userDisplay.innerHTML = `<form id='nick-name'><input id='name-input' type='text' /><input type='submit' /></form>`

        document.getElementById('nick-name').addEventListener('submit', (evt) => {
          evt.preventDefault()
          let name = document.getElementById('name-input').value

          console.log(userObj.uid)

          let updateObj = {['/users/' + res.user.uid + '/nickName']: name}

          myDb.ref().update(updateObj)
        })
      }
    })
  }).catch(error => {
    alert(error.message)
  })
})

document.getElementById('signin-form').addEventListener('submit', (evt) => {
  evt.preventDefault()
  let user = document.getElementById('user-email').value
  let password = document.getElementById('user-password').value

  document.getElementById('user-email').value = ''
  document.getElementById('user-password').value = ''

  myApp.auth().signInWithEmailAndPassword(user, password).then((res) => {
    welcomeMessage.textContent = "Welcome, " + (res.user.displayName || res.user.email) + '!'

    myDb.ref('/users/' + res.user.uid).on('value', (evt) => {
      let userObj = evt.val()
      console.log(userObj)

      if(userObj.role === 'admin') {
        console.log('is admin')
        myDb.ref('/users').once('value', (evt) => {
          let allUsersObj = evt.val()

          for (let id in allUsersObj) {
            let userItem = `<li><h5>${(allUsersObj[id].nickName || 'anonymous') + ':'}</h5><form id=${id}><input type='text' value=${allUsersObj[id].role} id="${'input-' + id}" /><input type='submit' /></form></li>`
            userDisplay.innerHTML += userItem
          }
          for (let id in allUsersObj) {
            console.log(document.getElementById('input-' + id))
            document.getElementById(id).addEventListener('submit', (evt) => {
              evt.preventDefault()
              
              let newRole = document.getElementById('input-' + id).value
              myDb.ref('/users/' + id).update({role: newRole})
            })
          }
        })
      }

      if(!userObj.nickName) {
        userDisplay.innerHTML = `<form id='nick-name'><input id='name-input' type='text' /><input type='submit' /></form>`

        document.getElementById('nick-name').addEventListener('submit', (evt) => {
          evt.preventDefault()
          let name = document.getElementById('name-input').value

          let updateObj = {['/users/' + res.user.uid + '/nickName']: name}

          myDb.ref().update(updateObj)
        })
      }
    })
  }).catch(error => {
    alert(error.message)
  })
})

document.getElementById('signup-form').addEventListener('submit', (evt) => {
  evt.preventDefault()

  let user = document.getElementById('new-email').value
  let password = document.getElementById('new-password').value

  document.getElementById('new-email').value = ''
  document.getElementById('new-password').value = ''

  myApp.auth().createUserWithEmailAndPassword(user, password).then((res) => {
    welcomeMessage.textContent = "Welcome, " + (res.user.displayName || res.user.email) + '!'

    let userRole = {['/users/' + res.user.id + '/role']: {role: "user"}}


    console.log(res.user.uid)
    myDb.ref().update(userRole)
  }).catch(error => {
    alert(error.message)
  })
})
