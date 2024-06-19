import {boardsManager} from "./controller/boardsManager.js";
import {dataHandler} from "./data/dataHandler.js";



function init() {
    boardsManager.loadBoards();

    registration()
    login()

}

init();

function registration() {
    const formRegister =document.querySelector('.formRegister');
    formRegister.addEventListener('submit', async event => {
          event.preventDefault();

        const formData = new FormData(formRegister);
        const data = Object.fromEntries(formData)
        console.log(data)

        const isValid = validateRegisterForm()

        if(isValid) {
            await dataHandler.createUser(data);
            formRegister.reset()

            const myModal =document.getElementById('registerModal')
            myModal.classList.remove('show');
            myModal.style.display = 'none';
            document.body.classList.remove('modal-open');
            const modalBackdrop = document.querySelector('.modal-backdrop');
            if (modalBackdrop) {
                modalBackdrop.remove();
            }


        }
        else {
            return false
        }
    })

}


function validateRegisterForm() {
    const userName = document.getElementById("userName").value
    const password = document.getElementById("passwordRegister").value
    const passwordRepeat = document.getElementById("password-repeat").value

    if (userName.length < 6) {
        document.getElementById("messageUserName").innerHTML = "Length must be at least 6 characters"
        console.log("user <5")
        return false
    }else {
        document.getElementById("messageUserName").innerHTML =""
    }

    if (password.length < 5) {
        document.getElementById("messagePassword").innerHTML = "Length must be at least 6 characters"
        return false
    } else {
        document.getElementById("messagePassword").innerHTML =""
    }

    if (passwordRepeat !== password) {
         document.getElementById("messagePasswordRepeat").innerHTML ="Passwords not match"
        return false;
    } else {

        document.getElementById("messagePasswordRepeat").innerHTML =""

    }
     // const numSaltRounds = 8;
     //    bcrypt.hash(password, numSaltRounds)
    return true
}



function login() {
        const formLogin =document.querySelector('.formLogin');
        formLogin.addEventListener('submit', async event => {

            const formData = new FormData(formLogin);
            const data = Object.fromEntries(formData)
            console.log(data)
            await dataHandler.getUser(data)
            const myModal =document.getElementById('loginModal')
            myModal.setAttribute('data-bs-dismiss',"modal")
            event.preventDefault();

        })

}