// الحصول على مرجع لقاعدة البيانات
const database = firebase.database();

// دالة لتنسيق التاريخ
function formatDate(timestamp) {
    if (!timestamp) return 'غير معروف';
    
    const date = new Date(timestamp);
    return date.toLocaleString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// دالة لعرض الرسائل
function showMessage(message, isSuccess = true) {
    const messageDiv = document.getElementById('message');
    if (!messageDiv) return;
    
    messageDiv.textContent = message;
    messageDiv.className = isSuccess ? 'message-success' : 'message-error';
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// دالة للتحقق من تسجيل الدخول
function checkAuth() {
    return localStorage.getItem('loggedIn') === 'true';
}

// دالة لتسجيل الخروج
function logout() {
    logActivity('logout', 'تسجيل الخروج');
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    window.location.href = 'login.html';
}

// دالة لحماية الصفحات
function protectPage(requiredRole = 'user') {
    if (!checkAuth()) {
        window.location.href = 'login.html';
        return;
    }
    
    if (requiredRole === 'admin') {
        const userRole = localStorage.getItem('userRole');
        if (userRole !== 'admin') {
            alert('ليس لديك صلاحية الوصول لهذه الصفحة');
            window.location.href = 'index.html';
        }
    }
}

// دالة لتسجيل النشاط
function logActivity(activityType, details) {
    if (!checkAuth()) return;

    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const timestamp = firebase.database.ServerValue.TIMESTAMP;

    database.ref('system/activityLog').push({
        userId: userId,
        userName: userName,
        activityType: activityType,
        details: details,
        timestamp: timestamp
    });
}

// دالة لتحميل سجل الأنشطة
function loadActivityLog() {
    const logContainer = document.getElementById('activityLog');
    if (!logContainer) return;

    database.ref('system/activityLog').orderByChild('timestamp').limitToLast(20).once('value')
    .then(snapshot => {
        logContainer.innerHTML = '';
        
        if (!snapshot.exists()) {
            logContainer.innerHTML = '<p>لا توجد أنشطة مسجلة</p>';
            return;
        }
        
        const logs = [];
        snapshot.forEach(childSnapshot => {
            logs.push(childSnapshot.val());
        });
        
        // عرض أحدث الأنشطة أولاً
        logs.reverse().forEach(log => {
            const logEntry = document.createElement('div');
            logEntry.className = 'log-entry';
            logEntry.innerHTML = `
                <div class="log-time">${formatDate(log.timestamp)}</div>
                <div class="log-user">${log.userName} (${log.userId})</div>
                <div class="log-details">${log.details}</div>
            `;
            logContainer.appendChild(logEntry);
        });
    });
}