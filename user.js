
const db = firebase.firestore();
var userProfileImg ;
var restaurantId;
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
      window.location.href = 'userHome.html'
      
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
    let userPhone_mobile = document.getElementById('userPhone_mobile')
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
        userPhone_mobile.innerHTML = `${doc.data().phone}`
      }
      
      else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });


    if (window.location.pathname === '/userHome.html') {
      getRestaurants(uid);
   }

  if(window.location.pathname === '/userDashboard.html'){

    getUserDashboardData()
  }
      
      
    
      


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



// selected restaurant order portal restaurant *******************************************************************************

// get restaurants in user dashboard *************************************************************************
const getRestaurants = (uid) => {

  let currentRestaurantUid = firebase.auth().currentUser.uid
  let user_restaurantCardParent = document.getElementById('user_restaurantsCardParent')

  db.collection(`Restaurants`).get().then((querySnapshot) => {

      querySnapshot.forEach((doc) => {
        user_restaurantCardParent.innerHTML += `
          <div id="${doc.id}" onclick="visitRestaurant('${doc.id}','${doc.data().name}')" class="cursor-pointer shadow-md user_restaurantCard h-auto w-96 mt-8 mb-5  border border-teal-700 rounded">
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
// get restaurants in user dashboard *************************************************************************


// when orderpage will be reloaded or visited by user ********************************************************************

const orderPage = () => {

  const selectedRestaurantId = new URLSearchParams(window.location.search).get('restaurantId')
  const selectedRestaurantName = new URLSearchParams(window.location.search).get('restaurantName')

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
    let orderPageRestaurantHeading = document.getElementById('orderPageRestaurantHeading');

    orderPageRestaurantHeading.innerHTML = `${selectedRestaurantName}`

    getDishesFromSelectedRestaurant(selectedRestaurantId)
    // getting signUp data of user
    db.collection(`${`Users`}`).doc(`${uid}`).get().then((doc) => {
      if (doc.exists) {
      
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


      // ...
    } else {
      console.log('not working yet')
      // signOutUser()
      // User is signed out
      // ...
    }
  });


  
}
// when orderpage will be reloaded or visited by user ********************************************************************


// get the id and restaurant name of restaurant which will be selected by user ***********************************
const getDataSelectedRestaurant = (getRestaurantId,getRestaurantName) =>{
  
  window.location.href  = `orderPage.html?restaurantId=${getRestaurantId}&restaurantName=${getRestaurantName}`
  
}

// get the id and restaurant name of restaurant which will be selected by user ***********************************


// when user clicks on any restaurant for visit or order ******************************************************

const visitRestaurant = (getRestaurantId,getRestaurantName) => {
  
  getDataSelectedRestaurant(getRestaurantId,getRestaurantName)
  
} 
// when user clicks on any restaurant for visit or order ******************************************************



// get dishes from selected restaurant of user ***********************************************************************

const getDishesFromSelectedRestaurant = (getRestaurantId)=>{
  
  let selectedRestaurantDishesParent = document.getElementById('selectedRestaurantDishesParent');
  let currentUserUid = firebase.auth().currentUser.uid
  
  db.collection("Dishes").where("restaurantUid", "==", `${getRestaurantId}`).get().then((querySnapshot) => {
    
      querySnapshot.forEach((doc) => {
        
        
        selectedRestaurantDishesParent.innerHTML += `
        <div id='${doc.id}' class="card h-auto w-60 mt-8 mb-5 mx-1 border border-teal-700 rounded">
          <div id='dishImageParent${doc.data().dishId}'><img id="DynamicDishImg${doc.data().dishId}" class="p-1 w-72 h-44"
              src="${doc.data().imgUrl}" alt=""></div>
          <div class="flex  px-4 mb-3 text-center">
            <h1 class="text-lg font-bold  text-teal-700">${doc.data().dishName.toUpperCase()}</h1>
          </div>
          <hr>
          <div class="flex justify-between px-5 mt-3 pb-2">
            <h1 class="text-sm text-teal-700">${doc.data().currency} : ${doc.data().dishPrice}</h1>
            <h1 class="text-sm  text-teal-700">${doc.data().category_dropdown}</h1>
          </div>
          <hr >
          <div class="flex items-center  justify-between ">
          <div class="flex px-4 mt-3 pb-2 text-center ">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
          stroke="currentColor" class="w-5 h-5 text-teal-700">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
              <h1 class="text-sm ml-1 text-teal-700">Delivery ${doc.data().deliveryType}</h1>
            </div>
            
          </div>
          <hr>
          
          <div  class="flex  mt-2 " id="addtoCartBtn">
              <span id="decreaseBtnOfDish${doc.data().dishId}" onclick="decreaseItemQuantity('${doc.id}',${doc.data().dishId},'${doc.data().dishName}','${doc.data().imgUrl}','${doc.data().dishPrice}','${doc.data().currency}')" class="decreaseBtnOfDish bg-white border pt-3 text-xl border-t-teal-700 border-r-teal-700 text-teal-700 px-3"> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
              </svg>
                </span>
              <span  class="addToCartBtn bg-teal-700 text-center text-white p-2 w-52" id='itemQuantity${doc.data().dishId}' >0</span>
              <span id="reduceBtnOfDish${doc.data().dishId}" onclick="reduceItemQuantity('${doc.id}',${doc.data().dishId},'${doc.data().dishName}','${doc.data().imgUrl}','${doc.data().dishPrice}','${doc.data().currency}')" class="reduceBtnOfDish bg-white border pt-3 text-xl border-t-teal-700 border-l-teal-700 text-teal-700 px-3"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              </span>
            </div>
            
        </div>
        
        `
        
        getQuantityOfItems(`${currentUserUid}`,doc.data().dishId)
        // console.log(doc.id,doc.data().dishId)
        // increaseDishesPrice()
      
      })
      getCartDishes()
    })
  }

// get dishes from selected restaurant of user ***********************************************************************


// get quantity of items from database ******************************************************************

const getQuantityOfItems =(currentUser,id)=>{
  // console.log(`this:${id}`)
  const selectedRestaurantId = new URLSearchParams(window.location.search).get('restaurantId')
  let currentUserUid = firebase.auth().currentUser.uid
  let cartQuantityText = document.getElementById(`cartItemQuantity${id}`)
  let quantityText = document.getElementById(`itemQuantity${id}`);



  db.collection(`PendingOrders:${currentUserUid}`).doc(`${selectedRestaurantId}`).collection(`${currentUserUid}`).doc(`${id}`).get().then((doc) => {
    if (doc.exists) {
      const currentValue = doc.data().itemsQuantity;
      // console.log('when if doc exist while getting data of quantity')
      updateCounter(currentValue,`itemQuantity${id}`,id);
    } 
    else {
      // console.log('there is no any dish in cart')
 
    }
  });
} 

// get quantity of items from database *******************************************************************


// setting quantity of order items in span's innerHTML ***************************************************

const updateCounter = (value,dishIncreaseBtnId,counter)=>{

  let currentUserUid = firebase.auth().currentUser.uid
  const selectedRestaurantId = new URLSearchParams(window.location.search).get('restaurantId')
  let cartQuantityText = document.getElementById(`cartItemQuantity${counter}`)
  let itemsQuantityWhileAdd = document.getElementById(`itemsQuantityWhileAdd${counter}`)
  let quantityText = document.getElementById(`${dishIncreaseBtnId}`)
  let reduceBtnOfDish = document.getElementById(`reduceBtnOfDish${counter}`)

  
  db.collection(`PendingOrders:${currentUserUid}`).doc(`${selectedRestaurantId}`).collection(`${currentUserUid}`).doc(`${counter}`).update({ itemsQuantity: value }).then(()=>{
    
    
    quantityText.innerHTML = value
    
    itemsQuantityWhileAdd ? itemsQuantityWhileAdd.innerHTML = value : null;
    cartQuantityText ? cartQuantityText.innerHTML = value : null;
    
    
  })

    calculateTotalAmount()
 
}

// setting quantity of order items in span's innerHTML *****************************************************
  
// increase quantity of order items **************************************************************************
  
const reduceItemQuantity = (id,counter,cartDishName,cartDishImgUrl,cartDishPrice,cartDishCurrency)=>{

  let quantityText = document.getElementById(`itemQuantity${counter}`);
  let currentCartDish = document.getElementById(`cart_dish${counter}`)
  let cartQuantityText = document.getElementById(`cartItemQuantity${counter}`)
   
    let currentUserUid = firebase.auth().currentUser.uid
  
  const selectedRestaurantId = new URLSearchParams(window.location.search).get('restaurantId')
  let increaseQuantityBtn= document.getElementById(`itemQuantity${counter}`)
  const currentValue = parseInt(increaseQuantityBtn.innerText);
  const newValue = currentValue + 1;

     if (!currentCartDish) {
      
       db.collection(`PendingOrders:${currentUserUid}`).doc(`${selectedRestaurantId}`).collection(`${currentUserUid}`).doc(`${counter}`).set({ itemsQuantity: newValue })

         newValue==1 ? addToCart(id,counter,cartDishName,cartDishImgUrl,cartDishPrice,cartDishCurrency,newValue) : null

        updateCounter(newValue,`itemQuantity${counter}`,`${counter}`);
    
      }
      else {
        
        updateCounter(newValue,`itemQuantity${counter}`,`${counter}`);
 
    //  console.log('else of reduce document ')
    

      }
      
}

// increase quantity of order items **************************************************************************

// decrease quantity of order items **************************************************************************

const decreaseItemQuantity= (id,counter,cartDishName,cartDishImgUrl,cartDishPrice,cartDishCurrency)=>{
  
  let quantityText = document.getElementById(`itemQuantity${counter}`);
  let currentUserUid = firebase.auth().currentUser.uid
  let currentCartDish = document.getElementById(`cart_dish${counter}`)
  let cartQuantityText = document.getElementById(`cartItemQuantity${counter}`)
   

 
  if ( quantityText.innerHTML != 0) {
    // console.log('yaho ')
    const selectedRestaurantId = new URLSearchParams(window.location.search).get('restaurantId');
    let decreaseQuantityBtn = document.getElementById(`itemQuantity${counter}`);
    const currentValue = parseInt(decreaseQuantityBtn.innerText);
    const newValue = currentValue - 1;
    updateCounter(newValue,`itemQuantity${counter}`,counter)
    newValue==0 ? removeFromCart(id,counter) : null;
      
    
    
  }
}
// decrease quantity of order items **************************************************************************


// cartter logic *****************************************************************************************


const addToCart = (id,counter,cartDishName,cartDishImgUrl,cartDishPrice,cartDishCurrency,cartItemsQuantity)=>{

  const selectedRestaurantId = new URLSearchParams(window.location.search).get('restaurantId');
  let currentUserUid = firebase.auth().currentUser.uid
  let cartItemsParent = document.getElementById('cart_dishes');
  let modal_cart_dishes = document.getElementById('modal_cart_dishes');

  db.collection(`PendingOrders:${currentUserUid}`).doc(`${selectedRestaurantId}`).collection(`${currentUserUid}`).doc(`${counter}`).set({
    dishName: cartDishName,
    dishImgUrl: cartDishImgUrl,
    dishPrice:cartDishPrice,
    currency:cartDishCurrency,
    itemsQuantity:cartItemsQuantity
  }
    )
    .then(() => {
    cartItemsParent.innerHTML += `
    <div id="cart_dish${counter}" class="border cartDish cart_dish${counter}">
          <div class="flex items-center h-12 mt-5 border border-l-0 border-r-0">
            <img class="w-20 h-12 rounded-sm" src="${cartDishImgUrl}" alt="">
            <h1 class="ml-2 text-md text-start text-teal-700 font-bold">${cartDishName}</h1>
          </div>
           <div class="flex items-center justify-between px-2 mt-2">
            <span class="pt-2 text-sm text-teal-700 font-bold">${cartDishCurrency}:${cartDishPrice}</span>

            <div class="flex mt-2 pb-2 h-9 ">
              <span onclick="decreaseItemQuantityOfCart('dish${counter}',${counter},'${cartDishName}','${cartDishImgUrl}','${cartDishPrice}','${cartDishCurrency}')" class="bg-white border pt-2 text-xl border-teal-700  text-teal-700 px-2"> <svg
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="w-4 h-3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
                </svg>
              </span>

              <span id="itemsQuantityWhileAdd${counter}" class=" bg-teal-700 text-center text-white p-1 text-sm px-4">${cartItemsQuantity}</span>
              <span onclick="reduceItemQuantityOfCart('dish${counter}',${counter},'${cartDishName}','${cartDishImgUrl}','${cartDishPrice}','${cartDishCurrency}')" class="bg-white border pt-2 text-xl border-teal-700 text-teal-700 px-2"><svg
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="w-4 h-3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </span>
            </div>

          </div>
        </div>
  
    `

    modal_cart_dishes.innerHTML += `
    <div id="cart_dish${counter}" class="border cartDish cart_dish${counter}">
          <div class="flex items-center h-12 mt-5 border border-l-0 border-r-0">
            <img class="w-20 h-12 rounded-sm" src="${cartDishImgUrl}" alt="">
            <h1 class="ml-2 text-md text-start text-teal-700 font-bold">${cartDishName}</h1>
          </div>
           <div class="flex items-center justify-between px-2 mt-2">
            <span class="pt-2 text-sm text-teal-700 font-bold">${cartDishCurrency}:${cartDishPrice}</span>

            <div class="flex mt-2 pb-2 h-9 ">
              <span onclick="decreaseItemQuantityOfCart('dish${counter}',${counter},'${cartDishName}','${cartDishImgUrl}','${cartDishPrice}','${cartDishCurrency}')" class="bg-white border pt-2 text-xl border-teal-700  text-teal-700 px-2"> <svg
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="w-4 h-3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
                </svg>
              </span>

              <span id="itemsQuantityWhileAdd${counter}" class=" bg-teal-700 text-center text-white p-1 text-sm px-4">${cartItemsQuantity}</span>
              <span onclick="reduceItemQuantityOfCart('dish${counter}',${counter},'${cartDishName}','${cartDishImgUrl}','${cartDishPrice}','${cartDishCurrency}')" class="bg-white border pt-2 text-xl border-teal-700 text-teal-700 px-2"><svg
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="w-4 h-3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </span>
            </div>

          </div>
        </div>
  
    `
    console.log(`added cart_dish${counter} successfully`)
      })
      .catch((error) => {
        console.error("Error while adding to cart", error);
      });


}

const removeFromCart = (id,counter)=>{

  const selectedRestaurantId = new URLSearchParams(window.location.search).get('restaurantId');
  let currentUserUid = firebase.auth().currentUser.uid
  let cartItemsParent = document.getElementById('cart_dishes');
  let currentCartDish = document.getElementById(`cart_dish${counter}`)
  let modal_currentCartDish = document.getElementById(`modal_cart_dish${counter}`)
  db.collection(`PendingOrders:${currentUserUid}`).doc(`${selectedRestaurantId}`).collection(`${currentUserUid}`).doc(`${counter}`).delete().then(() => {
    
    currentCartDish ? currentCartDish.remove() : null;
    modal_currentCartDish ? modal_currentCartDish.remove() : null;
    console.log('dish has been deleted from cart')

    }).catch((error) => {
      console.error("Error removing document: ", error);
    });
}

const reduceItemQuantityOfCart = (id,counter,cartDishName,cartDishImgUrl,cartDishPrice,cartDishCurrency)=>{

  
  reduceItemQuantity(id,counter,cartDishName,cartDishImgUrl,cartDishPrice,cartDishCurrency)

}

const decreaseItemQuantityOfCart = (id,counter,cartDishName,cartDishImgUrl,cartDishPrice,cartDishCurrency)=>{

  decreaseItemQuantity(id,counter,cartDishName,cartDishImgUrl,cartDishPrice,cartDishCurrency)

}

var totalAmountOrderedItems;
var totalQuantityOfOrderedItems;

const calculateTotalAmount =()=>{

  let placeOrderBtn = document.getElementById('placeOrderBtn')
  let currentUserUid = firebase.auth().currentUser.uid
  const selectedRestaurantId = new URLSearchParams(window.location.search).get('restaurantId');
  let calculateItem = []
  let totalOfCartItems = document.getElementById('totalOfItems')
  let modal_totalOfCartItems = document.getElementById('modal_totalOfItems')
  let totalAmount;

  db.collection(`PendingOrders:${currentUserUid}`).doc(`${selectedRestaurantId}`).collection(`${currentUserUid}`).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          
          calculateItem.push( doc.data().itemsQuantity * parseInt(doc.data().dishPrice) )
        
      })
  }).then(()=>{
    totalQuantityOfOrderedItems = calculateItem.length
    let sum =  calculateItem.reduce((PreviousVal,currentVal)=>{
      return PreviousVal + currentVal
    },0)
    totalOfCartItems.innerHTML = sum
    modal_totalOfCartItems.innerHTML = sum
    totalAmountOrderedItems = sum
    // console.log(sum)
  });
  // placeOrderBtn.addEventListener('click',function (){
  //   placeOrder(totalAmount)
  // })
  
 
}

async function placeOrder(){
  let currentUserUid = firebase.auth().currentUser.uid
  const selectedRestaurantId = new URLSearchParams(window.location.search).get('restaurantId');
  const selectedRestaurantName = new URLSearchParams(window.location.search).get('restaurantName')
  const dbRefOfCart =  db.collection(`PendingOrders:${currentUserUid}`).doc(`${selectedRestaurantId}`).collection(`${currentUserUid}`)
  let modalOfPlacedOrder = document.getElementById('modalOfPlacedOrder');
  let cart_dishes = document.getElementById('cart_dishes');
  let modal_cart_dishes = document.getElementById('modal_cart_dishes');
  let addToCartBtn  = document.getElementsByClassName('addToCartBtn');
  let totalOfCartItems = document.getElementById('totalOfItems');
  let modal_totalOfCartItems = document.getElementById('modal_totalOfItems');
  let userProfileUrl;
  let currentDate = new Date()
  let fullDate = { day   : currentDate.getDate(),month : currentDate.getMonth() + 1, year  : currentDate.getFullYear()}
  let userName;


    try {
      const querySnapshot = await db.collection("Users")
        .where("userid", "==", currentUserUid)
        .get(); 
      querySnapshot.forEach((doc) => {
        userProfileUrl = doc.data().userProfileUrl;
        userName = doc.data().name;

     
      });
    
    
    } catch (error) {
      console.log("Error getting documents: ", error);
    }

      try {
        const doc = await db.collection('Restaurants').doc(selectedRestaurantId).get();
        let restaurantProfileUrl = '';
      
        if (doc.exists) {
          restaurantProfileUrl = doc.data().restaurantprofileUrl;
        } else {
          console.log("Could not get restaurant name");
        }
      
        await db.collection("placedOrders").add({
          userUid: currentUserUid,
          restaurantProfileUrl: restaurantProfileUrl,
          userProfileUrl: userProfileUrl,
          userName : userName,
          restaurantUid: selectedRestaurantId,
          restaurantName: selectedRestaurantName,
          dishQuantity: totalQuantityOfOrderedItems,
          totalAmount: totalAmountOrderedItems,
          process: 'pending',
          orderDate: `${fullDate.month.toString().padStart(2, '0')}/${fullDate.day.toString().padStart(2, '0')}/${fullDate.year}`
        });
      
        const querySnapshot = await dbRefOfCart.get();
        querySnapshot.forEach(async (doc) => {
          await dbRefOfCart.doc(doc.id).delete();
          cart_dishes.innerHTML = '';
          modal_cart_dishes.innerHTML = '';
          totalOfCartItems.innerHTML = '...';
          Array.from(addToCartBtn).forEach(element => {
            element.innerHTML = '0';
          });
        });
      closeCart()
        toggle();
      } catch (error) {
        console.error("Error:", error);
      }
      
  }

const toggle = () => {

  let blur = document.getElementById('forBlur');
  blur.classList.toggle('active')
   let popup = document.getElementById('modalOfPlacedOrder')
   popup.classList.toggle('hidden')
  
 }




const getUserDashboardData=()=>{
  let currentUserUid = firebase.auth().currentUser.uid
  const selectedRestaurantId = new URLSearchParams(window.location.search).get('restaurantId');
  const selectedRestaurantName = new URLSearchParams(window.location.search).get('restaurantName');
  let userOrdersList = document.getElementById('userOrdersList');
  
  
      
  db.collection("placedOrders").where("userUid", "==", currentUserUid)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
           userOrdersList.innerHTML += `
           <div id=${doc.id} class=" lg:w-5/12 md:w-full sm:w-full max-sm:w-full  userDashboardOrders bg-gray-100 border border-gray-200 rounded h-14 flex items-center mt-3 justify-between">
          <div id=restaurantProfileUrlOf${doc.id} class="w-12 h-12 rounded-full ml-1 mr-2 ">
            <img class="h-12 w-12 rounded" src=${doc.data().restaurantProfileUrl}>
          </div>
          <div>
          <p id="orderRestaurantNameOf${doc.id}" class="text-teal-700 font-bold text-md ">
            ${doc.data().restaurantName}
          </p>
          </div>
          
          <div class="self-end text-gray-500 text-xs mb-1 flex flex-col max-sm:mr-0  mr-8">
            <span >Dishes <span id="userDishesQuantityOf${doc.id}">${doc.data().dishQuantity}</span></span>

            <span class="mt-3"> Total : <span id="userDashboardTotal">${doc.data().totalAmount}</span> </span>
          </div>
          <div class="text-xs  flex flex-col pt-1 mr-3">
            <span id=userOrderProcessOf${doc.id} class="text-yellow-500 italic">${doc.data().process}</span>
            <span id="userOrderDateOf${doc.id}" class="text-gray-400 mt-3">${doc.data().orderDate}</span>
          </div>
        </div>
           
           `
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });

}


const getCartDishes = ()=>{
  let cartItemsParent = document.getElementById('cart_dishes');
  let modal_cart_dishes = document.getElementById('modal_cart_dishes');
  let cartDish = document.querySelectorAll('.cartDish')
  
  let currentUserUid = firebase.auth().currentUser.uid
  const selectedRestaurantId = new URLSearchParams(window.location.search).get('restaurantId');
  modal_cart_dishes.innerHTML = ''
  cart_dishes.innerHTML = ''
  db.collection(`PendingOrders:${currentUserUid}`).doc(`${selectedRestaurantId}`).collection(`${currentUserUid}`).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      
      cartItemsParent.innerHTML += `
      <div id="cart_dish${doc.id}" class="border cartDish cart_dish${doc.id}">
      <div class="flex items-center h-12 mt-5 border border-l-0 border-r-0">
      <img class="w-20 h-12 rounded-sm" src="${doc.data().dishImgUrl}" alt="">
      <h1 class="ml-2 text-md text-start text-teal-700 font-bold">${doc.data().dishName}</h1>
    

        </div>
      
        <div class="flex items-center justify-between px-2 mt-2">
          <span class="pt-2 text-sm text-teal-700 font-bold">${doc.data().currency}: <span id='dishPrice${doc.id}' class='dishPrice'>${doc.data().dishPrice}</span></span>

          <div class="flex mt-2 pb-2 h-9 ">
            <span onclick="decreaseItemQuantityOfCart('dish${doc.id}',${doc.id},'${doc.data().dishName}','${doc.data().imgUrl}','${doc.data().dishPrice}','${doc.data().currency}')" class="bg-white border pt-2 text-xl border-teal-700  text-teal-700 px-2"> <svg
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-4 h-3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
              </svg>
            </span>

            <span id="cartItemQuantity${doc.id}" class=" bg-teal-700 text-center text-white p-1 text-sm px-4">${doc.data().itemsQuantity}</span>

            <span onclick="reduceItemQuantityOfCart('dish${doc.id}',${doc.id},'${doc.data().dishName}','${doc.data().imgUrl}','${doc.data().dishPrice}','${doc.data().currency}')"  class="bg-white border pt-2 text-xl border-teal-700 text-teal-700 px-2"><svg
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-4 h-3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </span>
          </div>

        </div>
      </div>
    
      `
  
      modal_cart_dishes.innerHTML += `
      <div id="cart_dish${doc.id}" class="border cartDish cart_dish${doc.id}">
      <div class="flex items-center h-12 mt-5 border border-l-0 border-r-0">
      <img class="w-20 h-12 rounded-sm" src="${doc.data().dishImgUrl}" alt="">
      <h1 class="ml-2 text-md text-start text-teal-700 font-bold">${doc.data().dishName}</h1>
    

        </div>
      
        <div class="flex items-center justify-between px-2 mt-2">
          <span class="pt-2 text-sm text-teal-700 font-bold">${doc.data().currency}: <span id='dishPrice${doc.id}' class='dishPrice'>${doc.data().dishPrice}</span></span>

          <div class="flex mt-2 pb-2 h-9 ">
            <span onclick="decreaseItemQuantityOfCart('dish${doc.id}',${doc.id},'${doc.data().dishName}','${doc.data().imgUrl}','${doc.data().dishPrice}','${doc.data().currency}')" class="bg-white border pt-2 text-xl border-teal-700  text-teal-700 px-2"> <svg
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-4 h-3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
              </svg>
            </span>

            <span id="cartItemQuantity${doc.id}" class=" bg-teal-700 text-center text-white p-1 text-sm px-4">${doc.data().itemsQuantity}</span>

            <span onclick="reduceItemQuantityOfCart('dish${doc.id}',${doc.id},'${doc.data().dishName}','${doc.data().imgUrl}','${doc.data().dishPrice}','${doc.data().currency}')"  class="bg-white border pt-2 text-xl border-teal-700 text-teal-700 px-2"><svg
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-4 h-3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </span>
          </div>

        </div>
      </div>
    
      `
    })
    
  })

}

// }
// cartter logic *****************************************************************************************



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
const showCart = () => {

  let cartterModal = document.getElementById('modalOfCartter');
    cartterModal.style.display = 'block'
  
}
const closeCart =()=>{
  let cartterModal = document.getElementById('modalOfCartter');
  cartterModal.style.display = 'none'
  
}