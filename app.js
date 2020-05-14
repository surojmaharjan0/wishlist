const list = document.querySelector('.list-group');
const form = document.querySelector('form');
const UIauthor = document.querySelector('.author');
const UIwish = document.querySelector('.wish');
const UIalert = document.querySelector('.alert');

const showAlert = (type, msg) => {
    if (document.querySelector('.alert') !== null)
        document.querySelector('.alert').remove();
    let alert = document.createElement('div');
    alert.innerHTML =
        `
        <div class="alert alert-dismissible ${type}">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            ${msg}
        </div>
    `;
    document.querySelector('#form').insertBefore(alert, form);
    setTimeout(() => {
        if (document.querySelector('.alert') !== null)
            document.querySelector('.alert').remove();
    }, 2000);
}
form.addEventListener('submit', e => {
    e.preventDefault();
    const author = UIauthor.value;
    const wish = UIwish.value;

    if (author === '' || wish === '') {
        showAlert('alert-danger', '<strong>Oh snap! </strong>You need to add both fields!');
    } else {
        const newWish = { author, wish };
        // show alert
        db.collection('wishes').add(newWish).then(() => {
            showAlert('alert-success', '<strong>Hell yeah! </strong> Your wish has been added! ')
        }).catch(err => console.log(err));
    }
    form.reset();
})

const addWish = (wishObj, id) => {
    let li = `
    <li class="list-group-item d-flex justify-content-between align-items-center" data-id="${id}">
        ${wishObj.wish}
        <span class="badge badge-primary badge-pill">${wishObj.author}</span>
        <!-- <button class="btn btn-sm btn-danger delete"> X </button> -->
    </li>
    `;
    list.innerHTML += li;
}

// const removeWish = (id) => {
//     const wishes = document.querySelectorAll('li');
//     wishes.forEach(wish => {
//         if (wish.getAttribute('data-id') === id) {
//             wish.remove();
//         }
//     })
// }

//GET DOCUMENTS
// db.collection('wishes').get().then(snapshot => {
//     snapshot.docs.forEach(doc => {
//         addWish(doc.data(), doc.id);
//     })
// }).catch(err => console.log(err))
db.collection('wishes').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        const doc = change.doc;
        if (change.type === 'added') {
            addWish(doc.data(), doc.id);
        }
        // else if (change.type === 'removed') {
        //     removeWish(doc.id)
        // }
    })
})

list.addEventListener('click', e => {
    if (e.target.classList.contains('delete')) {
        const id = e.target.parentElement.getAttribute('data-id');
        db.collection('wishes').doc(id).delete().then(() => {
            console.log('deleted');
        }).catch(err => console.log(err))
    }
})