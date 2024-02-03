
let counter = 0
const currentDate = new Date();
const db = firebase.firestore();
let file = document.querySelector('#dishImg');
let dishImgRef = document.querySelector('.img');
var dishFileImg;
var dishProfileImg;


const getDishImg =(e)=>{
    dishFileImg = e.target.files[0]
    console.log(dishFileImg)
}


const getProfileImg =(e)=>{
  dishProfileImg = e.target.files[0]
  console.log(dishProfileImg)
}

// restaurant authentication code ************************************************************************

// signOut as restaurant ****************************************************************************** 

const signOutRestaurant = () => {
  firebase.auth().signOut().then(() => {
    console.log('user is signout ')
    window.location.href = 'restaurantLogin.html'
  }).catch((error) => {
    alert('Cant signOut...')
  });
}


// signOut as restaurant ****************************************************************************** 

// signup as restaurant *****************************************************************
const restaurantSignUp = () => {
  let restaurantSignupEmail = document.getElementById('restaurantSignupEmail');
  let restaurantSignupPassword = document.getElementById('restaurantSignupPassword');
  let restaurantName = document.getElementById('restaurantSignupName').value.toString().toUpperCase();
  let restaurantCountry = document.getElementById('restaurantSignupCountry');
  let restaurantCity = document.getElementById('restaurantSignupCity');
  let restaurantProfile = document.getElementById('restaurantProfileSelect');

  if ((!isNaN(restaurantName) || restaurantName == '') || ((!isNaN(restaurantCountry) || restaurantCountry == '')) || (restaurantProfile.files.length <= 0) || ((!isNaN(restaurantCity) || restaurantCity == ''))) {
    alert('Please fill in all information or correct information');
  } else {
    firebase.auth().createUserWithEmailAndPassword(restaurantSignupEmail.value, restaurantSignupPassword.value)
      .then((userCredential) => {
        let currentRestaurantUid = userCredential.user.uid;
        let fileRef = firebase.storage().ref().child(`/restaurantsProfile/${currentRestaurantUid}/profile`);
        let uploadTask = fileRef.put(dishProfileImg);

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
              db.collection('Restaurants').doc(currentRestaurantUid).set({
                name: restaurantName,
                country: restaurantCountry.value,
                city: restaurantCity.value,
                email: restaurantSignupEmail.value,
                userid: currentRestaurantUid,
                restaurantprofileUrl: url
              }).then(() => {
                console.log('Restaurant added successfully');
                location.replace('restaurantLogin.html');
              });
            });
          }
        );
      })
      .catch((error) => {
        let restaurantSignUpErrorText = document.getElementById('restaurantSignup-error-message');
        var errorMessage = error.message;
        restaurantSignUpErrorText.innerHTML = `<p class="text-red-600 text-sm text-start">${errorMessage}</p>`;
      });
  }
};

  // signup as restaurant *****************************************************************
  
// Login as restaurant ********************************************************

const restaurantLogin = () => {
  let restaurantLoginEmail = document.getElementById('restaurantLoginEmail');
  let restaurantLoginPassword = document.getElementById('restaurantLoginPassword')

  firebase.auth().signInWithEmailAndPassword(restaurantLoginEmail.value, restaurantLoginPassword.value)
  .then((userCredential) => {
      const user = userCredential.user;
      window.location.href = 'restaurantDashboard.html'
      
    })

    .catch((error) => {
      let restaurantLoginErrorText = document.getElementById('restaurantLogin-error-message')
      var errorCode = error.code;
      var errorMessage = error.message;
      restaurantLoginErrorText.innerHTML = `<p class="text-red-600 text-sm text-start">${errorMessage}</p>`
      
    });
  }
  
  // Login as restaurant ********************************************************
  
  
  const currentRestaurant = () => {

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {

      let uid = user.uid;
      let email = user.email;
      let restaurantName = document.getElementById('restaurantName');
      let restaurantEmail = document.getElementById('restaurantEmail');
      let restaurantCopyrightYear = document.getElementById('restaurant-copyright-year')
      let restaurantCountry = document.getElementById('restaurantCountry');
      let restaurantCity = document.getElementById('restaurantCity');
      let restaurantProfilePic = document.getElementById('restaurantProfilePic')
      const currentYear = currentDate.getFullYear();


      // getting signUp data of restaurant
      db.collection(`${`Restaurants`}`).doc(`${uid}`).get().then((doc) => {
        if (doc.exists) {
          // console.log("Document data:", doc.data());
          restaurantName.innerHTML = `${doc.data().name}`
          restaurantCopyrightYear.innerHTML = `${currentYear}`
          restaurantEmail.innerHTML = `${doc.data().email}`
          restaurantCountry.innerHTML = `${doc.data().country}`
          restaurantCity.innerHTML = `${doc.data().city}`
          restaurantProfilePic.innerHTML = `<img id="${uid}profile" class="rounded-full h-9 w-9" src="${doc.data().restaurantprofileUrl}" alt="Firebase Image">`

          // restaurantProfilePic.setAttribute("src",doc.data().restaurantprofileUrl)
          
      // console.log(doc.data().restaurantprofileUrl + "find it")
        }
        
        else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      }).catch((error) => {
        console.log("Error getting document:", error);
      });

      
      getDishData()
      


      // ...
    } else {
      console.log('not working yet')
      // signOutUser()
      // User is signed out
      // ...
    }
  });


  
}








