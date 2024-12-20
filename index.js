document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.button1').addEventListener('click', function() {
        const nickname = document.querySelector('.nickname1').value;
        
        if (!nickname) {
            alert('닉네임을 입력해주세요!');
            return;
        }

        // 닉네임을 localStorage에 저장
        localStorage.setItem('currentUser', nickname);
        window.location.href = 'task.html';
    });
}); 