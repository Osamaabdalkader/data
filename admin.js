// عناصر الواجهة
const usersBody = document.getElementById('usersBody');
const addUserBtn = document.getElementById('addUserBtn');

// تحميل المستخدمين
function loadUsers() {
    const usersRef = database.ref('system/users');
    
    usersRef.once('value')
    .then((snapshot) => {
        usersBody.innerHTML = '';
        
        if (!snapshot.exists()) {
            usersBody.innerHTML = '<tr><td colspan="5" style="text-align:center">لا يوجد مستخدمين</td></tr>';
            return;
        }
        
        snapshot.forEach((childSnapshot) => {
            const user = childSnapshot.val();
            const userId = childSnapshot.key;
            const createdAt = formatDate(user.createdAt);
            
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.code}</td>
                <td>${user.role}</td>
                <td>${createdAt}</td>
                <td>
                    <button class="btn-edit" data-id="${userId}">تعديل</button>
                    <button class="btn-delete" data-id="${userId}">حذف</button>
                </td>
            `;
            
            usersBody.appendChild(row);
            
            // إضافة معالجات الأحداث للأزرار
            row.querySelector('.btn-edit').addEventListener('click', () => editUser(userId, user));
            row.querySelector('.btn-delete').addEventListener('click', () => deleteUser(userId));
        });
    })
    .catch((error) => {
        console.error('Error loading users:', error);
        alert('حدث خطأ أثناء تحميل المستخدمين: ' + error.message);
    });
}

// إضافة مستخدم جديد
addUserBtn.addEventListener('click', function() {
    const name = prompt('ادخل اسم المستخدم:');
    if (!name) return;
    
    const code = prompt('ادخل الكود السري:');
    if (!code) return;
    
    const role = prompt('ادخل الصلاحية (admin/user):');
    if (!role || (role !== 'admin' && role !== 'user')) {
        alert('الصلاحية يجب أن تكون admin أو user');
        return;
    }
    
    const usersRef = database.ref('system/users');
    usersRef.push({
        name: name,
        code: code,
        role: role,
        createdAt: firebase.database.ServerValue.TIMESTAMP
    })
    .then(() => {
        alert('تم إضافة المستخدم بنجاح');
        logActivity('add_user', `تم إضافة مستخدم: ${name}`);
        loadUsers();
    })
    .catch((error) => {
        alert('حدث خطأ: ' + error.message);
    });
});

// تعديل مستخدم
function editUser(userId, user) {
    const newName = prompt('ادخل الاسم الجديد:', user.name);
    if (!newName) return;
    
    const newCode = prompt('ادخل الكود الجديد:', user.code);
    if (!newCode) return;
    
    const newRole = prompt('ادخل الصلاحية الجديدة (admin/user):', user.role);
    if (!newRole || (newRole !== 'admin' && newRole !== 'user')) {
        alert('الصلاحية يجب أن تكون admin أو user');
        return;
    }
    
    database.ref('system/users/' + userId).update({
        name: newName,
        code: newCode,
        role: newRole
    })
    .then(() => {
        alert('تم تحديث المستخدم بنجاح');
        logActivity('edit_user', `تم تعديل مستخدم: ${user.name} إلى ${newName}`);
        loadUsers();
    })
    .catch((error) => {
        alert('حدث خطأ: ' + error.message);
    });
}

// حذف مستخدم
function deleteUser(userId) {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
    
    database.ref('system/users/' + userId).remove()
    .then(() => {
        alert('تم حذف المستخدم بنجاح');
        logActivity('delete_user', `تم حذف مستخدم: ${userId}`);
        loadUsers();
    })
    .catch((error) => {
        alert('حدث خطأ: ' + error.message);
    });
}

// تحميل المستخدمين عند فتح الصفحة
window.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    loadActivityLog();
});
