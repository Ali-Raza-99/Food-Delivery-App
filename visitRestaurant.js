

//   function visitRestaurant(id) {
    
    
//     let getRestaurantId = id.getAttribute('id');
//         location.href = 'restaurant.html';
//     let selectedRestaurantDishesParent = document.getElementById('selectedRestaurantDishesParent');

//       db.collection(`${getRestaurantId}`).get().then((querySnapshot) => {
 
//         querySnapshot.forEach((doc) => {
//           selectedRestaurantDishesParent.innerHTML += `
//             <div id='dish${doc.id}' class="card h-auto w-72 mt-8 mb-5  border border-teal-700 rounded">
//             <div id='dishImageParent${doc.id}'><img id="DynamicDishImg${doc.id}" class="p-1 w-72 h-44"
//                 src="${doc.data().imgUrl}" alt=""></div>
//             <div class="flex  px-4 mb-3 text-center">
    
//               <h1 class="text-lg font-bold  text-teal-700">${doc.data().name}/h1>
    
    
//             </div>
//             <hr>
//             <div class="flex justify-between px-5 mt-3 pb-2">
//               <h1 class="text-sm text-teal-700">${doc.data().currency} : ${doc.data().dishPrice}</h1>
//               <h1 class="text-sm  text-teal-700">${doc.data().category_dropdown}</h1>
//             </div>
//             <hr >
//             <div class="flex items-center  justify-between ">
//               <div class="flex px-4 mt-3 pb-2 text-center ">
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
//                   stroke="currentColor" class="w-5 h-5 text-teal-700">
//                   <path stroke-linecap="round" stroke-linejoin="round"
//                     d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
//                 </svg>
//                 <h1 class="text-sm ml-1 text-teal-700">${doc.data().deliveryType}</h1>
//               </div>
              
//             </div>
//             <hr>
          
//               <div  class="flex justify-between mt-2 " id="addtoCartBtn">
//                 <span class="bg-white border pt-3 text-xl border-t-teal-700 border-r-teal-700 text-teal-700 px-3"> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
//                   <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
//                 </svg>
//                   </span>
//                 <span class="bg-teal-700 text-white p-2 px-14">Add to Cart</span>
//                 <span class="bg-white border pt-3 text-xl border-t-teal-700 border-l-teal-700 text-teal-700 px-3"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
//                   <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
//                 </svg>
//                 </span>
//               </div>
    
//           </div>
          
//     `
          
//         });
//       });
       
//  }  


//  const selectedRestaurantUser = () =>{

//   firebase.auth().onAuthStateChanged((user) => {
//     if (user) {
    
//     let uid = user.uid;
//     let email = user.email;
//     let userName = document.getElementById('userName');
//     let userEmail = document.getElementById('userEmail');
//     let userCopyrightYear = document.getElementById('user-copyright-year')
//     let userCountry = document.getElementById('userCountry');
//     let userPhone = document.getElementById('userPhone')
//     let userCity = document.getElementById('userCity');
//     let userProfilePic = document.getElementById('userProfilePic')
//     const currentDate = new Date()
//     const currentYear = currentDate.getFullYear();

//     // getting signUp data of user
//     db.collection(`${`Users`}`).doc(`${uid}`).get().then((doc) => {
//       if (doc.exists) {
//         // console.log("Document data:", doc.data());
//         userName.innerHTML = `${doc.data().name}`
//         userCopyrightYear.innerHTML = `${currentYear}`
//         userEmail.innerHTML = `${doc.data().email}`
//         userCountry.innerHTML = `${doc.data().country}`
//         userCity.innerHTML = `${doc.data().city}`
//         userProfilePic.innerHTML = `<img id="${uid}profile" class="" src="${doc.data().userProfileUrl}" alt="Firebase Image">`
//         userPhone.innerHTML = `${doc.data().phone}`
//       }
      
//       else {
//         // doc.data() will be undefined in this case
//         console.log("No such document!");
//       }
//     }).catch((error) => {
//       console.log("Error getting document:", error);
//     });
    
      


//       // ...
//     } else {
//       console.log('not working yet')
//       // signOutUser()
//       // User is signed out
//       // ...
//     }
//   });


//  }