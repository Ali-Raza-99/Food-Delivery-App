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