// restaurant authentication code ************************************************************************



// popup of create dish  ****************************************************
const toggle = () => {

  let blur = document.getElementById('forBlur');
  blur.classList.toggle('active')
  let popup = document.getElementById('modal')
  popup.classList.toggle('hidden')
  
}
// popup of create dish  ****************************************************



//function for creating dish's information
const createDish = (dishName, dishPrice, category_dropdown, deliveryType, currency,imgUrl,dishCounter) => {


  let cardParent = document.getElementById('cardParent')
  let addDishBtn = document.getElementById('addDishBtn');
 let currentRestaurantUid = firebase.auth().currentUser.uid


    // Add a new document in collection "cities"
  db.collection(`${currentRestaurantUid}`).doc(`${dishCounter}`).set({
    dishName: dishName,
    dishPrice: dishPrice,
    category_dropdown: category_dropdown,
    deliveryType:deliveryType,
    currency: currency,
    imgUrl: imgUrl
  })
  .then(() => {

    cardParent.innerHTML += `
    
    <div id='dish${dishCounter}' class="card h-auto w-60 mt-8 mb-5  border border-teal-700 rounded">
    <div id='dishImageParent${dishCounter}'><img id="DynamicDishImg${dishCounter}" class="p-1 w-60 h-44" src="${imgUrl}" alt=""></div>
    <div class="flex px-4 mb-3 text-center">
    
    <h1 class="text-lg font-bold text-center  text-teal-700">${dishName.toUpperCase()}</h1>
    

      </div>
      <hr class="mx-4">
      <div class="flex justify-between px-5 mt-3 pb-2">
        <h1 class="text-sm text-teal-700">${currency} : ${dishPrice}</h1>
        <h1 class="text-sm  text-teal-700">${category_dropdown}</h1>
      </div>
      <hr class="mx-4">
      <div class="flex items-center  justify-between ">
      <div class="flex px-4 mt-3 pb-2 text-center ">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
          stroke="currentColor" class="w-5 h-5 text-teal-700">
          <path stroke-linecap="round" stroke-linejoin="round"
          d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
          </svg>
          <h1 class="text-sm ml-1 text-teal-700">Delivery <span>${deliveryType}</span></h1>
      </div>
      <div class="pr-4 ">
        <svg onclick="deleteDish('dish${dishCounter}',${dishCounter})" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class=" hover:text-red-700 w-5 h-5 cursor-pointer text-teal-700">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        
          </div>
    </div>
    
    </div>  
`
   
    
  })
  .catch((error) => {
    console.error("Error writing document: ", error);
  }); 
  
  
  // getDishData(currentRestaurantUid)
  

  
  // let dishImageParent = document.getElementById(`dishImageParent${counter}`)

  // dishImageUpload(dishImageParent)


}

// delete dish code *********************************************************************************

const deleteDish = (dishCardId, idCounter) => {
  let currentRestaurantUid = firebase.auth().currentUser.uid
  let dishCard_parent = document.getElementById(`${dishCardId}`)
  db.collection(`${currentRestaurantUid}`).doc(`${idCounter}`).delete().then(() => {
    
    
    let deletetRef = firebase.storage().ref().child(`/restaurants/${currentRestaurantUid}/dish${idCounter}`);
    // let fileRef = firebase.storage().ref().child(`/restaurants/${currentRestaurantUid}/dish${counter}`)

    // Delete the file
    deletetRef.delete().then(() => {
      // File deleted successfully
    }).catch((error) => {
      // Uh-oh, an error occurred!
    });


    }).catch((error) => {
      console.error("Error removing document: ", error);
    });
    // console.log(todos_parent)
    dishCard_parent.remove()
}


