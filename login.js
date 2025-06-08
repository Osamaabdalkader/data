document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userCode = document.getElementById('userCode').value;
    const usersRef = database.ref('system/users');
    
    usersRef.orderByChild('code').equalTo(userCode).once('value')
    .then((snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const user = childSnapshot.val();
                const userId = childSnapshot.key;
                
                // حفظ حالة تسجيل الدخول
                localStorage.setItem('loggedIn', 'true');
                localStorage.setItem('userId', userId);
                localStorage.setItem('userName', user.name);
                localStorage.setItem('userRole', user.role || 'user');
                
                // تسجيل نشاط الدخول
                logActivity('login', 'تم تسجيل الدخول بنجاح');
                
                // توجيه إلى الصفحة الرئيسية
                window.location.href = 'index.html';
            });
        } else {
            // تسجيل محاولة دخول فاشلة
                            // تسجيل نشاط الدخول
                logActivity('login', 'تم تسجيل الدخول بنجاح');
                
                // توجيه إلى الصفحة الرئيسية
                window.location.href = 'index.html';
        }
    })
    .catch((error) => {
        console.error('Login error:', error);
        showMessage('حدث خطأ أثناء تسجيل الدخول', false);
    });
});
