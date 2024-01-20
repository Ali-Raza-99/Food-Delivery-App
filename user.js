let counter = 0 
const db = firebase.firestore();
var userProfileImg ;
const currentDate = new Date();

// user authentication **************************************************************************************

// signup user************************************************************************************

const getUserProfileImg =(e)=>{
    userProfileImg = e.target.files[0]
    console.log(userProfileImg)
  }
  
  const userSignUp = () => {
  let userSignupName = document.getElementById('userSignupName').value.toString().toUpperCase();;
  let userSignupPassword = document.getElementById('userSignupPassword');
  let userSignupEmail = document.getElementById('userSignupEmail')
  let userSignupCountry = document.getElementById('userSignupCountry');
  let userSignupCity = document.getElementById('userSignupCity');
  let userSignupProfile = document.getElementById('userProfileSelect');
  let userSignupPhone = document.getElementById('userSignupPhone')

  if (userSignupPhone == '' ||(!isNaN(userSignupName) || userSignupName == '') || ((!isNaN(userSignupCountry) || userSignupCountry == '')) || (userSignupProfile.files.length <= 0) || ((!isNaN(userSignupCity) || userSignupCity == ''))) {
    alert('Please fill in all information or correct information');
  } else {
  firebase.auth().createUserWithEmailAndPassword(userSignupEmail.value, userSignupPassword.value)
  .then((userCredential) => {
    let currentUserUid = userCredential.user.uid;
    let fileRef = firebase.storage().ref().child(`/UsersProfile/${currentUserUid}/profile`);
    let uploadTask = fileRef.put(userProfileImg);

    uploadTask.on('state_changed',
      (snapshot) => {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        if (progress === 100) console.log('Profile uploaded');
      },
      (error) => {
        console.log(error);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          db.collection('Users').doc(currentUserUid).set({
            name: userSignupName,
            country: userSignupCountry.value,
            city: userSignupCity.value,
            email: userSignupEmail.value,
            phone:userSignupPhone.value,
            userid: currentUserUid,
            userProfileUrl: url
          }).then(() => {
            console.log('User added successfully');
            location.replace('userLogin.html');
          });
        });
      }
    );
  })
        .catch((error) => {
          let userSignUpErrorText = document.getElementById('userSignUp-error-message');
          var errorMessage = error.message;
          userSignUpErrorText.innerHTML = `<p class="text-red-600 text-sm text-start">${errorMessage}</p>`;
        });
    }
  };
  
// signup user************************************************************************************


// login user *********************************************************************************


const userLogin = () => {
  let userLoginEmail = document.getElementById('userLoginEmail');
  let userLoginPassword = document.getElementById('userLoginPassword')

  firebase.auth().signInWithEmailAndPassword(userLoginEmail.value, userLoginPassword.value)
  .then((userCredential) => {
      const user = userCredential.user;
      window.location.href = 'userDashboard.html'
      
    })

    .catch((error) => {
      let userLoginErrorText = document.getElementById('userLogin-error-message')
      var errorCode = error.code;
      var errorMessage = error.message;
      userLoginErrorText.innerHTML = `<p class="text-red-600 text-sm text-start">${errorMessage}</p>`
      
    });
  }
  

  // login user *********************************************************************************

  const currentUser = () => {

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {

    let uid = user.uid;
    let email = user.email;
    let userName = document.getElementById('userName');
    let userEmail = document.getElementById('userEmail');
    let userCopyrightYear = document.getElementById('user-copyright-year')
    let userCountry = document.getElementById('userCountry');
    let userPhone = document.getElementById('userPhone')
    let userCity = document.getElementById('userCity');
    let userProfilePic = document.getElementById('userProfilePic')
    const currentYear = currentDate.getFullYear();

    // getting signUp data of user
    db.collection(`${`Users`}`).doc(`${uid}`).get().then((doc) => {
      if (doc.exists) {
        // console.log("Document data:", doc.data());
        userName.innerHTML = `${doc.data().name}`
        userCopyrightYear.innerHTML = `${currentYear}`
        userEmail.innerHTML = `${doc.data().email}`
        userCountry.innerHTML = `${doc.data().country}`
        userCity.innerHTML = `${doc.data().city}`
        userProfilePic.innerHTML = `<img id="${uid}profile" class="" src="${doc.data().userProfileUrl}" alt="Firebase Image">`
        userPhone.innerHTML = `${doc.data().phone}`
      }
      
      else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });

    getRestaurants(uid)
      


      // ...
    } else {
      console.log('not working yet')
      // signOutUser()
      // User is signed out
      // ...
    }
  });


  
}

const signOutUser = () => {
  firebase.auth().signOut().then(() => {
    console.log('user is signout ')
    window.location.href = 'userLogin.html'
  }).catch((error) => {
    alert('Cant signOut...')
  });
}







// user authentication **************************************************************************************

// get restaurants from database ***************************************************************************

const getRestaurants = (uid) => {

  let currentRestaurantUid = firebase.auth().currentUser.uid
  let user_restaurantCardParent = document.getElementById('user_restaurantsCardParent')

  db.collection(`Restaurants`).get().then((querySnapshot) => {

      querySnapshot.forEach((doc) => {
        user_restaurantCardParent.innerHTML += `
          <div id="${doc.id}" onclick="visitRestaurant(${doc.id})" class="user_restaurantCard h-auto w-96 mt-8 mb-5  border border-teal-700 rounded">
        <div id="user_restaurantImgParent"> <img class="p-1 img w-96 h-44" src="${doc.data().restaurantprofileUrl}" alt=""></div>
        <div class="flex items-center justify-between px-4 mb-3 text-center">
          <h1 id="user_restaurantName" class="text-lg font-bold text-center  text-teal-700">${doc.data().name}</h1>
          <span class="flex mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
              class="w-4 h-5 text-teal-700">
              <path fill-rule="evenodd"
                d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
                clip-rule="evenodd" />
            </svg>

            <h1 id="user_restaurantCity" class="text-teal-700 pl-1 text-sm">${doc.data().city}</h1>
          </span>
      
        </div>

        <div class="flex  justify-between px-4 mb-3 text-center">
          <h1 id="user_restaurantEmail" class="text-sm text-center  text-teal-700">${doc.data().email}</h1>
          
            <span class="flex">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                class="w-4 h-5 text-teal-700">
                <path
                  d="M3.5 2.75a.75.75 0 00-1.5 0v14.5a.75.75 0 001.5 0v-4.392l1.657-.348a6.449 6.449 0 014.271.572 7.948 7.948 0 005.965.524l2.078-.64A.75.75 0 0018 12.25v-8.5a.75.75 0 00-.904-.734l-2.38.501a7.25 7.25 0 01-4.186-.363l-.502-.2a8.75 8.75 0 00-5.053-.439l-1.475.31V2.75z" />
              </svg>
              <h1 id="user_restaurantCountry" class="text-teal-700 pl-1 text-sm">${doc.data().country}</h1>
            </span>
          
            
        </div>


      </div>
    
  `
      
      });
  });

}


// get restaurants from database ***************************************************************************



// visit restaurant while click **************************************************************************

const visitRestaurant = (RestaurantUid)=>{
    location.href = 'restaurant.html'
}


// visit restaurant while click **************************************************************************






const collapNav = () => {

  let nav_icon = document.getElementById('mobile-menu');
  let togle = nav_icon.offsetHeight
  nav_icon.style.display = 'block';

  if (togle === 0) {
    nav_icon.style.height = '200px';
  } else {
    nav_icon.style.height = '0';
    nav_icon.style.display = 'none'
  }


}