// delete dish code *********************************************************************************


// adding dish on cards **************************************************************************
const addDish = () => {

  
  let dishName = document.getElementById('dishName').value;
  let dishPrice = document.getElementById('dishPrice').value;
  let category_dropdown = document.getElementById('category_dropdown');
  let deliveryType = document.getElementById('deliveryType');
  let currency = document.getElementById('currency')
  let dishImg = document.getElementById('dishImg')




  if ((!isNaN(dishName) || dishName == '') || (isNaN(dishPrice) || dishPrice == '') || (category_dropdown.value == category_dropdown[0].innerHTML) || (deliveryType.value == deliveryType[0].innerHTML) || (currency.value == currency[0].innerHTML) || (dishImg.files.length <= 0)) {
    alert('Please full fill all information ')
  }

  else {
    
    // let dishCounter = counter
    let currentRestaurantUid = firebase.auth().currentUser.uid
    let fileRef = firebase.storage().ref().child(`/restaurants/${currentRestaurantUid}/dish${counter}`)
    // console.log(e.target.files)
    let uploadTask = fileRef.put(dishFileImg)
  
    uploadTask.on('state_changed', 
    (snapshot) => { 
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      if(progress == '100') console.log('uploaded')
    }, 
  (error) => {
      console.log(error)
      
    }, 
    () => {
    
      uploadTask.snapshot.ref.getDownloadURL().then((url) => {
    counter = counter += 1
         
    createDish(dishName, dishPrice, category_dropdown.value, deliveryType.value, currency.value,url,counter)
    toggle()

      });
    }
  );
  
  }
  
}


// restaurant logic******************************************************************

// navbar logic  **********************************************************************

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


const getDishData = (uid) => {

  let currentRestaurantUid = firebase.auth().currentUser.uid
  let cardParent = document.getElementById('cardParent')

  db.collection(`${currentRestaurantUid}`).get().then((querySnapshot) => {

      querySnapshot.forEach((doc) => {
          cardParent.innerHTML += `
    
      <div id='dish${doc.id}' class="card h-auto w-72 mt-8 mb-5  border border-teal-700 rounded">
      <div id='dishImageParent${doc.id}'><img id="DynamicDishImg${doc.id}" class="p-1 w-72 h-44" src="${doc.data().imgUrl}" alt=""></div>
      <div class="flex  px-4 mb-3 text-center">
      
      <h1 class="text-lg font-bold  text-teal-700">${doc.data().dishName.toUpperCase()}</h1>
      
  
        </div>
        <hr class="mx-4">
        <div class="flex justify-between px-5 mt-3 pb-2">
          <h1 class="text-sm text-teal-700">${doc.data().currency} : ${doc.data().dishPrice}</h1>
          <h1 class="text-sm  text-teal-700">${doc.data().category_dropdown}</h1>
        </div>
        <hr class="mx-4">
        <div class="flex items-center  justify-between ">
        <div class="flex px-4 mt-3 pb-2 text-center ">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-5 h-5 text-teal-700">
            <path stroke-linecap="round" stroke-linejoin="round"
            d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
            <h1 class="text-sm ml-1 text-teal-700">Delivery <span>${doc.data().deliveryType}</span></h1>
        </div>
        <div class="pr-4 ">
          <svg onclick="deleteDish('dish${doc.id}',${doc.id})" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class=" hover:text-red-700 w-5 h-5 cursor-pointer text-teal-700">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          
            </div>
      </div>
      
      </div>  
  `
      
      });
  });

}


// helpful function its helps to add image without database ..........................

// function for uploading dish image ************************************************************


// const dishImageUpload = (currentImageId) => {
//   let file = document.getElementById('dishImg').files[0];
//   let reader = new FileReader();
//   reader.onload = function (e) {

//     currentImageId.innerHTML = `<img id="DynamicDishImg${currentImageId}" class="p-2 w-60 h-44" src="${e.target.result}" alt="">`
//     // console.log(e.target.files)
//   }
  
//   reader.readAsDataURL(file);
// }