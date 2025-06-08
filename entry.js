document.getElementById('dataForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value || 'غير محدد',
        city: document.getElementById('city').value,
        gender: document.querySelector('input[name="gender"]:checked').value,
        notes: document.getElementById('notes').value || 'لا يوجد',
        timestamp: firebase.database.ServerValue.TIMESTAMP
    };
    
    database.ref('users').push(formData)
    .then(() => {
        showMessage('تم الحفظ بنجاح', true);
        document.getElementById('dataForm').reset();
    })
    .catch((error) => {
        showMessage('خطأ في الحفظ: ' + error.message, false);
    });
});
